import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    lowercase: true,
  },
  password: {
    type: String,
  },
  city:{
    type:String
  },
  cityId:{
    type:String
  },
  superAdmin:{
    type:Boolean,
    default:false
  },
  userType: {
    type: String,
    enum: ["admin", "capoflotta", "ditta_individuale"],
    default: "admin"
  },
  parentId: {
    type: String,
    default: null
  }
});

export const AdminModel = mongoose.model("AdminMembers", AdminSchema);

