import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use("/", (req,res)=>{
  res.status(200).json({success: true, message : "all good!"});
})

io.on("connection", socket => {

  socket.on("join-room", roomId => {
    socket.join(roomId);
    socket.to(roomId).emit("peer-joined");
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice", candidate);
  });

});

server.listen(3000, () => {
  console.log("Signaling server running");
});


