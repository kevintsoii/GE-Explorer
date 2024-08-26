import GraphQLJSON from "graphql-type-json";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import typeDefs from "@/app/_lib/apollo/schema";
import { dateScalar } from "@/app/_lib/apollo/scalars";
import queryResolvers from "@/app/_lib/apollo/resolvers";

const resolvers = {
  JSON: GraphQLJSON,
  Date: dateScalar,

  Query: { ...queryResolvers },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
  formatError: (err) => ({
    message: err.message,
    locations: err.locations,
    path: err.path,
  }),
  introspection: process.env.NODE_ENV !== "production",
  playground: process.env.NODE_ENV !== "production",
  debug: process.env.NODE_ENV !== "production",
});

const handler = startServerAndCreateNextHandler(server, {
  context: async ({ req, res }) => {
    return true;
  },
});

export { handler as GET, handler as POST };
