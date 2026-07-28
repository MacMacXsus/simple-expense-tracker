import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env file');
}

export const db = mysql.createPool(process.env.DATABASE_URL);

// Startup connection test
db.getConnection()
  .then((connection) => {
    console.log('✅ Connected to Aiven MySQL database successfully!');
    connection.release(); // Return connection back to pool
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
  });