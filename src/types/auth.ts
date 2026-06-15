export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthUserResponse = {
  _id: string;
  name: string;
  email: string;
};