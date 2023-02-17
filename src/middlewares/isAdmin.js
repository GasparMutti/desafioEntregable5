export default function isAdmin(req, res, next) {
  if (req.session.user.role == "admin") next();
  return res.status(401).send({status: 401, error: "Unauthorized"});
}
