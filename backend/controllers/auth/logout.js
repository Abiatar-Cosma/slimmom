import { User } from "../../models/index.js";

const logout = async (req, res) => {
  const { _id } = req.user;


  await User.findByIdAndUpdate(_id, {
    accessToken: "",
    refreshToken: "",
  });


  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .status(200)
    .json({ message: "Logout success" });
};

export default logout;
