import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: "message" | "system";
}

export interface EventRoomState {
  attendees: string[];
  messages: ChatMessage[];
  userCount: number;
}

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
  }
  return socket;
}
