"use client";

import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/app/_lib/firebase/AuthContext";
import apolloClient from "@/app/_lib/apollo/apolloClient";

export default function Provider({ children }) {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </AuthProvider>
  );
}
