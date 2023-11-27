import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  console.log('user connected:', socket.id);


  socket.on('join-room', ({ roomName, username }) => {
    if (typeof roomName !== 'string' || typeof username !== 'string') throw Error('Bad request');
    console.log('join room:', 'user:', username, 'roomName:', roomName, 'id:', socket.id)

    socket.join(roomName); // join the room
    io.to(socket.id).emit('join-room', { roomName }); // send emit to join room
  });

  socket.on('send-message', ({roomName,username, id, message}) => {
    if (typeof roomName !== 'string' || typeof username !== 'string' || typeof id !== 'string' || typeof message !== 'string')
       throw Error('Bad request');
    console.log('send message:', { roomName, id, username, message })

    if(socket.rooms.has(roomName)) return; // check if id is in room 

    // send message event to every one in the room
    socket.in(roomName).emit('send-message', {roomName,username, id, message});
  })


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});