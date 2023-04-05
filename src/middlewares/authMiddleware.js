import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res
          .status(442)
          .send({ success: false, error_message: "Invalid Token" });
      }
      req.body.user_id = decode.id;
      next();
    });
  } catch (error) {
    console.log(error);
    res
      .status(442)
      .send({ success: false, error_message: "Authentication failure" });
  }
};
