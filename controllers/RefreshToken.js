import Admin from "../models/AdminModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    // const refreshToken = req.headers.authorization?.spilt(" ");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // const decode = jwt.decode(token);
    // console.log(decode);
    if (!token) return res.sendStatus(401);
    const admin = await Admin.findOne({
      refresh_token: token,
    });
    if (!admin) return res.sendStatus(403);
    jwt.verify(
      admin.refresh_token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decode) => {
        if (err instanceof jwt.TokenExpiredError || !err) {
          const adminId = admin.id;
          const name = admin.name;
          const email = admin.email;
          const accessToken = jwt.sign(
            { adminId, name, email },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "20s",
            }
          );
          res.json({ accessToken });
        } else return res.status(403).json(err);
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
