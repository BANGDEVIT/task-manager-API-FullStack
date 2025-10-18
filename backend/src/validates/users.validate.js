export const register = (req, res, next) => {
  if (!req.body.fullname) {
    return res.status(400).json({ message: "fullname is required" });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: "email is required" });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "password is required" });
  }
  next();
};

export const login = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "email is required" });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "password is required" });
  }
  next();
};
