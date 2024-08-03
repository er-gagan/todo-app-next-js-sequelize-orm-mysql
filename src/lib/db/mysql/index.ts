import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('todo', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql', // Use the appropriate dialect for your database
    dialectModule: require('mysql2'),
});

export default sequelize;