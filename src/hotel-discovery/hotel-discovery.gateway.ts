import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class HotelDiscoveryGateway {
  @WebSocketServer()
  server: Server;

  // Method to be called by service when a room is booked/unavailable
  broadcastRoomUpdate(hotelId: number, roomsData: any) {
    this.server.emit('roomAvailabilityUpdate', { hotelId, roomsData });
  }

  @SubscribeMessage('subscribeHotel')
  handleSubscribeHotel(@MessageBody() data: { hotelId: number }) {
    // Optionally handle client joining specific hotel rooms
    return { event: 'subscribed', data };
  }
}
