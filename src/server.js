import http from 'node:http'

const server = http.createServer((req, res) => {
    return res.end("Batata")
})

server.listen(3333)