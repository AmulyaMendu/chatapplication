const mongoose = require("mongoose")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewurlParser: true,
            useUnifiedTopology: true,

        })
        console.log(`mongodb connectedB: ${conn.connection.host}`)
    } catch {
        console.log(`Error:${error.message}`.red.bold)
        process.exit()
    }
}
module.exports = connectDB