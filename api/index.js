const Server = require("./server");
const Configs = require("./config/config.dev.json");
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'ochfonkunem.beget.app',
    user: 'default-db',
    database: 'default-db',
    password:'m2Y2BjzDL%ky',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`Running environment ${process.env.NODE_ENV || "dev"}`);

const start = async (configs) => {
    try {
        const server = await Server.init(configs);
        await server.start();
        console.log("Server running at:", server.info.uri+'/documentation');
    } catch (err) {
        console.error("Error starting server: ", err.message);
        throw err;
    }
};
Configs.pool=pool;
start(Configs).then();