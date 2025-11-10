import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { RequestError } from "../helpers/index.js";

const { ACCESS_TOKEN_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw RequestError(401, "Access token missing");
    }

    const { id } = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);

    const user = await User.findById(id);
    if (!user) {
      throw RequestError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
      error.message = "Not authorized";
    }
    next(error);
  }
};

export default authenticate;
