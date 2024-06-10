import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GlobalConfig } from "../utils/config";
import { AdminModel, UserModel } from "./model";
import { ROLE } from "./types";
const salt_rounds = 10;
/**
 * supply plain password arg and returns hashed password
 */
export async function hashPassword(password: string) {
  try {
    const hashed_password = await bcrypt.hash(password, salt_rounds);
    return hashed_password;
  } catch (error: any) {
    throw new Error(error);
  }
}
/**
 * supply plain password as first arg and hashed password as second arg
 */
export async function isCorrectPassword(
  plain_password: string,
  hashed_password: string
) {
  try {
    const result = await bcrypt.compare(plain_password, hashed_password);
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

/**
 * creates a jwt token
 */
export function createAccessToken({
  userId,
  role,
}: {
  userId: string;
  role?: ROLE;
}) {
  return jwt.sign({ userId, role }, GlobalConfig.ACCESS_TOKEN_SECRET, {
    expiresIn: "15d",
  });
}

export async function findUserByID(_id: string) {
  const foundUser = await AdminModel.findOne({
    _id: _id,
  });

  return foundUser;
}
export async function findUserByEmail(email: string) {
  const foundUser = await AdminModel.findOne({
    email: email,
  });

  return foundUser;
}
export async function findAppUserByID(_id: string) {
  const foundUser = await UserModel.findOne({
    _id: _id,
  });

  return foundUser;
}
export async function findAppUserByEmail(email: string) {
  const foundUser = await UserModel.findOne({
    email: email,
  });

  return foundUser;
}
