"use client";

import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/app/_lib/firebase/AuthContext";
import apolloClient from "@/app/_lib/apollo/apolloClient";
import { BookmarksProvider } from "@/app/_lib/contexts/BookmarksContext";
import { ReviewsProvider } from "@/app/_lib/contexts/ReviewsContext";

export default function Provider({ children }) {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <BookmarksProvider>
          <ReviewsProvider>{children}</ReviewsProvider>
        </BookmarksProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}
