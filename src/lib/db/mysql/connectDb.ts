import sequelize from ".";

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // Ensure all models are synced with the database
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default connectDB;
