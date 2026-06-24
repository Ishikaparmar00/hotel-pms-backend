import { 
  Guest, 
  Reservation, 
  Housekeeper, 
  HousekeepingTask, 
  Engineer, 
  WorkOrder, 
  BillingTransaction, 
  InventoryItem, 
  GroupReservationBlock,
  RecentActivity
} from "../types";

// Base datasets for generator
const FIRST_NAMES = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Elizabeth", "William", "Linda", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa", "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Gary", "Cynthia", "Jacob", "Kathleen", "Nicholas", "Amy", "Gregory", "Shirley", "Eric", "Angela", "Alexander", "Helen", "Stephen", "Anna", "Edward", "Brenda", "Patrick", "Pamela", "Brandon", "Nicole", "Jack", "Emma", "Gregory", "Samantha", "Jerry", "Katherine", "Dennis", "Christine", "Tyler", "Debra", "Aaron", "Rachel", "Henry", "Carolyn", "Jose", "Janet", "Douglas", "Maria", "Peter", "Heather", "Adam", "Diane"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster"];

const ROOM_TYPES = [
  { type: "Standard Room", rate: 150, suites: ["101", "102", "103", "104", "105", "106", "107", "108", "201", "202", "203", "204", "205", "206", "207", "208"] },
  { type: "Deluxe Room", rate: 250, suites: ["301", "302", "303", "304", "305", "306", "307", "308", "309", "310"] },
  { type: "King Deluxe Suite", rate: 450, suites: ["401", "402", "403", "404", "405", "501", "502", "503"] },
  { type: "Presidential Suite", rate: 950, suites: ["601", "602"] }
];

const SPECIALTIES = ["Plumbing", "Electrical", "HVAC", "Carpentry", "General Maintenance"] as const;
const HOUSEKEEPER_FIRST_NAMES = ["Elena", "Marcus", "Sofia", "Carlos", "Nina", "Raul", "Maria", "Lucia", "Luis", "Anna", "Olga", "Dmitry", "Hans", "Ingrid", "Sven", "Astrid", "Francois", "Chloe", "Mateo", "Clara", "Koji", "Yuki", "Pedro", "Camila", "Kenji", "Hana", "Ahmed", "Fatima", "Ali", "Zainab", "Raj", "Priya", "Vikram", "Anjali", "Javier", "Isabella", "Diego", "Carmen", "Lucas", "Julia"];
const ENGINEER_FIRST_NAMES = ["Arthur", "Frank", "Helen", "Robert", "David", "George", "Thomas", "Steven", "Kevin", "Richard", "Walter", "Edward", "Raymond", "Harold", "Roy", "Philip", "Ralph", "Louis", "Harry", "Victor", "Bruce", "Eugene", "Billy", "Howard", "Albert"];

// Seedable random number generator helper to ensure deterministic generation
function seedRandom(seed: number) {
  const mask = 0xffffffff;
  let m_w = (123456789 + seed) & mask;
  let m_z = (987654321 - seed) & mask;

  return function() {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    let result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
  };
}

const random = seedRandom(42);

