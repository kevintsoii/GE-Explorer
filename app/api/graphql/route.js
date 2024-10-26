import GraphQLJSON from "graphql-type-json";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import connectToDatabase from "../../_lib/mongoose/mongoose";

import typeDefs from "@/app/_lib/apollo/schema";
import { dateScalar } from "@/app/_lib/apollo/scalars";
import queryResolvers from "@/app/_lib/apollo/queryResolvers";
import mutationResolvers from "@/app/_lib/apollo/mutationResolvers";

const firebaseAdminConfig = JSON.parse(process.env.FIREBASE_ADMINCONFIG);
const db = await connectToDatabase();

if (getApps().length === 0) {
  initializeApp({
    credential: cert(firebaseAdminConfig),
  });
}

const resolvers = {
  JSON: GraphQLJSON,
  Date: dateScalar,

  Query: { ...queryResolvers },
  Mutation: { ...mutationResolvers },
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
  context: async (req, res) => {
    const authHeader = req.headers.get("authorization");

    if (authHeader) {
      const token = authHeader.split("Bearer ")[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        return { user: decodedToken };
      } catch (error) {
        console.error("Error verifying Firebase token:", error);
      }
    }

    return { user: null };
  },
});

export { handler as GET, handler as POST };
