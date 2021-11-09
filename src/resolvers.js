var moment = require("moment");
const { snakeToCamel, PlaidClient, PlaidLinkConfig } = require("./helpers");

/**
 * Define the GraphQL resolvers.
 * We use PlaidClient to make calls to the Plaid REST API.
 */
const resolvers = {
  Query: {
    transactions: (_parent, _args, context) =>
      PlaidClient.transactionsGet({
        access_token: context.token,
        start_date: moment().subtract(180, "days").format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD")
      })
        .then(({ data }) =>
          data.transactions.map((r) =>
            snakeToCamel({
              ...r,
              id: r.transaction_id,
              code: r.transaction_code,
              type: r.transaction_type,
              account: data.accounts.find((a) => a.account_id === r.account_id)
            })
          )
        )
        .catch(
          ({ response: { data } }) =>
            new Error(`${data.error_code}: ${data.error_message}`)
        )
  },
  Mutation: {
    getLinkToken: () =>
      PlaidClient.linkTokenCreate(PlaidLinkConfig)
        .then(({ data }) => ({
          token: data.link_token,
          expiration: data.expiration
        }))
        .catch(
          ({ response: { data } }) =>
            new Error(`${data.error_code}: ${data.error_message}`)
        ),
    // Exchange token flow - exchange a Link public_token for an API access_token
    // https://plaid.com/docs/#exchange-token-flow
    getAccessToken: (_parent, args) =>
      PlaidClient.itemPublicTokenExchange({
        public_token: args.publicToken
      })
        .then(({ data }) => ({
          success: data.status_code === 200,
          token: data.access_token
        }))
        .catch(
          ({ response: { data } }) =>
            new Error(`${data.error_code}: ${data.error_message}`)
        )
  }
};

module.exports = {
  resolvers
};