// Generate 100 Guests
export const guests: Guest[] = [];
for (let i = 0; i < 100; i++) {
  const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
  const vipStatus = random() < 0.15; // 15% VIP
  const loyaltyTiers: Guest["loyaltyTier"][] = ["Standard", "Silver", "Gold", "Platinum"];
  const loyaltyTier = vipStatus 
    ? (random() < 0.5 ? "Platinum" : "Gold")
    : loyaltyTiers[Math.floor(random() * 3)]; // Standard, Silver, Gold

  const roomTypeIndex = Math.floor(random() * ROOM_TYPES.length);
  const selectedType = ROOM_TYPES[roomTypeIndex];
  const roomNumber = selectedType.suites[Math.floor(random() * selectedType.suites.length)];
  
  const statusOptions: Guest["status"][] = ["Checked In", "Checked Out", "Reserved"];
  // Ensure we have Sarah Montgomery in room 402 as requested
  const name = i === 0 ? "Sarah Montgomery" : `${firstName} ${lastName}`;
  const room = i === 0 ? "402" : roomNumber;
  const suite = i === 0 ? "King Deluxe Suite" : selectedType.type;
  const status = i === 0 ? "Checked In" : statusOptions[Math.floor(random() * statusOptions.length)];

  guests.push({
    id: `GST-${1000 + i}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
    phone: `+1 (555) ${Math.floor(100 + random() * 900)}-${Math.floor(1000 + random() * 9000)}`,
    vipStatus: i === 0 ? true : vipStatus,
    loyaltyTier: i === 0 ? "Platinum" : loyaltyTier,
    roomNumber: room,
    suiteName: suite,
    status
  });
}

// Generate 50 Reservations
export const reservations: Reservation[] = [];
const reservationStatuses: Reservation["status"][] = ["Checked In", "Confirmed", "Checked Out", "Cancelled"];
for (let i = 0; i < 50; i++) {
  const guest = guests[i]; // Link first 50 guests to reservations
  const roomTypeObj = ROOM_TYPES.find(r => r.type === guest.suiteName) || ROOM_TYPES[0];
  
  // Format check-in/out dates relative to current date (June 17, 2026)
  const currentOffset = Math.floor(random() * 10) - 5; // -5 to +5 days
  const duration = Math.floor(random() * 5) + 1; // 1 to 5 nights
  
  const arrival = new Date("2026-06-17");
  arrival.setDate(arrival.getDate() + currentOffset);
  
  const departure = new Date(arrival);
  departure.setDate(departure.getDate() + duration);

  const formattedArrival = arrival.toISOString().split("T")[0];
  const formattedDeparture = departure.toISOString().split("T")[0];

  let resStatus: Reservation["status"] = "Confirmed";
  if (guest.status === "Checked In") {
    resStatus = "Checked In";
  } else if (guest.status === "Checked Out") {
    resStatus = "Checked Out";
  } else {
    resStatus = random() < 0.15 ? "Cancelled" : "Confirmed";
  }

  const rate = roomTypeObj.rate;
  const balance = resStatus === "Checked In" ? Math.floor(rate * duration * (random() < 0.3 ? 1.2 : 0.2)) : 0; // Current running charges
  const paymentStatus: Reservation["paymentStatus"] = resStatus === "Checked Out" ? "Paid" : (balance > 100 ? "Authorized" : "Pending");

  reservations.push({
    id: `RES-${5000 + i}`,
    guestId: guest.id,
    guestName: guest.name,
    roomNumber: guest.roomNumber,
    roomType: roomTypeObj.type as Reservation["roomType"],
    arrivalDate: formattedArrival,
    departureDate: formattedDeparture,
    status: resStatus,
    rate,
    balance,
    paymentStatus,
    groupBlockId: i < 8 ? "GRP-808" : undefined // First 8 are part of a group block
  });
}

// Generate 40 Housekeepers
export const housekeepers: Housekeeper[] = [];
for (let i = 0; i < 40; i++) {
  const name = HOUSEKEEPER_FIRST_NAMES[i % HOUSEKEEPER_FIRST_NAMES.length];
  const statusOptions: Housekeeper["status"][] = ["Active", "Break", "Off-Duty"];
  const housekeeperStatus = i < 28 ? "Active" : (i < 34 ? "Break" : "Off-Duty");
  
  // Assign rooms
  const assigned: string[] = [];
  if (housekeeperStatus === "Active") {
    const qty = Math.floor(random() * 3) + 1;
    for (let q = 0; q < qty; q++) {
      const rt = ROOM_TYPES[Math.floor(random() * ROOM_TYPES.length)];
      const rm = rt.suites[Math.floor(random() * rt.suites.length)];
      if (!assigned.includes(rm)) assigned.push(rm);
    }
  }

  housekeepers.push({
    id: `HKP-${200 + i}`,
    name: `${name} S.`,
    status: housekeeperStatus,
    assignedRooms: assigned,
    cleanTimeAvg: Math.floor(22 + random() * 15), // 22 to 37 minutes
    completedToday: housekeeperStatus === "Active" ? Math.floor(2 + random() * 6) : 0,
    efficiencyScore: Math.floor(80 + random() * 18), // 80% to 98%
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
  });
}

// Generate Housekeeping Kanban Tasks
export const housekeepingTasks: HousekeepingTask[] = [];
// Create tasks for various rooms in the property
const allRooms: { room: string; type: string }[] = [];
ROOM_TYPES.forEach(rt => {
  rt.suites.forEach(suite => {
    allRooms.push({ room: suite, type: rt.type });
  });
});

// We want to generate tasks for about 20 rooms to display on the board
const housekeepingTaskPriorities: HousekeepingTask["priority"][] = ["Low", "Medium", "High", "Urgent"];
const housekeepingTaskTypes: HousekeepingTask["type"][] = ["VIP Arrival", "Stayover Clean", "Checkout Clean", "Deep Clean"];
const housekeepingTaskStatuses: HousekeepingTask["status"][] = ["To Do", "In Progress", "Completed"];

// Setup specific tasks first
housekeepingTasks.push({
  id: "HKT-9001",
  roomNumber: "402",
  status: "In Progress",
  priority: "Urgent",
  type: "VIP Arrival",
  assignedTo: "Marcus S.",
  lastUpdated: "10 mins ago"
});

for (let i = 0; i < 25; i++) {
  const roomInfo = allRooms[i % allRooms.length];
  if (roomInfo.room === "402") continue; // Avoid duplicating Sarah Montgomery's room setup

  const housekeeper = housekeepers[Math.floor(random() * housekeepers.length)];
  const status = housekeepingTaskStatuses[i % 3];
  
  housekeepingTasks.push({
    id: `HKT-900${2 + i}`,
    roomNumber: roomInfo.room,
    status,
    priority: housekeepingTaskPriorities[Math.floor(random() * housekeepingTaskPriorities.length)],
    type: housekeepingTaskTypes[Math.floor(random() * housekeepingTaskTypes.length)],
    assignedTo: housekeeper.status === "Active" ? housekeeper.name : "Unassigned",
    lastUpdated: `${Math.floor(random() * 50) + 10} mins ago`
  });
}

// Generate 25 Engineers
export const engineers: Engineer[] = [];
for (let i = 0; i < 25; i++) {
  const name = ENGINEER_FIRST_NAMES[i % ENGINEER_FIRST_NAMES.length];
  const specialty = SPECIALTIES[i % SPECIALTIES.length];
  const status = i < 18 ? "Active" : (i < 22 ? "Break" : "Off-Duty");
  const activeTasks = status === "Active" ? Math.floor(random() * 3) : 0;

  engineers.push({
    id: `ENG-${300 + i}`,
    name: `${name} M.`,
    specialty,
    status,
    currentEta: status === "Active" ? Math.floor(15 + random() * 45) : 999, // ETA in minutes
    activeTaskCount: activeTasks,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
  });
}

// Generate 100 Work Orders
export const workOrders: WorkOrder[] = [];
const workOrderCategories = ["Leakage", "Painting", "Cleaning", "Furniture", "Electrical", "HVAC", "Plumbing"] as const;
const workOrderPriorities = ["Low", "Medium", "High", "Emergency"] as const;
const workOrderStatuses = ["Pending", "In Progress", "Completed"] as const;
const workOrderDescriptions = {
  Leakage: "Water leaking from toilet base",
  Painting: "Paint scuffed on bathroom door frame",
  Cleaning: "Spill stain on carpet near bed",
  Furniture: "Desk drawer track broken",
  Electrical: "Desk lamp outlet not working / light bulb burnt out",
  HVAC: "AC fan making rattling noise on high setting",
  Plumbing: "Shower drain draining extremely slow"
};

// Seed initial exact work orders first to cover typical problems
workOrders.push({
  id: "WO-4001",
  roomNumber: "204",
  category: "Leakage",
  priority: "Emergency",
  status: "In Progress",
  assignedEngineerId: "ENG-300",
  assignedEngineerName: "Arthur M.",
  description: "Ceiling water leaking from floor above",
  dateCreated: "2026-06-17T15:20:00Z"
});

workOrders.push({
  id: "WO-4002",
  roomNumber: "502",
  category: "HVAC",
  priority: "High",
  status: "Pending",
  assignedEngineerId: "ENG-301",
  assignedEngineerName: "Frank M.",
  description: "Thermostat display blank, no airflow",
  dateCreated: "2026-06-17T16:10:00Z"
});

for (let i = 2; i < 100; i++) {
  const roomIndex = Math.floor(random() * allRooms.length);
  const room = allRooms[roomIndex].room;
  const category = workOrderCategories[Math.floor(random() * workOrderCategories.length)];
  const priority = workOrderPriorities[Math.floor(random() * workOrderPriorities.length)];
  const status = workOrderStatuses[i % 3]; // Loop status
  
  const engineer = engineers[i % engineers.length];
  
  const desc = workOrderDescriptions[category] || "General maintenance inspection required";
  
  // Date created
  const createdDate = new Date("2026-06-17");
  createdDate.setHours(createdDate.getHours() - Math.floor(random() * 48)); // Created up to 48 hours ago
  
  const dateCompleted = status === "Completed" 
    ? new Date(createdDate.getTime() + (Math.floor(random() * 4) + 1) * 3600000).toISOString()
    : undefined;

  workOrders.push({
    id: `WO-${4000 + i + 1}`,
    roomNumber: room,
    category,
    priority,
    status,
    assignedEngineerId: engineer.id,
    assignedEngineerName: engineer.name,
    description: desc,
    dateCreated: createdDate.toISOString(),
    dateCompleted
  });
}

// Generate 200 Billing Transactions
export const billingTransactions: BillingTransaction[] = [];
const transactionCategories = ["Room Charge", "Mini Bar", "Laundry", "Room Service", "Misc Fee", "Payment"] as const;
const transactionDescriptions = {
  "Room Charge": "Nightly Room Accommodation Charge",
  "Mini Bar": "Mini Bar: Beverages & Snacks",
  "Laundry": "Express Valet Laundry Service",
  "Room Service": "Dinner Entrée & Refreshments",
  "Misc Fee": "High-Speed Business Wi-Fi Upgrade",
  "Payment": "Visa Credit Card Settlement"
};

const transactionAmounts = {
  "Room Charge": [150, 250, 450, 950],
  "Mini Bar": [12.5, 24.0, 45.0, 8.5],
  "Laundry": [35.0, 42.0, 18.0],
  "Room Service": [58.0, 84.5, 120.0, 32.0],
  "Misc Fee": [15.0, 25.0, 50.0],
  "Payment": [-150, -250, -450, -100]
};

// Add initial specific billing entries for Sarah Montgomery in 402
const sarahId = guests.find(g => g.name === "Sarah Montgomery")?.id || "GST-1000";
billingTransactions.push({
  id: "TXN-80001",
  guestId: sarahId,
  roomNumber: "402",
  guestName: "Sarah Montgomery",
  date: "2026-06-15",
  description: "Nightly Room Accommodation Charge",
  reference: "FOL-402-991",
  amount: 450.0,
  category: "Room Charge"
});

billingTransactions.push({
  id: "TXN-80002",
  guestId: sarahId,
  roomNumber: "402",
  guestName: "Sarah Montgomery",
  date: "2026-06-15",
  description: "Mini Bar: Premium Beverages",
  reference: "MB-9012",
  amount: 38.5,
  category: "Mini Bar"
});

billingTransactions.push({
  id: "TXN-80003",
  guestId: sarahId,
  roomNumber: "402",
  guestName: "Sarah Montgomery",
  date: "2026-06-16",
  description: "In-Room Dining: Steak Dinner",
  reference: "RS-8831",
  amount: 76.0,
  category: "Room Service"
});

billingTransactions.push({
  id: "TXN-80004",
  guestId: sarahId,
  roomNumber: "402",
  guestName: "Sarah Montgomery",
  date: "2026-06-16",
  description: "Express Valet Laundry Service",
  reference: "LDY-5011",
  amount: 45.0,
  category: "Laundry"
});

for (let i = 4; i < 200; i++) {
  const guest = guests[i % guests.length];
  const category = transactionCategories[i % transactionCategories.length];
  
  const desc = transactionDescriptions[category];
  const amtList = transactionAmounts[category];
  const amt = amtList[Math.floor(random() * amtList.length)];
  
  const txnDate = new Date("2026-06-17");
  txnDate.setDate(txnDate.getDate() - Math.floor(random() * 5));

  billingTransactions.push({
    id: `TXN-${80000 + i + 1}`,
    guestId: guest.id,
    roomNumber: guest.roomNumber,
    guestName: guest.name,
    date: txnDate.toISOString().split("T")[0],
    description: desc,
    reference: `${category.substring(0,2).toUpperCase()}-${Math.floor(1000 + random() * 9000)}`,
    amount: amt,
    category
  });
}

// Generate Inventory Tracker
export const inventoryItems: InventoryItem[] = [
  { id: "INV-1001", name: "LED Bulbs 12W", stock: 4, minStock: 15, category: "Lighting", status: "Low Stock", unitPrice: 3.50 },
  { id: "INV-1002", name: "Luxury King Sheets", stock: 42, minStock: 20, category: "Linen", status: "In Stock", unitPrice: 48.00 },
  { id: "INV-1003", name: "HVAC Filters 24x24", stock: 8, minStock: 10, category: "Maintenance Parts", status: "Low Stock", unitPrice: 12.50 },
  { id: "INV-1004", name: "Deluxe Bath Towels", stock: 125, minStock: 40, category: "Linen", status: "In Stock", unitPrice: 15.00 },
  { id: "INV-1005", name: "Universal TV Remotes", stock: 2, minStock: 5, category: "Maintenance Parts", status: "Low Stock", unitPrice: 18.00 },
  { id: "INV-1006", name: "Premium Toiletries Kit", stock: 350, minStock: 100, category: "Guest Amenities", status: "In Stock", unitPrice: 1.20 },
  { id: "INV-1007", name: "AC Thermostats", stock: 0, minStock: 3, category: "Maintenance Parts", status: "Out of Stock", unitPrice: 65.00 },
  { id: "INV-1008", name: "Door Lock Batterys AA", stock: 12, minStock: 30, category: "Lighting", status: "Low Stock", unitPrice: 0.80 }
];

// Generate Group Reservation Block
export const groupBlocks: GroupReservationBlock[] = [
  {
    id: "GRP-808",
    groupName: "Alpha Tech Summit 2026",
    eventName: "Annual Technology keynote & Hackathon",
    arrivalDate: "2026-06-20",
    departureDate: "2026-06-24",
    cutOffDate: "2026-06-18",
    totalRoomsBlocked: 30,
    roomsPickedUp: 24,
    pickupRate: 80,
    inventoryRemaining: 6
  },
  {
    id: "GRP-809",
    groupName: "Henderson Wedding Party",
    eventName: "Henderson & Miller Wedding Guest Block",
    arrivalDate: "2026-06-26",
    departureDate: "2026-06-29",
    cutOffDate: "2026-06-19",
    totalRoomsBlocked: 20,
    roomsPickedUp: 12,
    pickupRate: 60,
    inventoryRemaining: 8
  },
  {
    id: "GRP-810",
    groupName: "Global BioMed Congress",
    eventName: "BioMed Research Symposia",
    arrivalDate: "2026-07-02",
    departureDate: "2026-07-07",
    cutOffDate: "2026-06-25",
    totalRoomsBlocked: 50,
    roomsPickedUp: 15,
    pickupRate: 30,
    inventoryRemaining: 35
  }
];

// Generate Room Downtime Timeline / Gantt Data (OOO Rooms)
export interface RoomDowntime {
  id: string;
  roomNumber: string;
  category: "Leakage" | "Painting" | "Cleaning" | "Furniture" | "Electrical" | "HVAC" | "Plumbing";
  revenueLoss: number;
  estDays: number;
  progress: number; // percentage
  startDate: string;
  endDate: string;
  reason: string;
  engineerId: string;
  status: "Awaiting Approval" | "In Repairs" | "Ready for Reinstated";
}

export const roomDowntimes: RoomDowntime[] = [
  {
    id: "DT-001",
    roomNumber: "204",
    category: "Leakage",
    revenueLoss: 1250,
    estDays: 5,
    progress: 40,
    startDate: "2026-06-15",
    endDate: "2026-06-20",
    reason: "Severe ceiling leak repair & drywall drying",
    engineerId: "ENG-300",
    status: "In Repairs"
  },
  {
    id: "DT-002",
    roomNumber: "502",
    category: "HVAC",
    revenueLoss: 1350,
    estDays: 3,
    progress: 10,
    startDate: "2026-06-17",
    endDate: "2026-06-20",
    reason: "AC Compressor unit replacement",
    engineerId: "ENG-301",
    status: "In Repairs"
  },
  {
    id: "DT-003",
    roomNumber: "105",
    category: "Painting",
    revenueLoss: 450,
    estDays: 2,
    progress: 100,
    startDate: "2026-06-16",
    endDate: "2026-06-18",
    reason: "Accent wall repaint & wallpaper fix",
    engineerId: "ENG-302",
    status: "Ready for Reinstated"
  },
  {
    id: "DT-004",
    roomNumber: "308",
    category: "Furniture",
    revenueLoss: 750,
    estDays: 3,
    progress: 0,
    startDate: "2026-06-18",
    endDate: "2026-06-21",
    reason: "Replace broken desk chair and glass wardrobe door",
    engineerId: "ENG-303",
    status: "Awaiting Approval"
  }
];

// Seed initial activities
export const recentActivities: RecentActivity[] = [
  { id: "ACT-001", time: "5 mins ago", type: "checkin", message: "Sarah Montgomery checked into Room 402", status: "success", roomNumber: "402" },
  { id: "ACT-002", time: "12 mins ago", type: "billing", message: "Posted Room Service charge of $76.00 to Room 402", status: "info", roomNumber: "402" },
  { id: "ACT-003", time: "25 mins ago", type: "workorder", message: "Emergency Work Order WO-4001 (Leakage) created for Room 204", status: "error", roomNumber: "204" },
  { id: "ACT-004", time: "45 mins ago", type: "housekeeping", message: "Room 302 marked Completed by Elena S.", status: "success", roomNumber: "302" },
  { id: "ACT-005", time: "1 hour ago", type: "system", message: "Inventory alert: AC Thermostats is out of stock", status: "warning" },
  { id: "ACT-006", time: "2 hours ago", type: "checkout", message: "Guest John Miller checked out of Room 107. Folio settled.", status: "success", roomNumber: "107" }
];
