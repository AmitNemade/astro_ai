import jwt from "jsonwebtoken";
import _ from "lodash";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (_.isEmpty(token))
      return res.status(442).send({ success: false, error_message: "Please login to use AstroAI." });

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
