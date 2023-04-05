import { Person } from "../models/personModel.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import mongoose from "mongoose";

export const getAllPersons = async (req, res) => {
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
    debugger;
    return res.status(200).send({
      success: true,
      persons: user.persons ?? [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error_message: error.message });
  }
};

export const addPerson = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(422).send({
        success: false,
        error_message: "User not present.",
        error_code: "user_not_present",
      });
    }
    const person = new Person({ ...req.body, user_id: user.id });
    person.save();
    user.persons.push(person.id);
    user.save();
    return res.status(201).send({
      success: true,
      _id: person.id,
      message: "Person added successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error_message: error.message });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const { person_id } = req.params;
    const { user_id, ...restBody } = req.body;
    const updatedUser = await Person.findByIdAndUpdate(
      person_id,
      { ...restBody },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      user: updatedUser.toJSON(),
      message: "Person details updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error_message: error.message });
  }
};

export const getPersonDetailsnChats = async (req, res) => {
  try {
    const { person_id } = req.params;
    const person = await Person.findById(person_id);
    if (!person) {
      return res
        .status(422)
        .send({ success: false, error_message: "Person not found" });
    }
    const conversations = await Chat.find({
      user_id: new mongoose.Types.ObjectId(person_id),
    });
    return res.status(200).send({
      success: true,
      person: { ...person.toJSON(), conversation: conversations ?? [] },
      message: "Person details updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error_message: error.message });
  }
};
