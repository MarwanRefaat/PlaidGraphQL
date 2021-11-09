const { ApolloServer } = require("apollo-server");
const { resolvers } = require("./resolvers.js");
const { typeDefs, html } = require("./helpers.js");

// ApolloServer Constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "n/a";

    const clientName = req.headers["apollographql-client-name"];
    const clientVersion = req.headers["apollographql-client-version"];
    if (!clientName || !clientVersion)
      throw new Error("All requests must be from an identified client.");

    return { token };
  },
  plugins: [
    {
      async serverWillStart() {
        return {
          async renderLandingPage() {
            return { html };
          }
        };
      },
      async requestDidStart() {
        return {
          didResolveOperation(context) {
            if (!context.operationName) {
              throw new Error("All operations must have a name.");
            }
          }
        };
      }
    }
  ]
});

// The `listen` method launches a web server.
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server is running at ${url}`);
});
