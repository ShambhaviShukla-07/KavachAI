let io

const initSocket = (server) => {
  const { Server } = require('socket.io')
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`)

    socket.on('join_room', (room) => socket.join(room))

    socket.on('location_update', (data) => {
      io.to(data.room).emit('location_updated', data)
    })

    socket.on('sos_alert', (data) => {
      io.emit('new_sos', data)
    })

    socket.on('emergency_update', (data) => {
      io.emit('emergency_updated', data)
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

const getIO = () => {
  if (!io) throw new Error('Socket not initialized')
  return io
}

module.exports = { initSocket, getIO }
