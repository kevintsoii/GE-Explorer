import { gql } from "graphql-tag";

export default gql`
  scalar JSON
  scalar Date

  type Area {
    area: String!
    title: String!
  }

  type TransferCourse {
    course: String!
    areas: [String]!
  }

  type Transfer {
    college: String!
    courses: [Course]!
  }

  type Section {
    date: String!
    professor: String!
    crn: String!
    seats: String!
    updated: String!
  }

  type Course {
    id: ID!
    identifier: String!
    college: String!
    course: String!
    description: String!
    price: Float!
    units: String!
    title: String!
    sections: [Section]!
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

  type Professor {
    id: ID!
    officialName: String!
    name: String!
    college: String!
    avgRating: Float!
    avgGrade: String!
    avgDifficulty: Float!
    takeAgain: Float!
    tags: JSON!
    reviews: [Review]!
  }

  type Query {
    getAreas: [Area]!
    getProfessor(id: ID): Professor
    getProfessors(name: String, college: String): [Professor]
  }
`;
