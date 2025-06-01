const io = require('socket.io-client');

const socket = io('ws://localhost:3000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected to server');
  socket.emit('ping', { test: 'ok' });
});

socket.on('pong', (data) => {
  console.log('📨 Received pong:', data);
});

socket.on('connected', (data) => {
  console.log('📩 Server says:', data);
});
