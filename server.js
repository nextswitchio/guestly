const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const eventRooms = new Map();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join event room
    socket.on("join-event", (data) => {
      const { eventId, userId, userName } = data;
      
      if (!eventRooms.has(eventId)) {
        eventRooms.set(eventId, {
          eventId,
          attendees: new Set(),
          messages: [],
          moderators: new Set()
        });
      }
      
      const room = eventRooms.get(eventId);
      room.attendees.add(userId);
      socket.join(eventId);
      
      // Send current room state
      socket.emit("room-state", {
        attendees: Array.from(room.attendees),
        messages: room.messages.slice(-50),
        userCount: room.attendees.size
      });
      
      // Notify others
      socket.to(eventId).emit("user-joined", {
        userId,
        userName,
        userCount: room.attendees.size
      });
    });

    // Send message
    socket.on("send-message", (data) => {
      const { eventId, userId, userName, message } = data;
      
      if (eventRooms.has(eventId)) {
        const room = eventRooms.get(eventId);
        const chatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          eventId,
          userId,
          userName,
          message: message.trim(),
          timestamp: Date.now(),
          type: "message"
        };
        
        room.messages.push(chatMessage);
        if (room.messages.length > 100) room.messages.shift();
        
        io.to(eventId).emit("new-message", chatMessage);
      }
    });

    // Leave event
    socket.on("leave-event", (data) => {
      const { eventId, userId } = data;
      if (eventRooms.has(eventId)) {
        const room = eventRooms.get(eventId);
        room.attendees.delete(userId);
        socket.leave(eventId);
        socket.to(eventId).emit("user-left", {
          userId,
          userCount: room.attendees.size
        });
      }
    });
    
    socket.on("disconnect", () => {
      // Cleanup logic could go here if we tracked socket->user mapping
      console.log("User disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log('> WebSocket server initialized');
  });
});
