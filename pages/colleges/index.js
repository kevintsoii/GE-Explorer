import React from "react";
import { gql, useLazyQuery } from "@apollo/client";

import Loader from "@/components/Loader";
import Error from "@/components/Error";

const GET_COLLEGES = gql`
  query GetColleges {
    colleges {
      avgRating
      college
      ratings
    }
  }
`;

const Colleges = () => {
  const [getColleges, { loading, error, data }] = useLazyQuery(GET_COLLEGES);

  return (
    <main className="flex min-h-screen flex-col items-center py-20">
      <div className="">asdad</div>
      {loading && <Loader />}
      {error && <Error />}
      {data && <div>{JSON.stringify(data)}</div>}
      <button onClick={() => getColleges()}>Get Colleges</button>
    </main>
  );
};

export default Colleges;
