import mongoose from "mongoose";

const CategoryModelSchema = new mongoose.Schema({
  adminUserId: {
    type: String,
    require: true,
  },

  category: {
    type: String,
    require: true,
  },
});

export const CategoryModel = mongoose.model(
  "CategoryModel",
  CategoryModelSchema
);
