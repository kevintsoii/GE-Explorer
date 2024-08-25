import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo/apolloClient";
import Head from "next/head";

import Layout from "@/components/Layout";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>GE Explorer</title>
        <meta
          name="description"
          content="Explore CSU General Education courses, professors, and ratings."
        />
        <link rel="icon" href="/compass.svg" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </>
  );
}
