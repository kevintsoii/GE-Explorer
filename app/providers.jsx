"use client";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/app/_lib/apollo/apolloClient";

export default function Provider({ children }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
