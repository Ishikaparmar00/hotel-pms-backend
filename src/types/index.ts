export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  vipStatus: boolean;
  loyaltyTier: "Standard" | "Silver" | "Gold" | "Platinum";
  roomNumber: string;
  suiteName: string;
  status: "Checked In" | "Checked Out" | "Reserved";
}

export interface Reservation {
  id: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  roomType: "Standard Room" | "Deluxe Room" | "King Deluxe Suite" | "Presidential Suite";
  arrivalDate: string;
  departureDate: string;
  status: "Checked In" | "Confirmed" | "Checked Out" | "Cancelled";
  rate: number; // Nightly rate
  balance: number;
  paymentStatus: "Paid" | "Pending" | "Authorized";
  groupBlockId?: string;
}

export interface Housekeeper {
  id: string;
  name: string;
  status: "Active" | "Break" | "Off-Duty";
  assignedRooms: string[];
  cleanTimeAvg: number; // minutes
  completedToday: number;
  efficiencyScore: number; // percentage
  avatarUrl: string;
}

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  type: "VIP Arrival" | "Stayover Clean" | "Checkout Clean" | "Deep Clean";
  assignedTo: string; // housekeeper name
  lastUpdated: string;
}

export interface Engineer {
  id: string;
  name: string;
  specialty: "Plumbing" | "Electrical" | "HVAC" | "Carpentry" | "General Maintenance";
  status: "Active" | "Break" | "Off-Duty";
  currentEta: number; // minutes
  activeTaskCount: number;
  avatarUrl: string;
}

export interface WorkOrder {
  id: string;
  roomNumber: string;
  category: "Leakage" | "Painting" | "Cleaning" | "Furniture" | "Electrical" | "HVAC" | "Plumbing";
  priority: "Low" | "Medium" | "High" | "Emergency";
  status: "Pending" | "In Progress" | "Completed";
  assignedEngineerId: string;
  assignedEngineerName: string;
  description: string;
  dateCreated: string;
  dateCompleted?: string;
}

export interface BillingTransaction {
  id: string;
  guestId: string;
  roomNumber: string;
  guestName: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  category: "Room Charge" | "Mini Bar" | "Laundry" | "Room Service" | "Misc Fee" | "Payment";
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  category: "Guest Amenities" | "Linen" | "Maintenance Parts" | "Lighting";
  status: "In Stock" | "Low Stock" | "Out of Stock";
  unitPrice: number;
}

export interface GroupReservationBlock {
  id: string;
  groupName: string;
  eventName: string;
  arrivalDate: string;
  departureDate: string;
  cutOffDate: string;
  totalRoomsBlocked: number;
  roomsPickedUp: number;
  pickupRate: number; // percentage
  inventoryRemaining: number;
}

export interface RecentActivity {
  id: string;
  time: string;
  type: "checkin" | "checkout" | "workorder" | "housekeeping" | "billing" | "system";
  message: string;
  status: "success" | "warning" | "info" | "error";
  roomNumber?: string;
}
