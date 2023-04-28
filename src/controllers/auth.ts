import express from "express";
import { createUser, getUserByEmail } from "../models/users";
import { random, auth } from "../helpers";
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req: express.Request, res: express.Response) => {
  try {

    const {email, password} = req.body;

    if(!email || !password) {
      return res.status(400).json('All fields are mandatory!');
    };

    const user = await getUserByEmail(email).select('+auth.salt +auth.password');

    if(!user) {
      return res.status(400).json('This user does not exist!');
    };

    const expectedHash = auth(user.auth.salt, password);

    if(expectedHash !== user.auth.password) {
      return res.status(403).json('Incorrect password!');
    };

    const salt = random();
    user.auth.sessionToken = auth(salt, user._id.toString());

    await user.save();

    res.cookie(process.env.COOKIE_NAME, user.auth.sessionToken, {domain: 'localhost', path: '/'});

    return res.status(200).json(`${user.username} loged successfully!`).end();

  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json('All fields are mandatory!');
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json('User already exists!');
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      auth: {
        salt,
        password: auth(salt, password),
      },
    });

    return res.status(200).json(`${user.username} registered successfully!`).end();

  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
