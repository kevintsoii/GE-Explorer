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

const GET_COURSE = gql`
  query Course($identifier: String!) {
    course(identifier: $identifier) {
      identifier
      college
      course
      description
      price
      units
      title
      areas
      sections {
        date
        professor
        crn
        seats
        seats_updated
        avgRating
        avgGrade
      }
    }
  }
`;

const GET_PROFESSOR = gql`
  query Query($college: String!, $name: String!) {
    professor(college: $college, name: $name) {
      id
      officialName
      name
      college
      avgRating
      avgGrade
      avgDifficulty
      takeAgain
      tags
      reviews {
        class
        comment
        date
        difficulty
        rating
        tags
        takeAgain
        grade
        id
      }
    }
  }
`;

const GET_BOOKMARKS = gql`
  query Query {
    bookmarks
  }
`;

const ADD_BOOKMARK = gql`
  mutation Mutation($id: String!) {
    addBookmark(id: $id)
  }
`;

const REMOVE_BOOKMARK = gql`
  mutation Mutation($id: String!) {
    removeBookmark(id: $id)
  }
`;

const GET_BOOKMARK_INFO = gql`
  query BookmarkInfo {
    bookmarkInfo {
      id
      officialName
      college
      avgRating
      avgGrade
      avgDifficulty
      takeAgain
      reviews {
        grade
        rating
      }

      class
      crn
      identifier
      areas
    }
  }
`;

const GET_USER_REVIEWS = gql`
  query Query {
    reviews
  }
`;

const ADD_REVIEW = gql`
  mutation Mutation(
    $class: String!
    $comment: String!
    $difficulty: Int!
    $rating: Int!
    $tags: [String]!
    $takeAgain: Boolean!
    $grade: String!
    $professorId: String!
  ) {
    addReview(
      class: $class
      comment: $comment
      difficulty: $difficulty
      rating: $rating
      tags: $tags
      takeAgain: $takeAgain
      grade: $grade
      professorId: $professorId
    )
  }
`;

const REMOVE_REVIEW = gql`
  mutation Mutation($id: String!) {
    removeReview(id: $id)
  }
`;

export {
  GET_AREAS,
  GET_AREA_NAMES,
  GET_COLLEGES,
  GET_COLLEGE_NAMES,
  GET_COURSES,
  GET_COURSE,
  GET_PROFESSOR,
  GET_BOOKMARKS,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  GET_BOOKMARK_INFO,
  GET_USER_REVIEWS,
  ADD_REVIEW,
  REMOVE_REVIEW,
};
