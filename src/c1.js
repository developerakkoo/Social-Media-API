// const io = require('socket.io-client');
// const socket = io('http://192.168.0.113:8000',{
//     auth:{
//         token:'6541f76ab7fb36304ee87af3'
//     }
//   }); // Replace with the actual IP address of your laptop



// socket.on('connect', () => {
//   console.log('Mobile connected to Socket.io');
//   socket.on('onlineUsers', (data) => {
//     console.log('userOnline:', data);
//     });
//     socket.on('msgReceive', (data) => {
//       console.log('status:', data);
//     });
//     socket.on('offlineUsers', (data) => {
//         console.log('userOffline:', data);
//       });
//       socket.on('6541f76ab7fb36304ee87af3', (data) => {
//         console.log('Received message:', data);
//         });
//     });

// socket.on('disconnect', () => {
//   console.log('Mobile disconnected from Socket.io');
// });

const moment = require('moment');

const twentyFourHoursAgo = moment().subtract(24, 'hours').toDate();

console.log(twentyFourHoursAgo);