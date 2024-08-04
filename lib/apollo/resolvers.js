import { GraphQLError } from "graphql";

import connectToDatabase from "../mongoose/mongoose";
import Professor from "../mongoose/models/professor";
import { anyOrderRegex } from "../util/search";

let db;
(async () => {
  db = await connectToDatabase();
})();

async function getAreas(parent, args, context, info) {
  return null;
}

async function getProfessor(parent, args, context, info) {
  if (!args.id || args.id < 0) {
    throw new GraphQLError("Invalid arguments");
  }
  return await Professor.findOne({ id: args.id });
}

async function getProfessors(parent, args, context, info) {
  let query = {};
  if (args.name && args.name.trim().length > 3) {
    query.officialName = {
      $regex: new RegExp(anyOrderRegex(args.name.trim()), "i"),
    };
  }
  if (args.college && args.college.trim().length > 5) {
    query.college = {
      college: { $regex: new RegExp(args.college.trim(), "i") },
    };
  }

  if (Object.keys(query).length === 0) {
    throw new GraphQLError("Invalid arguments");
  }
  return await Professor.find(query);
}

export { getAreas, getProfessor, getProfessors };
