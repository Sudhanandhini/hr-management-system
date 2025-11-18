const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [admins] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        
        if (admins.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const admin = admins[0];
        const isValidPassword = await bcrypt.compare(password, admin.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};