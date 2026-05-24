import { methods } from "../app/controlador/autenticacion.controlador.js";
import conexion from '../app/db.js';
import bcryptjs from "bcryptjs";


test("login falla si faltan datos", async () => {
  const req = { body: { user: "", password: "" } };
  const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };

  await methods.login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

test("login falla si el usuario no existe", async () => {
  const req = { body: { user: "usuario_fantasma_99", password: "123" } };
  const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
  await methods.login(req, res);
expect(res.status).toHaveBeenCalledWith(400); 
});

test("login falla si la contraseña es incorrecta", async () => {
  const req = { body: { user: "admin", password: "password_equivocado" } };
  const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };

  await methods.login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

test("login exitoso con credenciales correctas", async () => {
  const req = { body: { user: "admin", password: "123456789" } };
  const res = { 
    status: jest.fn().mockReturnValue({ send: jest.fn() }),
    cookie: jest.fn(),
    redirect: jest.fn() // Si es que rediriges al final
  };
  await methods.login(req, res);
  expect(res.redirect).toHaveBeenCalledWith("/inicio");
  expect(res.cookie).toHaveBeenCalled(); 
} );

  afterAll((done) => {
  conexion.end(() => {
    done();
  });
});
