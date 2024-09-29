import { GraphQLError } from "graphql";
import User from "../mongoose/models/user";

async function addBookmark(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  try {
    await User.findOneAndUpdate(
      { email: context.user.email },
      { $addToSet: { bookmarks: args.id } },
      { new: true, upsert: true }
    );
    return true;
  } catch {
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

const resolvers = {
  addBookmark,
  removeBookmark,
};

export default resolvers;
