import express from "express";
import { deleteUserById, getUsers, getUserById } from "../models/users";

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

    const deletedUser = await deleteUserById(id);

    return res.json(`${deletedUser.username} has been deleted successfully!`);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { username } = req.body;
  
      if (!username) {
        return res.sendStatus(400).json(`User with username: ${username} does not exist!`);
      }
  
      const user = await getUserById(id);
      
      user.username = username;
      await user.save();
  
      return res.status(200).json(`Successfully updated ${username}`).end();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }
