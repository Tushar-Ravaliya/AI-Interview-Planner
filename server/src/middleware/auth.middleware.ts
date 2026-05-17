import jwt from "jsonwebtoken";
import { BlacklistModel } from "../models/blacklist.model.ts";

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const blacklistedToken = await BlacklistModel.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
