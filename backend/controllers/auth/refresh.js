import jwt from "jsonwebtoken";
import { User } from "../../models/index.js";
import { RequestError, createTokens } from "../../helpers/index.js";

const { REFRESH_TOKEN_SECRET_KEY, NODE_ENV } = process.env;

const cookieBase = {
  httpOnly: true,
  path: "/",
  // pentru cross-site (GitHub Pages -> Render) e obligatoriu:
  sameSite: "none",
  secure: true, // Render folosește HTTPS
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw RequestError(401, "Missing refresh token");
    }

    let payload;
    try {
      payload = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
    } catch {
      throw RequestError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      throw RequestError(401, "Refresh token mismatch or user not found");
    }

    const { accessToken, refreshToken } = await createTokens(user._id);

    await User.findByIdAndUpdate(user._id, {
      accessToken,
      refreshToken,
    });

    // setează noile cookies
    res
      .cookie("accessToken", accessToken, {
        ...cookieBase,
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieBase,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 zile
      })
      .status(200)
      .json({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error.message);
    const status = error.status || 401;
    res.status(status).json({ message: error.message || "Unauthorized" });
  }
};

export default refresh;
