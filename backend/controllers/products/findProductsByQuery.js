import { Product } from "../../models/index.js";

const findProductsByQuery = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Query parameter 'q' is required" });
  }

  const result = await Product.find(
    { title: { $regex: q, $options: "i" } },
    { title: 1, weight: 1, calories: 1 }
  ).limit(20);

  // chiar dacă e [], e valid
  return res.status(200).json(result);
};

export default findProductsByQuery;
