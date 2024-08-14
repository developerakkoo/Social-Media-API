// const io = require('socket.io-client');
// const socket = io('http://192.168.0.113:8000',{
//     auth:{
//         token:'6541f758b7fb36304ee87aef'
//     }
//   }); // Replace with the actual IP address of your laptop

// socket.on('connect', () => {
//   console.log('Mobile connected to Socket.io');
//     socket.on('onlineUsers', (data) => {
//     console.log('userOnline:', data);
//     socket.emit("msgReceive","msg>>>>>>>>>>>>");
//     });
//     socket.on('offlineUsers', (data) => {
//         console.log('userOffline:', data);
//       });
//       socket.on('6541f758b7fb36304ee87aef', (data) => {
//         console.log('Received message:', data);
//       });
//   });

// socket.on('disconnect', () => {
//   console.log('Mobile disconnected from Socket.io');
// });

const schedule = require("node-schedule");
const Post = require("../models/post.model");
const moment = require("moment");
async function deleteExpiredPosts() {
    const twentyFourHoursAgo = moment().subtract(24, "hours").toDate(); // 24 hours in milliseconds
    const result = await Post.deleteMany({
        createdAt: { $lte: twentyFourHoursAgo },
    });
}

// Schedule the task to run every minute
const job = schedule.scheduleJob("* * * * *", async () => {
    console.log("Checking for expired posts...");

    deleteExpiredPosts();
});

// You can add new posts to the `posts` array as users create them
// For example: posts.push({ id: 3, content: 'New Post', createdAt: Date.now() });

// To stop the job (e.g., when your Node.js application shuts down)
// job.cancel();
