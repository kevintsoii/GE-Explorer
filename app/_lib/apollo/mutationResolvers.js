import { GraphQLError } from "graphql";
import User from "../mongoose/models/user";

async function addBookmark(parent, args, context) {
  if (!context.user || !context.user.email) {
    throw new GraphQLError("Unauthorized");
  }

  try {
    const user = await User.findOne({ email: context.user.email });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    let bookmarks = user.bookmarks || [];

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
    console.error(error);
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
