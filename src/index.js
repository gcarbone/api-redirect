const express = require('express');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3443;

// Domain mappings (you can move these to .env file in production)
const domainMappings = {
    'example.com': 'https://api1.example.com',
    'test.com': 'https://api2.example.com',
    '127.0.0.1': 'https://production-celigo-labs-ent.gateway.apim.integrator.io',
    'localhost': 'https://production-celigo-labs-ent.gateway.apim.integrator.io',
    'api.integratorio.pro': 'https://production-celigo-labs-ent.gateway.apim.integrator.io',
    'ec2-174-129-46-154.compute-1.amazonaws.com': 'https://production-celigo-labs-ent.gateway.apim.integrator.io'
};

// SSL/TLS configuration
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl/private.key')),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/certificate.crt'))
};

// Middleware to handle redirects
app.use((req, res, next) => {
    const host = req.headers.host;
    const domain = host.split(':')[0]; // Remove port if present
    
    // Check if we have a mapping for this domain
    if (domainMappings[domain]) {
        const targetUrl = domainMappings[domain];
        const fullUrl = `${targetUrl}${req.originalUrl}`;
        
        // Log the redirect (optional)
        console.log(`Redirecting ${req.method} ${req.originalUrl} to ${fullUrl}`);
        
        // Perform the redirect
        res.redirect(301, fullUrl);
    } else {
        // If no mapping exists, return 404
        res.status(404).send('Domain not found in redirect mappings');
    }
});

// Create HTTP server
const httpServer = http.createServer(app);

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

// Start both servers
httpServer.listen(httpPort, () => {
    console.log(`HTTP server running on port ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS server running on port ${httpsPort}`);
    console.log('Configured domain mappings:');
    Object.entries(domainMappings).forEach(([domain, target]) => {
        console.log(`${domain} -> ${target}`);
    });
}); 