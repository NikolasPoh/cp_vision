module.exports.register = async (server,configs)=> {
    try {
        configs.laabr.tokens.start = () => '[start]'
        return await server.register([{
            plugin: require('laabr'),
            options: configs.laabr
        }]);
    } catch (err) {
        console.log(`Ошибка при регистрации плагина laabr: ${err}`);
    }
}