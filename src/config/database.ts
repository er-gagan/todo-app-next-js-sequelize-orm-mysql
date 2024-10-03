import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

// Environment variables
const dbName: string = process.env.DATABASE_NAME || 'todo';
const dbUsername: string = process.env.DB_USERNAME || 'root';
const dbPassword: string = process.env.DB_PASSWORD || 'root';
const dbHost: string = process.env.DB_HOST || 'localhost';
const isProduction = process.env.NODE_ENV === 'production';

let tempSequelize = new Sequelize({
    username: dbUsername,
    password: dbPassword,
    host: dbHost,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: !isProduction,
});

// Step 2: Authenticate the temporary connection
await tempSequelize.authenticate();
console.log('Connection has been established successfully (without database).');

// Step 3: Create the database if it does not exist
await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
console.log(`Database "${dbName}" ensured to exist.`);

// Step 4: Close the temporary connection
await tempSequelize.close();

// Step 5: Reinitialize Sequelize with the newly created database
const sequelize: Sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: !isProduction,
});

// Step 6: Authenticate the connection with the newly selected database
await sequelize.authenticate();
console.log('Sequelize connection established with the database.');

export default sequelize;