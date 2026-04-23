const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function actualizarTodo() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nidec_gages", // Cambia esto por el nombre real
  });

  try {
    // 1. Obtenemos todos los usuarios (ID y Password actual)
    const [rows] = await connection.execute('SELECT UserID, Password FROM usuarios');
    
    console.log(`Procesando ${rows.length} registros...`);

    for (let row of rows) {
      // Solo encriptamos si no parece ser ya un hash de bcrypt 
      // (Los hashes de bcrypt suelen empezar con $2b$ o $2a$)
      if (!row.Password.startsWith('$2b$')) {
        const hash = await bcrypt.hash(row.Password, 10);
        
        // 2. Actualizamos el registro por su ID
        await connection.execute(
          'UPDATE usuarios SET Password = ? WHERE UserID = ?',
          [hash, row.UserID]
        );
        console.log(`✅ Usuario ID ${row.UserID} actualizado.`);
      } else {
        console.log(`⚠️ El ID ${row.UserID} ya parece estar encriptado. Saltando...`);
      }
    }

    console.log('\n--- Proceso terminado con éxito ---');

  } catch (error) {
    console.error('Error durante la actualización:', error);
  } finally {
    await connection.end();
  }
}

actualizarTodo();