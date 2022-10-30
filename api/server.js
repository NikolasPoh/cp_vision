const Hapi = require('@hapi/hapi');
const fs = require('fs');
const ip = require("ip");

const init = async (configs) => {
    const {host,port} = configs.server;
    const server = new Hapi.Server({
        debug: { request: ['error'] },
        host: ip.address() || host,
        port: process.env.PORT || port,
        tls: {
            key: fs.readFileSync("./ssl/ca.key"),
            cert: fs.readFileSync("./ssl/ca.pem")
        },
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with','x-custom-header']
            }
        }
    });
    for(let plugin of fs.readdirSync("./plugins")) await require('./plugins/'+plugin).register(server,configs)
    for(let route of fs.readdirSync("./routes")) await server.register({plugin:require('./routes/'+route),options:configs})
    return server;
};
module.exports={init};