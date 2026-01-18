import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import type { UserInterface } from "../models/user.model";
import type { RegisterUserInput, LoginUserInput } from "../utils/validations/auth.validation";

const SALT_ROUNDS = 10;

export async function registerUser(payload: RegisterUserInput): Promise<UserInterface> {
  const mail = payload.mail.toLowerCase();

  const existing = await User.findOne({ mail });
  if (existing) {
    throw new Error("Mail already exists");
  }

  const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const user = await User.create({
    name: payload.name,
    surename: payload.surename,
    mail,
    passwordHash,
    role: "USER",
  });

  return user;
}

export async function loginUser(payload: LoginUserInput): Promise<UserInterface> {
  const mail = payload.mail.toLowerCase();

  const user = await User.findOne({ mail });
  if (!user) {
    throw new Error("Invalid mail or password");
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid mail or password");
  }

  return user;
}
