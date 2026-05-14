const mysql = require("mysql2");

// ----- Configuracion de la Hora local --------
const getReynosaOffset = () => {
  const date = new Date();
  const localString = date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });
  const utcString = date.toLocaleString("en-US", { timeZone: "UTC" });
  const diffMinutes = Math.round(
    (new Date(localString) - new Date(utcString)) / 60000,
  );

  const sign = diffMinutes >= 0 ? "+" : "-";
  const absDiff = Math.abs(diffMinutes);
  const hours = String(Math.floor(absDiff / 60)).padStart(2, "0");
  const minutes = String(absDiff % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
};

const reynosaOffset = getReynosaOffset(); //

// ---- Conexion y comunicacion con la BD ----
const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "nidec_gages", //sisgages
    timezone: reynosaOffset, //
  })
  .promise(); //[cite: 8]

module.exports = db;