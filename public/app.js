const http = require('http');
const fs = require('fs');
const path = require('path');

// URL Empresarial Ocupando la Raíz
const DATABASE_URL = 'https://logistica-b100-default-rtdb.firebaseio.com/.json';

async function getFirebaseData() {
    try {
        const response = await fetch(DATABASE_URL);
        return await response.json();
    } catch (error) {
        return null;
    }
}

const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'style.css'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } else if (req.url === '/dashboard.js') {
        fs.readFile(path.join(__dirname, 'dashboard.js'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
     } else if (req.url === '/api/data') {
        // Agregar preflight OPTIONS
          if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
         });
         res.end();
         return;
          }
    const data = await getFirebaseData();
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',          // ← ESTO resuelve Vercel
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});