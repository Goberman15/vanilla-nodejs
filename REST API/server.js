const http = require('http');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config.js');

const server = http.createServer((req, res) => {

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

    routeHandler.test = (data, cb) => {
        cb(406, {test: 'test'});
    }

    routeHandler.notFound = (data, cb) => {
        cb(404);
    }

    // define routers
    const router = {
        test: routeHandler.test
    };
})

server.listen(config.port, () => console.log(`Server is Running on port ${config.port} in ${config.envName} mode`));