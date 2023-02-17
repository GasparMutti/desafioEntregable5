import {Router} from "express";
import userModel from "../dao/models/users.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const {firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).send({status: 400, error: "Valores incompletos"});
    const exist = await userModel.findOne({email});
    if (exist)
      return res
        .status(400)
        .send({status: 400, error: "El correo ya esta registrado"});
    const result = await userModel.create({
      firstName,
      lastName,
      email,
      password,
    });

    return res.send({status: "success", payload: result});
  } catch (error) {
    console.log(error);
    return res.send({status: 500, error: "Error de registro"});
  }
});

router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
      req.session.user = {
        id: "adminCoder",
        firstName: "Coder",
        lastName: "Admin",
        email: email,
        role: "admin",
      };
      return res.send({
        status: "success",
        message: "Has iniciado sesion satisfactoriamente",
      });
    }
    if (!email || !password)
      return res.status(400).send({status: 400, error: "Valores incompletos"});
    const user = await userModel.findOne({email, password});
    if (!user)
      return res
        .status(400)
        .send({status: 400, error: "Correo o contraseña invalidos"});

    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: "user",
    };

    return res.send({
      status: "success",
      message: "Has iniciado sesion satisfactoriamente",
    });
  } catch (error) {
    res.send({status: 500, error: "Error de login"});
  }
});

router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      return res
        .clearCookie("connect.sid")
        .send({status: "success", message: "logout"});
    } else {
      res.send({status: 500, error: "Error logout"});
    }
  });
});

export default router;
