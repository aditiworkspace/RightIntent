import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const profileSchema = new Schema({
  authUserId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  fullName: { type: String, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer", index: true },
}, { timestamps: true });

export type Profile = InferSchemaType<typeof profileSchema>;
export const ProfileModel = (mongoose.models.Profile as Model<Profile>) || mongoose.model("Profile", profileSchema);
