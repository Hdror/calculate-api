const { createServer } = require('node:http');

const port = 3006;

const server = createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/calculate') {
        let reqBody
        req.on('data', data => {
            reqBody += data.toString()
        })

    }


    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});




server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
