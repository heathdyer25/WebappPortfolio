// Create express app
const express = require('express');
const app = express();

// Import path module
const path = require('path');

// Constant refers to template folder s
const templatesPath = path.join(__dirname, 'templates');
// Use static references
app.use(express.static(path.join(__dirname, 'static')));

// Import API routes
const routes = require('./src/routes.js');
app.use('/api', routes);


// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(templatesPath, 'main.html'));
});

// Login page
app.get('/login', (req, res) => {
    return res.sendFile(path.join(templatesPath, 'login.html'));
});

// Login page
app.get('/register', (req, res) => {
    return res.sendFile(path.join(templatesPath, 'register.html'));
});

// User profile
app.get('/:username', (req, res) => {
    res.sendFile(path.join(templatesPath, 'profile.html'));
});

// Port number we want to use on this server
const PORT = process.env.HOWLER_PORT;

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));