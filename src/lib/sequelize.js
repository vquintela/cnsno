const { Sequelize } = require('sequelize');
const { databaseKeys } = require('./keys');

const database = databaseKeys.database;
const username = databaseKeys.username;
const password = databaseKeys.password;

const sequelize = new Sequelize(database, username, password, {
    host: databaseKeys.host,
    dialect: databaseKeys.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
})
    .catch(err => {
        console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;