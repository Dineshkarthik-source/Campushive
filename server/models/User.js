import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    department: { type: String, default: "" },
    year: { type: Number, min: 1, max: 6 },
    role: { type: String, enum: ["student", "organizer", "admin"], default: "student" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
