import { GraphQLError } from "graphql";

import connectToDatabase from "../mongoose/mongoose";
import Professor from "../mongoose/models/professor";
import { anyOrderRegex } from "../util/search";

let db;
(async () => {
  db = await connectToDatabase();
})();

async function getAreas() {
  return await db.collection("ge-areas").find({}).sort({ area: 1 }).toArray();
}

async function getColleges() {
  const transferrability = await db
    .collection("ge-transfers")
    .find({})
    .sort({ college: 1 })
    .toArray();
  const colleges = transferrability.map((t) => t.college);
  return colleges;
}

async function getTransfers(parent, args) {
  if (!args.college) {
    throw new GraphQLError("Invalid arguments");
  }
  return await db
    .collection("ge-transfers")
    .findOne({ college: { $regex: new RegExp(args.college.trim(), "i") } });
}

async function getProfessor(parent, args) {
  if (!args.id || args.id < 0) {
    throw new GraphQLError("Invalid arguments");
  }
  return await Professor.findOne({ id: args.id });
}

async function getProfessors(parent, args) {
  let query = {};
  if (args.name && args.name.trim().length > 3) {
    query.officialName = {
      $regex: new RegExp(anyOrderRegex(args.name.trim()), "i"),
    };
  }
  if (args.college && args.college.trim().length > 5) {
    query.college = {
      $regex: new RegExp(args.college.trim(), "i"),
    };
  }

  if (Object.keys(query).length === 0) {
    throw new GraphQLError("Invalid arguments");
  }
  return await Professor.find(query);
}

async function getCourses(parent, args) {
  let query = {};
  if (args.college && args.college.trim().length > 5) {
    query.college = {
      $regex: new RegExp(args.college.trim(), "i"),
    };
  }

  if (Object.keys(query).length === 0) {
    throw new GraphQLError("Invalid arguments");
  }
  return await db.collection("cc-courses").find(query).toArray();
}

const resolvers = {
  getAreas,
  getColleges,
  getTransfers,
  getProfessor,
  getProfessors,
  getCourses,
};

export default resolvers;
