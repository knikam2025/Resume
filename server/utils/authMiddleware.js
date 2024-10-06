const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        message: "Access denied, no token provided or incorrect format.",
      });
  }

 
  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.userId = decoded.id;

   
    next();
  } catch (err) {
 
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
