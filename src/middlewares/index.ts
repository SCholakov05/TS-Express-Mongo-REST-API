import express from 'express';
import { merge, get } from 'lodash';
import { getUserBySessionToken } from '../models/users';
import dotenv from 'dotenv';

dotenv.config(); // load environment variables from a .env file

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Get session token from cookies
    const sessionToken = req.cookies[process.env.COOKIE_NAME];

    // Check if session token exists
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    // Retrieve user with the given session token
    const existingUser = await getUserBySessionToken(sessionToken);

    // Check if user exists
    if (!existingUser) {
      return res.sendStatus(403);
    }

    // Merge identity of the user with the request object
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

// Middleware to check if the user is the owner of the resource
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Get the id of the user to be checked
    const { id } = req.params;
    // Get the current user's id
    const currentUserId = get(req, 'identity._id') as string;

    // Check if current user's id exists
    if (!currentUserId) {
      return res.sendStatus(400);
    }

    // Check if current user is the owner of the resource
    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}