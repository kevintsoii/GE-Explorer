import { gql } from "@apollo/client";

const GET_AREAS = gql`
  query GetAreas {
    areas {
      area
      title
    }
  }
`;

const GET_AREA_NAMES = gql`
  query GetAreas {
    areas {
      area
    }
  }
`;

const GET_COLLEGES = gql`
  query GetColleges {
    colleges {
      avgRating
      college
      ratings
    }
  }
`;

const GET_COLLEGE_NAMES = gql`
  query GetColleges {
    colleges {
      college
    }
  }
`;

const GET_COURSES = gql`
  query Query(
    $colleges: [String]
    $areas: [String]
    $cursor: String
    $sections: Int
    $searchTerm: String
  ) {
    courses(
      colleges: $colleges
      areas: $areas
      cursor: $cursor
      sections: $sections
      searchTerm: $searchTerm
    ) {
      edges {
        identifier
        college
        course
        description
        price
        units
        title
        avgRating
        avgGrade
        areas
        sectionCount
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export {
  GET_AREAS,
  GET_AREA_NAMES,
  GET_COLLEGES,
  GET_COLLEGE_NAMES,
  GET_COURSES,
};
