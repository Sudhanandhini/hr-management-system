const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('=================================');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('=================================');
    console.log('\nCopy this SQL and run in phpMyAdmin:\n');
    console.log(`UPDATE admin SET password = '${hash}' WHERE username = 'admin';`);
    console.log('\n=================================');
}

generateHash();