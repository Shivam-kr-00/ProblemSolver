//1. import dependencies
import http from 'http';
import express from 'express'
import { Server } from 'socket.io'
import { saveMessageService } from '../modules/message/message.service.js'

// 2.create an express app instance
const app = express()

// 3. create http server using express app
const server = http.createServer(app);

// 4 initialize new socket server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

//5. handle socket connection
io.on("connection", (socket) => {
    console.log("user connected", socket.id)

    //6. add join room event becuase we are presenting our chat in rooms
    //so when user click on any problem it will join the room of that problem
    socket.on("joinRoom", (problemId) => {
        socket.join(problemId);
        console.log(`User joined room:${problemId}`)
    })

    // 7. Handle send message Event here
    socket.on("sendMessage", async (data) => {
        try {
            //7.1 get data from client
            const { problemId, senderId, text } = data;

            //7.2 save message in database
            const message = await saveMessageService({ problemId, senderId, text });

            //7.3 populate senderId so frontend receives { _id, name } — same shape as REST history
            await message.populate("senderId", "name");

            //7.4 emit populated message to all users in the room
            io.to(problemId).emit("receiveMessage", message);

        } catch (error) {
            console.log("Error in sending message", error);
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
})

//8. export server ,io and app
//we will use io later for emiiting events from our controllers like notification,new message etc
export { server, app }