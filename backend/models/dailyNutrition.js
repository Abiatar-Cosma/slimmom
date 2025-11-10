import mongoose from "mongoose";
import handleSaveErrors from "../helpers/handleSaveErrors.js";

const { Schema, model } = mongoose;

const dailyNutritionSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true],
    },
    product: {
      type: String,
      required: [true],
    },
    grams: {
      type: Number,
      required: [true],
    },
    calories: {
      type: Number,
      required: [true],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

dailyNutritionSchema.post("save", handleSaveErrors);

const DailyNutrition = model("dailyNutrition", dailyNutritionSchema);

export default DailyNutrition;
