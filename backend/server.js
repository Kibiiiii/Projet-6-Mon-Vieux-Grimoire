const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const helmet = require('helmet');
const multer = require('./middleware/multer-config');

dotenv.config();

console.log('Clé secrète JWT:', process.env.JWT_SECRET);

app.use(
    helmet({
    contentSecurityPolicy: {
        directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://api.example.com"],
        frameSrc: ["'none'"],
        },
    },
    })
);

const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
};

const port = normalizePort(process.env.PORT || 4000);
app.set('port', port);

const errorHandler = (error) => {
    if (error.syscall !== 'listen') throw error;
    const address = server.address();
    const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
    
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges.`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`${bind} is already in use.`);
            process.exit(1);
        default:
            throw error;
    }
};

const server = http.createServer(app);

app.post('/upload', (req, res) => {
    multer(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }
        }
        res.status(200).json({ message: 'Fichier uploadé avec succès !' });
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
    console.log(`Listening on ${bind}`);
});










