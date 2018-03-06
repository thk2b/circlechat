module.exports = function(socket, io, { meta, data }={}){
    if(socket.userId){
        return socket.emit('/pong', { meta: { status: 200 }})
    }
    socket.emit('/pong', { meta: { status: 401 }})
}