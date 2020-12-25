const http = require('http');
const https = require('https');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const config = require('./config.js');

// HTTP server
const httpServer = http.createServer((req, res) => {
    server(req, res);
})

// HTTPS server
httpsOpts = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsOpts, (req, res) => {
    server(req,res);
})

const server = (req, res) => {
    // parse HTTP headers
    const headers = req.headers;

    // parse request path
    const myUrl = new URL(req.url, `http://${headers.host}`);
    const { pathname } = myUrl;
    const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

    // parse HTTP method
    const method = req.method;

    //parse query string
    const query = myUrl.searchParams;

    //parse payloads
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    // event on data stream
    req.on('data', data => {
        buffer += decoder.write(data);
    })

    // event when no more data to consumed from stream
    req.on('end', () => {
        buffer += decoder.end();

        const handler = router[trimmedPath] ? router[trimmedPath] : routeHandler.notFound;

        let data = {};
        
        handler(data, (statusCode, payload) => {

            const payloadStr = JSON.stringify(payload);

            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadStr);
        })
    })
    
    // define handlers
    const routeHandler = {};

    routeHandler.ping = (data, cb) => {
        cb(200);
    }

    routeHandler.test = (data, cb) => {
        cb(406, {test: 'test'});
    }

    routeHandler.notFound = (data, cb) => {
        cb(404);
    }

    // define routers
    const router = {
        test: routeHandler.test,
        ping: routeHandler.ping
    };
}

httpServer.listen(config.httpPort, () => console.log(`Server is Running on port ${config.httpPort} in ${config.envName} mode`));
httpsServer.listen(config.httpsPort, () => console.log(`Server is Running on port ${config.httpsPort} in ${config.envName} mode`));