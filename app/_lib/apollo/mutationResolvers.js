import { GraphQLError } from "graphql";
import connectToDatabase from "../mongoose/mongoose";
import User from "../mongoose/models/user";

async function addBookmark(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  try {
    let user = await User.findOne({ email: context.user.email });

    let bookmarks = user?.bookmarks || [];

    if (!bookmarks.includes(args.id)) {
      if (bookmarks.length >= 20) {
        bookmarks.shift();
      }
      bookmarks.push(args.id);
    }

    await User.findOneAndUpdate(
      { email: context.user.email },
      { bookmarks: bookmarks },
      { new: true, upsert: true }
    );

    return true;
  } catch (error) {
    return false;
  }
}

async function removeBookmark(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  try {
    await User.findOneAndUpdate(
      { email: context.user.email },
      { $pull: { bookmarks: args.id } },
      { new: true }
    );
    return true;
  } catch {
    return false;
  }
}

async function addReview(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  const {
    class: className,
    comment,
    difficulty,
    rating,
    tags,
    grade,
    takeAgain,
    professorId,
  } = args;

  if (className.length < 3 || className.length > 10) {
    throw new GraphQLError("Invalid class name");
  }
  if (comment.length < 10 || comment.length > 350) {
    throw new GraphQLError("Invalid comment length");
  }
  if (difficulty < 1 || difficulty > 5 || rating < 1 || rating > 5) {
    throw new GraphQLError("Invalid rating or difficulty");
  }
  if (tags.length === 0 || tags.length > 3) {
    throw new GraphQLError("Invalid tags");
  }
  if (grade.length < 1 || grade.length > 2) {
    throw new GraphQLError("Invalid grade");
  }

  const reviewId = `${context.user.uid}-${professorId}`;

  try {
    const db = await connectToDatabase();

    let user = await User.findOne({ email: context.user.email });

    let reviews = user?.reviews || [];

    if (!reviews.includes(reviewId)) {
      reviews.push(reviewId);
    }

    const x = await User.findOneAndUpdate(
      { email: context.user.email },
      { $set: { reviews: reviews } },
      { new: true, upsert: true }
    );

    const result = await db.collection("cc-professors").updateOne(
      { id: Number(professorId), "reviews.id": reviewId },
      {
        $set: {
          "reviews.$.class": className,
          "reviews.$.comment": comment,
          "reviews.$.difficulty": difficulty,
          "reviews.$.rating": rating,
          "reviews.$.tags": tags,
          "reviews.$.grade": grade,
          "reviews.$.takeAgain": takeAgain,
          "reviews.$.date": new Date(),
        },
      }
    );
    if (result.matchedCount === 0) {
      await db.collection("cc-professors").updateOne(
        { id: Number(professorId) },
        {
          $push: {
            reviews: {
              class: className,
              comment,
              difficulty,
              rating,
              tags,
              grade,
              takeAgain,
              id: reviewId,
              date: new Date(),
            },
          },
        },
        { upsert: true }
      );
    }

    return { id: reviewId };
  } catch (error) {
    throw new GraphQLError(error.message);
  }
}

async function removeReview(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  try {
    await User.findOneAndUpdate(
      { email: context.user.email },
      { $pull: { reviews: args.id } },
      { new: true }
    );

    const db = await connectToDatabase();
    await db
      .collection("cc-professors")
      .updateOne(
        { "reviews.id": args.id },
        { $pull: { reviews: { id: args.id } } }
      );

    return { id: args.id };
  } catch (error) {
    throw new GraphQLError(error.message);
  }
}

const resolvers = {
  addBookmark,
  removeBookmark,
  addReview,
  removeReview,
};

export default resolvers;
