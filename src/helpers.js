const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const { gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "index.html")).toString();

const typeDefs = gql`
  ${fs.readFileSync(path.resolve(__dirname, "schema.graphql"), "utf8")}
`;

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const snakeToCamel = (object) => {
  const newObj = {};
  Object.entries(object).forEach(([key, value]) => {
    newObj[toCamel(key)] =
      !!value && typeof value === "object" && !(value instanceof Array)
        ? snakeToCamel(value)
        : value;
  });
  return newObj;
};

/**
 * Define the Plaid Client.
 * Find your API keys in their Dashboard: https://dashboard.plaid.com/account/keys
 */
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET
    }
  }
});
const PlaidClient = new PlaidApi(configuration);

const PlaidLinkConfig = {
  user: {
    client_user_id: "user-id" // a unique id for the current user.
  },
  client_name: "Plaid GraphQL App",
  products: ["transactions"],
  country_codes: ["US"],
  language: "en"
};

module.exports = {
  html,
  typeDefs,
  snakeToCamel,
  PlaidClient,
  PlaidLinkConfig
};
