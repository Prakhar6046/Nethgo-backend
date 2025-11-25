import express, { Application } from "express";
import passport from "passport";
import createCategory from "../../controller/CategoryController/createCategory";
import getCategories from "../../controller/CategoryController/getCategories";
import { deleteCategory } from "../../controller/CategoryController/deleteCategory";
import updateCategory from "../../controller/CategoryController/updateCategory";

const Categoryroutes: Application = express();

Categoryroutes.post(
  "/create-category",
  passport.authenticate("jwt", { session: false }),
  createCategory
);
Categoryroutes.get(
  "/all-categories",
  passport.authenticate("jwt", { session: false }),
  getCategories
);

Categoryroutes.delete(
  "/delete-category",
  passport.authenticate("jwt", { session: false }),
  deleteCategory
);

Categoryroutes.post(
  "/update-category",
  passport.authenticate("jwt", { session: false }),
  updateCategory
);

export default Categoryroutes;
