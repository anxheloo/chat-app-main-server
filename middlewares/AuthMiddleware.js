import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("this is token inside verify token:", token);

  if (!token) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err)
      return res.status(403).json({
        message: "Token is not valid",
      });

    req.userId = payload.userId;

    next();
  });
};
