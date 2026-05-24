import bcryptjs from "bcryptjs";
import JsonWebToken from "jsonwebtoken";
import conexion from "../db.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./.env") });

async function login(req, res) {
  const { usuario, contraseña } = req.body;
  if (!usuario || !contraseña) {
    return res.status(400).send({ status: "error", message: "Faltan datos" });
  }

  conexion.query(
    "SELECT * FROM usuarios WHERE usuario = ?",
    [usuario],
    async (err, resultados) => {
      if (err) return res.status(500).send({ status: "error", message: err });
      if (resultados.length === 0) {
        return res.status(400).send({ status: "error", message: "Usuario no encontrado" });
      }

      const userDB = resultados[0];
      const loginCorrecto = await bcryptjs.compare(contraseña, userDB.contraseña);

      if (!loginCorrecto) {
        return res.status(400).send({ status: "error", message: "Contraseña incorrecta" });
      }

      const token = JsonWebToken.sign(
        { usuario: userDB.usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        path: "/"
      };
      res.cookie("JWT", token, cookieOptions);
      res.status(200).send({ status: "ok", message: "Login exitoso", redirect: "/inicio" });
    }
  );
}

async function registrar(req, res) {
  const { usuario, email, contraseña } = req.body;
  if (!usuario || !contraseña || !email) {
    return res.status(400).send({ status: "error", error: "Faltan datos" });
  }

  conexion.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario], async (err, resultados) => {
    if (err) return res.status(500).send({ status: "error", error: err });
    if (resultados.length > 0) {
      return res.status(400).send({ status: "error", error: "El usuario ya existe" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(contraseña, salt);

    conexion.query(
      "INSERT INTO usuarios (usuario, email, contraseña) VALUES (?, ?, ?)",
      [usuario, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).send({ status: "error", error: err });
        res.status(201).send({ status: "ok", message: "Usuario registrado", redirect: true });
      }
    );
  });
}

export const methods = {
  login,
  registrar
};
