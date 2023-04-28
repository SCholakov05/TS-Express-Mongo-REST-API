import express from "express";
import { createUser, getUserByEmail } from "../models/users";
import { random, auth } from "../helpers";
import dotenv from 'dotenv';

dotenv.config();

// Define login function to handle authentication requests
export const login = async (req: express.Request, res: express.Response) => {
  try {
    // Retrieve email and password from request body
    const {email, password} = req.body;

    // Check if both fields are present, return error if not
    if(!email || !password) {
      return res.status(400).json('All fields are mandatory!');
    };

    // Retrieve user from database using email, and include salt and password fields
    const user = await getUserByEmail(email).select('+auth.salt +auth.password');

    // Return error if user doesn't exist
    if(!user) {
      return res.status(400).json('This user does not exist!');
    };

    // Hash password using retrieved salt and compare with stored password hash
    const expectedHash = auth(user.auth.salt, password);

    // Return error if password is incorrect
    if(expectedHash !== user.auth.password) {
      return res.status(403).json('Incorrect password!');
    };

    // Generate new session token using random salt and user ID
    const salt = random();
    user.auth.sessionToken = auth(salt, user._id.toString());

    // Save session token to database
    await user.save();

    // Set session token as cookie in response header
    res.cookie(process.env.COOKIE_NAME, user.auth.sessionToken, {domain: 'localhost', path: '/'});

    // Return success message with user's name
    return res.status(200).json(`${user.username} logged successfully!`).end();

  } catch (err) {
    // Handle errors by logging and returning status code
    console.log(err);
    res.status(400);
  }
};

// Define register function to handle user registration requests
export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Retrieve email, password, and username from request body
    const { email, password, username } = req.body;

    // Check if all fields are present, return error if not
    if (!email || !password || !username) {
      return res.status(400).json('All fields are mandatory!');
    }

    // Check if user already exists in database, return error if yes
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json('User already exists!');
    }

    // Generate random salt, hash password with salt, and create new user object
    const salt = random();
    const user = await createUser({
      email,
      username,
      auth: {
        salt,
        password: auth(salt, password),
      },
    });

    // Return success message with user's name
    return res.status(200).json(`${user.username} registered successfully!`).end();

  } catch (err) {
    // Handle errors by logging and returning status code
    console.log(err);
    return res.sendStatus(400);
  }
};