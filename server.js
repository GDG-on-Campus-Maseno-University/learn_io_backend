const envUtils = require('./common/envUtils');

// Load environment variables synchronously
envUtils.loadEnv();

const app = require('./app');
const routes = require('./routes/index');
const Initializer = require('./common/initializer');
const errorHandler = require('./middlewares/errorMiddleware');
const logRequestResponse = require('./middlewares/loggerMiddleware');
const fileController = require("./controllers/fileManagerController");
const fileManagerRoutes = require('./routes/fileManagerRoutes');
const multer = require('multer');
const cors = require('cors');
const upload = multer({ storage: fileController.Storage() });

Initializer.init().then(() => {
    try {
        const apiVersion = envUtils.get('API_VERSION') || 'v0.1';

        // Enhanced CORS configuration
        app.use(cors({
            origin: function (origin, callback) {
                // Allow all origins in development, specific ones in production
                if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                    return callback(null, true);
                }
                
                // Production whitelist - modify as needed
                const allowedOrigins = [
                    'https://yourproductiondomain.com',
                    'https://www.yourproductiondomain.com'
                ];
                
                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                
                callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
            exposedHeaders: ['set-cookie'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));

        app.use(`/${apiVersion}`, routes);
        app.use('/', routes);

        app.use(logRequestResponse);
        app.use(errorHandler);
        app.use(fileManagerRoutes(upload));

        const PORT = envUtils.get('PORT') || 3000;
        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        const shutdown = (signal) => {
            console.log(`Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                console.log('Closed all remaining connections.');
                process.exit(0);
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    } catch (error) {
        console.log(`Error while loading the app ${error}`);
    }
}).catch((error) => {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
});