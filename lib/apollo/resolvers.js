import { GraphQLError } from "graphql";

import connectToDatabase from "../mongoose/mongoose";
import Professor from "../mongoose/models/professor";
import { anyOrderRegex } from "../util/search";

let db;
(async () => {
  db = await connectToDatabase();
})();

async function areas() {
  return await db.collection("ge-areas").find({}).sort({ area: 1 }).toArray();
}

async function colleges() {
  const colleges = await Professor.aggregate([
    {
      $group: {
        _id: "$college",
        avgRating: { $avg: "$avgRating" },
        ratings: { $sum: { $size: "$reviews" } },
      },
    },
    {
      $project: {
        _id: false,
        college: "$_id",
        avgRating: { $round: [{ $ifNull: ["$avgRating", 0] }, 1] },
        ratings: "$ratings",
      },
    },
  ]);

  console.log(colleges);

  return colleges;
}

async function courses(parent, args) {
  const courses = await db
    .collection("cc-courses")
    .aggregate([
      {
        $unwind: "$sections",
      },
      {
        $lookup: {
          from: "cc-professors",
          let: {
            professorName: "$sections.professor",
            collegeName: "$college",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$officialName", "$$professorName"] },
                    { $eq: ["$college", "$$collegeName"] },
                  ],
                },
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "professorInfo",
        },
      },
      {
        $unwind: "$professorInfo",
      },
      {
        $group: {
          _id: "$_id",
          college: { $first: "$college" },
          course: { $first: "$course" },
          identifier: { $first: "$identifier" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          units: { $first: "$units" },
          title: { $first: "$title" },
          avgRating: { $avg: "$professorInfo.avgRating" },
          sectionCount: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return courses;
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

const resolvers = {
  areas,
  colleges,
  courses,
  getTransfers,
  getProfessor,
  getProfessors,
};

export default resolvers;
