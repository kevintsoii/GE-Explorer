import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import connectToDatabase from "../mongoose/mongoose";
import Professor from "../mongoose/models/professor";
import User from "../mongoose/models/user";

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

async function course(_, args) {
  const db = await connectToDatabase();
  if (!args.identifier || args.identifier.trim().length === 0) {
    throw new GraphQLError("Invalid arguments");
  }

  const course = await db
    .collection("cc-courses")
    .aggregate([
      {
        $match: {
          identifier: decodeURIComponent(args.identifier),
        },
      },
      { $limit: 1 },
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
        $addFields: {
          "sections.avgRating": "$professorInfo.avgRating",
          "sections.avgGrade": "$professorInfo.avgGrade",
        },
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
          sections: { $push: "$sections" },
        },
      },
    ])
    .toArray();

  return course[0];
}

async function professor(parent, args) {
  if (
    !args.name ||
    args.name.trim().length <= 3 ||
    !args.college ||
    args.college.trim().length <= 5
  ) {
    throw new GraphQLError("Invalid arguments");
  }

  return await Professor.findOne({
    officialName: args.name,
    college: args.college,
  });
}

async function bookmarks(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  const user = await User.findOne({ email: context.user.email });
  return user?.bookmarks || [];
}

async function bookmarkInfo(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  const user = await User.findOne({ email: context.user.email });
  const bookmarks = user?.bookmarks || [];

  let queries = [];
  let crns = [];
  for (const bookmark of bookmarks) {
    const [course, crn] = bookmark.split("|");
    queries.push({
      identifier: course,
    });
    crns.push(crn);
  }

  const db = await connectToDatabase();

  const results = await db
    .collection("cc-courses")
    .aggregate([
      {
        $match: { $or: queries },
      },
      {
        $project: {
          identifier: 1,
          college: 1,
          course: 1,
          title: 1,
          areas: 1,
          sections: {
            $filter: {
              input: "$sections",
              as: "section",
              cond: { $in: ["$$section.crn", crns] },
            },
          },
        },
      },
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
            { $limit: 1 },
          ],
          as: "professorDetails",
        },
      },
      {
        $unwind: {
          path: "$professorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          identifier: 1,
          id: "$professorDetails.id",
          officialName: "$professorDetails.officialName",
          college: "$professorDetails.college",
          avgRating: "$professorDetails.avgRating",
          avgGrade: "$professorDetails.avgGrade",
          avgDifficulty: "$professorDetails.avgDifficulty",
          takeAgain: "$professorDetails.takeAgain",
          class: { $concat: ["$course", " - ", "$title"] },
          crn: "$sections.crn",
          areas: "$areas",
        },
      },
    ])
    .toArray();
  console.log(results);

  return results;
}

const resolvers = {
  areas,
  colleges,
  courses,
  course,
  professor,
  bookmarks,
  bookmarkInfo,
};

export default resolvers;
