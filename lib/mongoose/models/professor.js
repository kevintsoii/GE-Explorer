import mongoose from "mongoose";

const ProfessorSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    officialName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    avgRating: {
      type: Number,
      required: true,
    },
    avgGrade: {
      type: String,
      required: true,
    },
    avgDifficulty: {
      type: Number,
      required: true,
    },
    takeAgain: {
      type: Number,
      required: true,
    },
    tags: {
      type: Object,
      required: true,
    },
    reviews: {
      type: Array,
      required: true,
    },
  },
  { collection: "cc-professors" }
);

export default mongoose.models.Professor ||
  mongoose.model("Professor", ProfessorSchema);
