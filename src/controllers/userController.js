import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (_.isEmpty(email.trim()) || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
      return res.status(422).send({
        success: false,
        error_message: "Enter a valid email",
        error_code: "invalid_input",
      });
    if (_.isEmpty(password.trim()))
      return res.status(422).send({
        success: false,
        error_message: "Enter a valid password",
        error_code: "invalid_input",
      });

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).send({
        success: false,
        error_message: "User not found with this email.",
        error_code: "user_not_exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).send({
        success: false,
        error_message: "Invalid email or password.",
        error_code: "invalid_email_password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(201).send({
      success: true,
      message: "User logged in successfully.",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error_message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    if (_.isEmpty(email.trim()) || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
      return res.status(422).send({
        success: false,
        error_message: "Enter a valid email",
        error_code: "invalid_input",
      });
    if (_.isEmpty(password.trim()))
      return res.status(422).send({
        success: false,
        error_message: "Enter a password",
        error_code: "invalid_input",
      });
    if (password.includes(" ") || password.length < 6)
      return res.status(422).send({
        success: false,
        error_message:
          "Enter a password with more than 6 characters without any spaces",
        error_code: "invalid_input",
      });

    if (password.includes(" ") || confirm_password.length < 6)
      return res.status(422).send({
        success: false,
        error_message: "Confirm password doesn't match the password",
        error_code: "invalid_input",
      });

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(422).send({
        success: false,
        error_message: "User already exist with this email.",
        error_code: "user_already_exist",
      });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);

    const newUser = await User(req.body);
    await newUser.save();
    res
      .status(201)
      .send({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error_message: error.message });
  }
};
export const getUserDetails = async (req, res) => {
  try {
    const { user_id } = req.body;
    let user = await User.findById(user_id);
    if (!user) {
      return res.status(422).send({
        success: false,
        error_message: "User not present.",
        error_code: "user_not_present",
      });
    }
    user = await user.populate("persons");

    res.status(200).send({ success: true, user: user.toJSON() });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error_message: error.message });
  }
};
