"use client";

import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/app/_lib/firebase/AuthContext";
import apolloClient from "@/app/_lib/apollo/apolloClient";
import { BookmarksProvider } from "@/app/_lib/contexts/BookmarksContext";

export default function Provider({ children }) {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <BookmarksProvider>{children}</BookmarksProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}
