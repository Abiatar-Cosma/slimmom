import { Product, User } from "../../models/index.js";
import { RequestError } from "../../helpers/index.js";

const dailyIntakeControllerForUser = async (req, res, next) => {
  const { age, height, currentWeight, desiredWeight, bloodType } = req.body;
  const { _id: id } = req.user;

  const dailyCaloriesCalculate =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - desiredWeight);

  const result = await Product.find(
    {
      [`groupBloodNotAllowed.${bloodType}`]: true,
    },
    {
      title: 1,
      categories: 1,
    }
  );

  if (!result) {
    throw RequestError(404, "Not found");
  }

  const productCategories = result
    .flatMap((product) => product.categories)
    .filter((item, index, array) => array.indexOf(item) === index);

  const dailyIntake = {
    calories: dailyCaloriesCalculate.toFixed(),
    notAllowedProduct: result.map(
      ({ title = "Sorry we don’t find title", categories }) => ({
        title,
        category: categories[0],
      })
    ),
    categories: productCategories,
  };

  await User.findByIdAndUpdate(id, {
    personalData: {
      age,
      height,
      currentWeight,
      desiredWeight,
      bloodType,
    },
    dailyDiet: dailyIntake,
  });

  res.json(dailyIntake);
};

export default dailyIntakeControllerForUser;
