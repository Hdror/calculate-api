const { createServer } = require('node:http');

const port = 3006;

const server = createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/calculate') {
        let reqBody = ''
        req.on('data', data => {
            reqBody += data.toString()
        })
        req.on('end', () => {
            let nums
            try {
                nums = JSON.parse(reqBody);
            } catch (error) {
                console.log(error, 'Cannot Parse');
                res.writeHeader(400, { 'Content-type': 'application/json' })
                return res.end(JSON.stringify({ error: 'Data error' }));
            }

            const operation = req.headers['operation-type'];
            // const token = req.headers['authorization'];
            const { num1, num2 } = nums

            if (!num1 || !num2 || !operation) {
                res.writeHeader(400, { 'Content-type': 'application/json' })
                return res.end(JSON.stringify({ error: 'Missing required fields' }));
            }

            if (isNaN(+num1) || isNaN(+num2)) {
                res.writeHeader(400, { 'Content-type': 'application/json' })
                return res.end(JSON.stringify({ error: 'Must be a number' }));
            }

        })
    }



});




server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
