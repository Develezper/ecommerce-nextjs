export type AuthRole = "user" | "admin";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUserResponse = {
  _id: string;
  name: string;
  email: string;
  role: AuthRole;
};

export type LoginResponse = {
  token: string;
  user: AuthUserResponse;
};
