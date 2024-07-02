const { createServer } = require('node:http');
const jwt = require('jsonwebtoken');
const port = 3006;
const secretKey = 'xR1jlcGiyWHsR2JoSEOAsg8mMFaLTmStQLdUHqu6CRu4ITA3FfScJAhYSplFEAxb'
// const token = jwt.sign({ userId: '123' }, secretKey, { expiresIn: '1m' });
// console.log(token);
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

            let { num1, num2 } = nums
            const operation = req.headers['operation-type'];
            let reqToken = req.headers['authorization'];

            // Check if any of the props are missing
            if (!num1 || !num2 || !operation) {
                res.writeHeader(400, { 'Content-type': 'application/json' })
                return res.end(JSON.stringify({ error: 'Missing required fields' }));
            }
            // Check that num1 and num2 are intiger type
            if (!isNaN(+num1) && !isNaN(+num2)) {
                num1 = +num1
                num2 = +num2
            } else {
                res.writeHeader(400, { 'Content-type': 'application/json' })
                return res.end(JSON.stringify({ error: 'Must be a number' }));
            }

            if (!reqToken) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No token provided' }));
            }

            // Extract JWT from Authorization header
            reqToken = reqToken.split(' ')[1]

            // Check if the received token is a match to the secret key 
            jwt.verify(reqToken, secretKey, (err, decode) => {
                if (!decode) {
                    console.log('Token expired');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Token expired' }));

                } else if (!decode.exp) {
                    console.log('decode', decode);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Token invalid' }));
                }

                if (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Failed to authenticate token' }));
                }

                let result;
                switch (operation) {
                    case 'add':
                        result = num1 + num2;
                        break;
                    case 'subtract':
                        result = num1 - num2;
                        break;
                    case 'multiply':
                        result = num1 * num2;
                        break;
                    case 'divide':
                        result = num1 / num2;
                        break;
                    default:
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Invalid operation type' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ result }))

            })
        })
    }



});




server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
