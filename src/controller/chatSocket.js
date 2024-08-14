const User = require('../models/user.model');


exports.chat_socket_server = async(sever) => {
    try {
        const io = require("socket.io")(sever);
        const userNameSpace= io.of('/user-nameSpace');

        userNameSpace.on('connection',async(socket)=>{

        console.log('User connected');
        const userId = socket.handshake.auth.token


        await User.findByIdAndUpdate(userId,{$set:{is_online:true}}); //update user status to online
        socket.broadcast.emit('onlineUsers',{user:userId});

        socket.on('disconnect',async()=>{

            const userId = socket.handshake.auth.token
            await User.findByIdAndUpdate(userId,{$set:{is_online:false}}); //update user status to offline
            socket.broadcast.emit('offlineUsers',{user:userId});
            console.log('User Disconnected');
        })
    });
    } catch (error) {
        console.log(error);
    }
}
