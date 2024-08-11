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

  type Course {
    identifier: String!
    college: String!
    course: String!
    description: String!
    price: Float!
    units: String!
    title: String!
    avgRating: Float
    sectionCount: Int!
  }

  type TransferCourse {
    course: String!
    areas: [String]!
  }

  type Transfer {
    college: String!
    courses: [TransferCourse]!
  }

  type Section {
    date: String!
    professor: String!
    crn: String!
    seats: String!
    updated: String!
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
    getColleges: [College]!
    getCourses: [Course]!

    getTransfers(college: String!): Transfer
    getProfessor(id: ID): Professor
    getProfessors(name: String, college: String): [Professor]
  }
`;
