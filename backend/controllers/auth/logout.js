import { User } from "../../models/user.js";

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, {
    accessToken: "",
    refreshToken: "",
  });

  res.status(204).json({
    message: "Logout success",
  });
};

export default logout;
