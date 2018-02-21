module.exports = function(socket, io){
    console.log(socket.userId)
    if(socket.userId){
        return socket.emit('/pong', { meta: { status: 200 }})
    }
    socket.emit('/pong', { meta: { status: 401 }})
}