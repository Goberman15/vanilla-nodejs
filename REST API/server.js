const http = require('http');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');
// const querystring = require('querystring');

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

        console.log(buffer);
        res.end('Well hello everybody');
    })
    

})

server.listen(3400, () => console.log("Server is Running!"));