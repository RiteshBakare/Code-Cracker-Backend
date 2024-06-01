import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URL}`
        );
        console.log(
            `DB Connected !!!\n🌐 Connection Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error("Database Connection Failed " + error);
        process.exit(1);
    }
};

// RiteshRajaramBakare2003

export default connectToDatabase;