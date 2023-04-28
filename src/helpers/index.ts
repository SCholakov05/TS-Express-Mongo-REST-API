import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // load environment variables from a .env file

export const random = () => crypto.randomBytes(128).toString("base64"); // generate a random string of characters and returns it as a base64-encoded string

export const auth = (salt: string, password: string) => { // function that creates a hashed authentication token from a salt and password
  return crypto 
    .createHmac("sha256", [salt, password].join("/")) // create a new HMAC object with the sha256 algorithm, using the salt and password as the message
    .update(process.env.SECRET) // add the SECRET environment variable to the HMAC object
    .digest("hex"); // generate a hexadecimal string from the HMAC object
};
