const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const colors = require("colors")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const path = require("path")
const app = express()
dotenv.config()
connectDB();
app.use(cors())
app.use(express.json()) // to accept json data

// app.get("/", (req, res) => {
//     res.send("haiii welcome mendu amulya")
// })
app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)


// -------------------DEPLOYMENT---------------

const __dirname1 = path.resolve(__dirname, "..");
if (process.env.NODE_ENV === "production") {

    app.use(express.static(path.join(__dirname1, "frontend", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))

    });

} else {
    app.get("/", (req, res) => {
        res.send("API is running here..");
    });
}
//---------------------------------------------



app.use(notFound);
app.use(errorHandler)

const port = process.env.PORT || 7000

const server = app.listen(port, console.log(`server is up ${port}`.yellow.bold))
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
})

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id)
        console.log(userData._id);
        socket.emit("connected")
    })
    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined Room:" + room);   // if we click on particular chat that partcular chat id will be displayed
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new Message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })



})
