import mongoose from "mongoose";
import handleSaveErrors from "../helpers/handleSaveErrors.js";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    categories: {
      type: Array,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    title: {
      type: Object,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    groupBloodNotAllowed: {
      type: Array,
      required: true,
    },
  },
  { versionKey: false }
);

productSchema.post("save", handleSaveErrors);

export const Product = model("product", productSchema);
