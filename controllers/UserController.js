import User from "../models/UserModel.js";
import path from "path";
import fs from "fs";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const saveUser = (req, res) => {
  // console.log(req);
  if (req.files === null)
    return res.status(404).json({ message: "No file upload" });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });
  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      req.body["image"] = fileName;
      req.body["url"] = url;
      await User.create(req.body);
      res.status(201).json({ message: "user Created Successfuly" });
    } catch (error) {
      console.log(error.message);
      res.status(422).json(error.message);
    }
  });
};

export const updateUser = async (req, res) => {
  const user = await User.findById({
    _id: req.params.id,
  });
  if (!user) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files == null) {
    fileName = user.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${user.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    req.body["image"] = fileName;
    req.body["url"] = url;
    await User.updateOne({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({ message: "user update success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findById({
    _id: req.params.id,
  });
  if (!user) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${user.image}`;
    fs.unlinkSync(filepath);
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "user delete success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
