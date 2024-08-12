import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo/apolloClient";

import Layout from "@/components/Layout";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
