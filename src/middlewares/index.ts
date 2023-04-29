import express from "express";
import { get, merge } from "lodash";
import dotenv from 'dotenv';

dotenv.config();

import { getUserBySessionToken } from "../models/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {

    const sessionToken = req.cookies[process.env.COOKIE_NAME];

    if(!sessionToken) {
        return res.status(403).json('Session token does not exists!');
    };

    const existingUser = getUserBySessionToken(sessionToken);

    if(!existingUser) {
        return res.status(403).json('User does not exists!');
    };

    merge(req, {identify: existingUser});

    return next();

  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
