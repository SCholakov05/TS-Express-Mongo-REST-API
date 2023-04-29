import express from "express";
import { deleteUserById, getUsers } from "../models/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = deleteUserById(id);

    res.status(200).json('User has been deleted successfully!')
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
