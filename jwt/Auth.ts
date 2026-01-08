import jwt from "jsonwebtoken";

export function setUser(user: any) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET ?? "jwtpassword"
  );
}

export function getUser(token: any) {
  return jwt.verify(token, process.env.JWT_SECRET ?? "");
}
