import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import connectToDatabase from "../mongoose/mongoose";
import Professor from "../mongoose/models/professor";
import { anyOrderRegex } from "../util/search";

async function areas() {
  const db = await connectToDatabase();
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
  ]).sort({ college: 1 });

  return colleges;
}

async function courses(_, args) {
  const db = await connectToDatabase();

  const page_size = 15;
  const filters = {};
  if (args.colleges?.length > 0) {
    filters.college = { $in: args.colleges };
  }
  if (args.areas?.length > 0) {
    filters.areas = { $in: args.areas };
  }
  if (args.cursor) {
    filters._id = { $gt: new ObjectId(args.cursor) };
  }
  if (args.sections) {
    filters.sectionCount = { $gte: args.sections };
  }
  if (args.searchTerm) {
    filters.$or = [
      { course: { $regex: new RegExp(args.searchTerm, "i") } },
      { title: { $regex: new RegExp(args.searchTerm, "i") } },
      { description: { $regex: new RegExp(args.searchTerm, "i") } },
    ];
  }

  const courses = await db
    .collection("cc-courses")
    .aggregate([
      {
        $match: {
          ...filters,
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: page_size + 1,
      },
      {
        $unwind: { path: "$sections", preserveNullAndEmptyArrays: true },
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
              $project: { avgRating: 1, avgGrade: 1 },
            },
            {
              $limit: 1,
            },
          ],
          as: "professorInfo",
        },
      },
      {
        $unwind: { path: "$professorInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          college: { $first: "$college" },
          course: { $first: "$course" },
          areas: { $first: "$areas" },
          identifier: { $first: "$identifier" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          units: { $first: "$units" },
          title: { $first: "$title" },
          avgRating: { $avg: "$professorInfo.avgRating" },
          avgGrade: { $avg: "$professorInfo.avgGrade" },
          sectionCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
    .toArray();

  let hasNextPage = false;
  let endCursor = null;
  if (courses.length > page_size) {
    courses.pop();
    hasNextPage = true;
    endCursor = courses[courses.length - 1]._id;
  }

  return {
    edges: courses,
    pageInfo: {
      hasNextPage,
      endCursor,
    },
  };
}

async function getProfessor(parent, args) {
  const db = await connectToDatabase();
  if (!args.id || args.id < 0) {
    throw new GraphQLError("Invalid arguments");
  }
  return await Professor.findOne({ id: args.id });
}

async function getProfessors(parent, args) {
  const db = await connectToDatabase();
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
  getProfessor,
  getProfessors,
};

export default resolvers;
