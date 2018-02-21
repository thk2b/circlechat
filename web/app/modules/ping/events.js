module.exports = function(socket, io){
    if(socket.userId){
        return socket.emit('/pong', { meta: { status: 200 }})
    }
    socket.emit('/pong', { meta: { status: 401 }})
}