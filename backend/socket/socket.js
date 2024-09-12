const { Server } = require("socket.io");
const express=require('express')
const http=require('http')

const app =express()

const server=http.createServer(app)

const io=new Server(server,{
  cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
})


const userSocketMap = {}

const getReciverSocketId=(reciverId)=>userSocketMap[reciverId]

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    if (userId && userSocketMap[userId] === socket.id) {  // Only delete if the disconnected socket matches
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });

})

module.exports= {app,server,io,getReciverSocketId}