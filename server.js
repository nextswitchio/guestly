const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Import store functions for persistent chat and presence
let storeModule;
try {
  storeModule = require('./lib/store.ts');
} catch (e) {
  // Fallback if TypeScript module can't be loaded directly
  storeModule = null;
}

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
      
      // Update user presence in persistent store
      if (storeModule?.updateUserPresence) {
        storeModule.updateUserPresence(eventId, userId, userName, 'online');
      }
      
      // Get messages from persistent store if available
      let messages = room.messages.slice(-50);
      if (storeModule?.getChatMessages) {
        messages = storeModule.getChatMessages(eventId, 50);
      }
      
      // Get online users from persistent store
      let onlineUsers = [];
      if (storeModule?.getOnlineUsers) {
        onlineUsers = storeModule.getOnlineUsers(eventId);
      }
      
      // Send current room state
      socket.emit("room-state", {
        attendees: Array.from(room.attendees),
        messages: messages,
        userCount: room.attendees.size,
        onlineUsers: onlineUsers
      });
      
      // Notify others
      socket.to(eventId).emit("user-joined", {
        userId,
        userName,
        userCount: room.attendees.size
      });
      
      // Broadcast updated presence
      io.to(eventId).emit("presence-update", {
        onlineUsers: onlineUsers
      });
    });

    // Send message
    socket.on("send-message", (data) => {
      const { eventId, userId, userName, message, emoji } = data;
      
      if (eventRooms.has(eventId)) {
        const room = eventRooms.get(eventId);
        
        let chatMessage;
        
        // Save to persistent store if available
        if (storeModule?.addChatMessage) {
          chatMessage = storeModule.addChatMessage(eventId, userId, userName, message, 'message', emoji);
        } else {
          // Fallback to in-memory
          chatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            eventId,
            userId,
            userName,
            message: message.trim(),
            timestamp: Date.now(),
            type: "message",
            emoji: emoji
          };
          
          room.messages.push(chatMessage);
          if (room.messages.length > 100) room.messages.shift();
        }
        
        io.to(eventId).emit("new-message", chatMessage);
      }
    });

    // Poll created
    socket.on("poll-created", (data) => {
      const { eventId, poll } = data;
      io.to(eventId).emit("poll-created", { poll });
    });

    // Poll voted
    socket.on("poll-voted", (data) => {
      const { eventId, pollId, poll } = data;
      io.to(eventId).emit("poll-voted", { pollId, poll });
    });

    // Poll closed
    socket.on("poll-closed", (data) => {
      const { eventId, pollId } = data;
      io.to(eventId).emit("poll-closed", { pollId });
    });

    // Q&A question submitted
    socket.on("qa-question", (data) => {
      const { eventId, question } = data;
      io.to(eventId).emit("qa-question", { question });
    });

    // Q&A question upvoted
    socket.on("qa-upvoted", (data) => {
      const { eventId, questionId, question } = data;
      io.to(eventId).emit("qa-upvoted", { questionId, question });
    });

    // Q&A question answered
    socket.on("qa-answered", (data) => {
      const { eventId, questionId, question } = data;
      io.to(eventId).emit("qa-answered", { questionId, question });
    });

    // Q&A question deleted
    socket.on("qa-deleted", (data) => {
      const { eventId, questionId } = data;
      io.to(eventId).emit("qa-deleted", { questionId });
    });

    // Reaction sent
    socket.on("reaction", (data) => {
      const { eventId, reaction } = data;
      io.to(eventId).emit("reaction", { reaction });
    });

    // Discussion events
    socket.on("join-discussion", (data) => {
      const { eventId, userId, userName } = data;
      const roomId = `discussion-${eventId}`;
      socket.join(roomId);
      
      // Notify others that user joined
      socket.to(roomId).emit("user-joined-discussion", {
        userId,
        userName
      });
    });

    socket.on("leave-discussion", (data) => {
      const { eventId, userId } = data;
      const roomId = `discussion-${eventId}`;
      socket.leave(roomId);
      
      socket.to(roomId).emit("user-left-discussion", {
        userId
      });
    });

    socket.on("discussion-thread-created", (data) => {
      const { eventId, thread } = data;
      const roomId = `discussion-${eventId}`;
      io.to(roomId).emit("discussion-thread-created", { thread });
    });

    socket.on("discussion-reply-created", (data) => {
      const { eventId, threadId, reply } = data;
      const roomId = `discussion-${eventId}`;
      io.to(roomId).emit("discussion-reply-created", { threadId, reply });
    });

    socket.on("discussion-typing", (data) => {
      const { eventId, threadId, userId, userName, isTyping } = data;
      const roomId = `discussion-${eventId}`;
      socket.to(roomId).emit("discussion-typing", {
        threadId,
        userId,
        userName,
        isTyping
      });
    });

    // Leave event
    socket.on("leave-event", (data) => {
      const { eventId, userId } = data;
      if (eventRooms.has(eventId)) {
        const room = eventRooms.get(eventId);
        room.attendees.delete(userId);
        socket.leave(eventId);
        
        // Update presence in persistent store
        if (storeModule?.removeUserPresence) {
          storeModule.removeUserPresence(eventId, userId);
        }
        
        // Get updated online users
        let onlineUsers = [];
        if (storeModule?.getOnlineUsers) {
          onlineUsers = storeModule.getOnlineUsers(eventId);
        }
        
        socket.to(eventId).emit("user-left", {
          userId,
          userCount: room.attendees.size
        });
        
        // Broadcast updated presence
        io.to(eventId).emit("presence-update", {
          onlineUsers: onlineUsers
        });
      }
    });
    
    // User typing indicator
    socket.on("typing", (data) => {
      const { eventId, userId, userName, isTyping } = data;
      socket.to(eventId).emit("user-typing", {
        userId,
        userName,
        isTyping
      });
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
