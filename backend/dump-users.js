require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function dumpUsers() {
  console.log('Connecting to database...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306')
    });
    
    console.log('✅ Connected.');
    
    const [users] = await connection.query('SELECT id, username, role, full_name, is_active, password_hash FROM users');
    console.log('\n--- Users found in database ---');
    if (users.length === 0) {
      console.log('No users found in the database. (The table is empty)');
    } else {
      users.forEach(user => {
        const isBcrypt = user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$');
        console.log(`- ID: ${user.id}`);
        console.log(`  Username/Email: "${user.username}"`);
        console.log(`  Role: "${user.role}"`);
        console.log(`  Full Name: "${user.full_name}"`);
        console.log(`  Is Active: ${user.is_active}`);
        console.log(`  Password Format: ${isBcrypt ? 'Encrypted (Bcrypt)' : 'Plain Text ("' + user.password_hash + '")'}`);
        console.log('------------------------------');
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error querying users:', error.message);
  }
}

dumpUsers();
