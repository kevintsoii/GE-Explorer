import React from "react";
import { gql, useLazyQuery } from "@apollo/client";

import Loader from "@/components/Loader";
import Error from "@/components/Error";

const GET_AREAS = gql`
  query GetAreas {
    areas {
      area
      title
    }
  }
`;

const Areas = () => {
  const [getAreas, { loading, error, data }] = useLazyQuery(GET_AREAS);

  return (
    <main className="flex min-h-screen flex-col items-center py-20">
      <div className="">asdad</div>
      {loading && <Loader />}
      {error && <Error />}
      {data && <div>{JSON.stringify(data)}</div>}
      <button onClick={() => getAreas()}>Get Areas</button>
    </main>
  );
};

export default Areas;
