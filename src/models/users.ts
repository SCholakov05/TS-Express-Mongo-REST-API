import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  auth: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema); // create a new mongoose model based on the UserSchema

export const getUsers = () => UserModel.find(); // returns all users in the User collection

export const getUserByEmail = (email: string) => UserModel.findOne({ email }); // find a user by his email address

export const getUserBySessionToken = (
  sessionToken: string // find a user by his session token
) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });

export const getUserById = (id: string) => UserModel.findById(id); // find a user by his ID

export const createUser = (
  values: Record<string, any> // create a new user
) => new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (
  id: string // delete a user by his ID
) => UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (
  id: string,
  values: Record<string, any> // update a user by his ID
) => UserModel.findByIdAndUpdate({ id, values });
