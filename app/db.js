import mysql from "mysql2";
import iconv from 'iconv-lite';
iconv.encodingExists('cesu8');

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db"
});

conexion.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

export default conexion;   // 👈 aquí está el default

