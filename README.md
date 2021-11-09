# Welcome to the Plaid API! 💳

[Plaid](https://plaid.com/) is a banking transactions API and provides developers with access to banking transactions data with a minimal amount of work. This graph is a light-weight GraphQL wrapper around the Plaid REST API and makes use of the [Plaid Node bindings](https://github.com/plaid/plaid-node).

The code for this graph lives in [CodeSanbox](https://codesandbox.io/s/plaid-graphql-api-end-u7uti?file=/src/index.js). Our container is quick to hibernate, so if you're just visiting for the first time, please make a request to the graph via the [Explorer]({{ graph.url.explorer }}) and give it a minute to warm up.

## Authentication

Since this is a financial transactions API, you need proper auth credentials to query any meaningful data.

To make it easier to run authenticated queries, [we have set up a dev portal](https://u7uti.sse.codesandbox.io/) that embeds this graph's Explorer and combines it with a **Login** button that you can provide login credentials through.

You can click **Login** and fill in credentials in the popup. The Embedded Explorer will then automatically include your login token in its requests.

> 🚧 **Note:** This graph is connected to the Plaid Sandbox, not the production Plaid API. 🚧

> Please don't log in with your real banking credentials; they will not work. You will have to log in with Plaid's Sandbox credentials intead:

> - **username:** `user_good`

- **password:** `pass_good`

> If you want to use this graph with production data and log in with real credentials, follow these steps:

> - _Fork this graph in [CodeSanbox](https://codesandbox.io/s/plaid-graphql-api-end-u7uti?file=/src/index.js)_

- _Sign up for a [Plaid developer account](https://dashboard.plaid.com/overview)_
- _Request access to the Plaid Developer API_
- _In the "Server Control Panel" setting of your fork in CodeSandbox, add the `PLAID_CLIENT_ID` and `PLAID_SECRET` API keys from [your Plaid developer account](https://dashboard.plaid.com/team/keys)_

## Using the graph

### Client identification headers are required

This graph does not allow unidentified traffic and all requests without client identification headers will be rejected. We need this data to have proper observability into the graph's usage.

Both the `apollographql-client-name` and `apollographql-client-version` headers are required.

**Example:**

```
apollographql-client-name: Apollo Rover
apollographql-client-version: 1.0.2
```

### Operation names are required

This graph does not allow anonymous operations, and all requests without an operatino name will be rejected. We need this data to have proper observability over the graph's usage.

We name our operations according to the following semantic structure:

**<product>\_<area>\_<operationDescription>**

- `<product>` – The product that this query has been written for.
  For example: Studio, Rover, VSCode
- `<area>` – This is a generalised area inside that product - this is helps categorize the operation name.
  For example: Explorer, Account, Settings
- `<operationDescription>` – A lower level description name of the operation.
  For example: FieldStatDetails, SubgraphAttribution

**Example operation names:**

- `VSCode_OperationMetadata_FieldStatDetails`
- `Studio_Explorer_SubgraphAttribution`
