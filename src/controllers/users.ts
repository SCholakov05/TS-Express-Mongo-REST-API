import express from "express";
import { deleteUserById, getUsers, getUserById } from "../models/users";

// Define function to get all users
export const getAllUsers = async (
    req: express.Request,
    res: express.Response
    ) => {
    try {
    // Retrieve all users from database
    const users = await getUsers();

    // Return list of users as JSON response
    return res.status(200).json(users);
  } catch (err) {
    // Handle errors by logging and returning status code
    console.log(err);
    return res.sendStatus(400);
  }
};

// Define function to delete a user by ID
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Retrieve user ID from request parameters
    const { id } = req.params;

    // Delete user with given ID from database
    const deletedUser = await deleteUserById(id);

    return res.json(`${deletedUser.username} has been deleted successfully!`);
  } catch (err) {
    // Handle errors by logging and returning status code
    console.log(err);
    return res.sendStatus(400);
  }
};

// Define function to update a user
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        // Retrieve user ID and username from request parameters and body
      const { id } = req.params;
      const { username } = req.body;
  
      // Return error if username does not exist
      if (!username) {
        return res.sendStatus(400).json(`User with username: ${username} does not exist!`);
      }
  
      // Retrieve user from database using ID
      const user = await getUserById(id);
      
      // Update user's username and save changes to database
      user.username = username;
      await user.save();
  
      return res.status(200).json(`Successfully updated ${username}`).end();
    } catch (error) {
        // Handle errors by logging and returning status code
      console.log(error);
      return res.sendStatus(400);
    }
  }
