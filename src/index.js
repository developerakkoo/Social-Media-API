require("dotenv").config();
const { app } = require('./app');
const { connectDB } = require("./db/index.db");
const User = require('./models/user.model');
const PORT = process.env.PORT || 6000;
let server



connectDB()
    .then(() => {
        server = app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT}`);
        const io = require("./utils/socket").init(server);
        io.on('connection',async(socket)=>{

            // console.log('User connected');
            const userId = socket.handshake.auth.token

            await User.findByIdAndUpdate(userId,{$set:{is_online:true}}); //update user status to online
            socket.broadcast.emit('onlineUsers',{user:userId});
            socket.on('disconnect',async()=>{
            
                const userId = socket.handshake.auth.token
                await User.findByIdAndUpdate(userId,{$set:{is_online:false}}); //update user status to offline
                socket.broadcast.emit('offlineUsers',{user:userId});
                // console.log('User Disconnected');
            })
        });
    });
}).catch((err) => {
    console.log("MONGODB contention error", err);
});

// server = app.listen(process.env.PORT,()=>{
//     console.log(`🚀  Server Started : http://localhost:${process.env.PORT}`);
//     const io = require("./utils/socket").init(server);
//     io.on('connection',async(socket)=>{

//         // console.log('User connected');
//         const userId = socket.handshake.auth.token


//         await User.findByIdAndUpdate(userId,{$set:{is_online:true}}); //update user status to online
//         socket.broadcast.emit('onlineUsers',{user:userId});
//         socket.on('disconnect',async()=>{

//             const userId = socket.handshake.auth.token
//             await User.findByIdAndUpdate(userId,{$set:{is_online:false}}); //update user status to offline
//             socket.broadcast.emit('offlineUsers',{user:userId});
//             // console.log('User Disconnected');
//         })
//     });
//     mongoose.connect(process.env.DB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }).then(()=>{
//         console.log(`✅  Connected To MongoDB...`);
//     }).catch((error)=>{
//         console.log(`❌ Error To Connecting DB:${error}`);
//     });
// });