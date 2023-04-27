import express from "express";
import { createUser, getUserByEmail } from "../models/users";
import { random, auth } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        return res.sendStatus(400);
    };

    const salt = random();
    const user = await createUser({
        email,
        username,
        auth: {
            salt,
            password: auth(salt, password),
        }
    });

    return res.status(200).json(user).end();

  } catch (err) {
    console.log('asd');
    
    console.log(err);
    return res.sendStatus(400);
  }
};
