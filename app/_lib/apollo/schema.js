import { gql } from "graphql-tag";

export default gql`
  scalar JSON
  scalar Date

  type Area {
    area: String!
    title: String!
  }

  type College {
    college: String!
    avgRating: Float
    ratings: Int
  }

  type PaginatedCourse {
    identifier: String!
    college: String!
    course: String!
    description: String!
    price: Float
    units: String
    title: String!
    avgRating: Float
    avgGrade: Float
    areas: [String]!
    sectionCount: Int!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type PaginatedCourseResult {
    edges: [PaginatedCourse]!
    pageInfo: PageInfo!
  }

  type Course {
    identifier: String!
    college: String!
    course: String!
    description: String!
    price: Float
    units: String
    title: String!
    areas: [String]!
    sections: [Section]!
  }

  type Section {
    date: String
    professor: String
    crn: String
    seats: String
    seats_updated: String
    avgRating: Float
    avgGrade: Float
  }

  type Professor {
    id: ID!
    officialName: String!
    name: String!
    college: String
    avgRating: Float
    avgGrade: String
    avgDifficulty: Float
    takeAgain: Float
    tags: JSON
    reviews: [Review]
  }

  type Review {
    class: String
    comment: String
    date: Date
    difficulty: Float
    rating: Float
    tags: [String]
    takeAgain: Boolean
    grade: String
  }

  type Bookmark {
    id: String!
  }

  type Query {
    areas: [Area]!
    colleges: [College]!
    courses(
      colleges: [String]
      areas: [String]
      cursor: String
      sections: Int
      searchTerm: String
    ): PaginatedCourseResult!
    course(identifier: String!): Course
    professor(college: String!, name: String!): Professor
    bookmarks: [Bookmark]
  }
`;
