import GraphQLJSON from "graphql-type-json";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import typeDefs from "../../lib/apollo/schema";
import { dateScalar } from "../../lib/apollo/scalars";
import {
  getAreas,
  getProfessor,
  getProfessors,
} from "../../lib/apollo/resolvers";

const resolvers = {
  JSON: GraphQLJSON,
  Date: dateScalar,

  Query: {
    getAreas,
    getProfessor,
    getProfessors,
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: process.env.NODE_ENV !== "production",
  playground: process.env.NODE_ENV !== "production",
});

export default startServerAndCreateNextHandler(server, {
  context: async ({ req, res }) => {
    return true;
  },
});
