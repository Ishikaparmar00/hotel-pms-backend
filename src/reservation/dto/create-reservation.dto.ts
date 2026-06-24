export class CreateReservationDto {
  guestName: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  roomId: number;
}