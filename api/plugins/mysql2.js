module.exports.register = async (server,configs)=> {
    try {
        return await server.register([{
            plugin: require('hapi-mysql2'),
            options: configs.mySQL
        }]);
    } catch (err) {
        console.log(`Ошибка при регистрации плагина mysql2: ${err}`);
    }
}