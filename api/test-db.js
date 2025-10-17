import { pool } from './src/db.js';

async function testConnection() {
  try {
    console.log('Probando conexión a la base de datos...');
    
    // Probar conexión básica
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Conexión exitosa:', rows[0]);
    
    // Verificar tablas
    const [tables] = await pool.query('SHOW TABLES');
    console.log('📋 Tablas encontradas:', tables.map(t => Object.values(t)[0]));
    
    // Contar registros en cada tabla
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [hospitals] = await pool.query('SELECT COUNT(*) as count FROM hospitals');
    const [doctors] = await pool.query('SELECT COUNT(*) as count FROM doctors');
    
    console.log('👥 Usuarios:', users[0].count);
    console.log('🏥 Hospitales:', hospitals[0].count);
    console.log('👨‍⚕️ Doctores:', doctors[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
}

testConnection();