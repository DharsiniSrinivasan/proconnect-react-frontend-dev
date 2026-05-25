// websocketService.ts
class WebSocketService {
  socket: WebSocket | null = null;
  isConnected = false;

  connect(token: string) {
    if (this.socket) return;
 
    this.socket = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET_DEV}?token=${token}`,
    );

    this.socket.onopen = () => {
   
      this.isConnected = true;
    };

    this.socket.onclose = () => {
  
      this.socket = null;
      this.isConnected = false;
    };
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  subscribe(callback: (msg: any) => void) {
    if (!this.socket) return;

    this.socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      callback(parsed);
    };
  }
  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
  getSocket() {
    return this.socket;
  }
}

export const websocketService = new WebSocketService();
