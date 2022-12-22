import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAdmin = async (req, res) => {
  try {
    const admins = await Admin.find({}, ["_id", "name", "email"]);
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: "Password dan Confirm Password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const admin = await Admin.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const admin = await Admin.find({
      email: req.body.email,
    });
    const match = await bcrypt.compare(req.body.password, admin[0].password);
    if (!match) return res.status(400).json({ message: "Wrong Password" });
    const adminId = admin[0].id;
    const name = admin[0].name;
    const email = admin[0].email;
    const accessToken = jwt.sign(
      { adminId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    // const refreshToken = jwt.sign(
    //   { adminId, name, email },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   {
    //     expiresIn: "1d",
    //   }
    // );
    await Admin.findByIdAndUpdate(adminId, {
      $set: { refresh_token: accessToken },
    });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ message: "Email tidak ditemukan" });
  }
};

export const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(204);
  const admin = await Admin.find({
    refresh_token: token,
  });
  if (!admin[0]) return res.sendStatus(204);
  const adminId = admin[0].id;
  await Admin.findByIdAndUpdate(adminId, {
    $set: { refresh_token: null },
  });
  // res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
