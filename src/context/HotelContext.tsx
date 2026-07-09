import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { formatCurrency } from "../common/utils/formatCurrency";
import { api } from "../services/api";
import { 
  guests as initialGuests, 
  reservations as initialReservations, 
  housekeepers as initialHousekeepers, 
  housekeepingTasks as initialHousekeepingTasks, 
  engineers as initialEngineers, 
  workOrders as initialWorkOrders, 
  billingTransactions as initialTransactions, 
  inventoryItems as initialInventory, 
  groupBlocks as initialBlocks, 
  roomDowntimes as initialDowntimes,
  RoomDowntime
} from "../data/mockData";
import { 
  Guest, 
  Reservation, 
  Housekeeper, 
  HousekeepingTask, 
  Engineer, 
  WorkOrder, 
  BillingTransaction, 
  InventoryItem, 
  GroupReservationBlock 
} from "../types";
import { useNotifications } from "./NotificationContext";

interface HotelContextType {
  guests: Guest[];
  reservations: Reservation[];
  housekeepers: Housekeeper[];
  housekeepingTasks: HousekeepingTask[];
  engineers: Engineer[];
  workOrders: WorkOrder[];
  transactions: BillingTransaction[];
  inventoryItems: InventoryItem[];
  groupBlocks: GroupReservationBlock[];
  roomDowntimes: RoomDowntime[];
  
  // Actions
  checkInReservation: (resId: string) => void;
  checkOutReservation: (resId: string) => void;
  postFolioCharge: (resId: string, category: BillingTransaction["category"], description: string, amount: number) => void;
  updateWorkOrderStatus: (woId: string, status: WorkOrder["status"], engineerId?: string) => void;
  createWorkOrder: (wo: Omit<WorkOrder, "id" | "dateCreated">) => void;
  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask["status"], housekeeperName?: string) => void;
  reinstateRoom: (downtimeId: string) => void;
  approveDowntime: (downtimeId: string) => void;
  importCSVGuests: (importedList: Omit<Guest, "id">[]) => { successCount: number; errors: string[] };
  updateInventoryStock: (itemId: string, change: number) => void;
  addNewGroupBlock: (block: Omit<GroupReservationBlock, "id" | "pickupRate" | "inventoryRemaining">) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addSystemNotification, addToast } = useNotifications();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [groupBlocks, setGroupBlocks] = useState<GroupReservationBlock[]>([]);
  const [roomDowntimes, setRoomDowntimes] = useState<RoomDowntime[]>([]);

  // Seed local states on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          guestsRes,
          resRes,
          houseRes,
          engRes,
          woRes
        ] = await Promise.all([
          api.get('/guest'),
          api.get('/reservation'),
          api.get('/housekeeping'),
          api.get('/maintenance/engineers'),
          api.get('/maintenance/work-orders')
        ]);
        
        if (guestsRes && guestsRes.length > 0) setGuests(guestsRes); else setGuests(initialGuests);
        if (resRes && resRes.length > 0) setReservations(resRes); else setReservations(initialReservations);
        if (houseRes && houseRes.length > 0) setHousekeepingTasks(houseRes); else setHousekeepingTasks(initialHousekeepingTasks);
        if (engRes && engRes.length > 0) setEngineers(engRes); else setEngineers(initialEngineers);
        if (woRes && woRes.length > 0) setWorkOrders(woRes); else setWorkOrders(initialWorkOrders);
        
        // Use mock data for unimplemented parts
        setHousekeepers(initialHousekeepers);
        setTransactions(initialTransactions);
        setInventoryItems(initialInventory);
        setGroupBlocks(initialBlocks);
        setRoomDowntimes(initialDowntimes);
      } catch (err) {
        console.error("API Error, falling back to mock data", err);
        setGuests(initialGuests);
        setReservations(initialReservations);
        setHousekeepers(initialHousekeepers);
        setHousekeepingTasks(initialHousekeepingTasks);
        setEngineers(initialEngineers);
        setWorkOrders(initialWorkOrders);
        setTransactions(initialTransactions);
        setInventoryItems(initialInventory);
        setGroupBlocks(initialBlocks);
        setRoomDowntimes(initialDowntimes);
      }
    };
    loadData();
  }, []);

  // Check In guest from Front Desk or Quick Button
  const checkInReservation = (resId: string) => {
    setReservations((prevRes) =>
      prevRes.map((res) => {
        if (res.id === resId) {
          // Update corresponding guest status
          setGuests((prevGuests) =>
            prevGuests.map((g) =>
              g.id === res.guestId
                ? { ...g, status: "Checked In", roomNumber: res.roomNumber }
                : g
            )
          );

          addSystemNotification(
            `Guest ${res.guestName} checked into Room ${res.roomNumber} successfully.`,
            "success",
            "checkin"
          );

          return { ...res, status: "Checked In" };
        }
        return res;
      })
    );
  };

  // Check Out guest from Front Desk / Billing
  const checkOutReservation = (resId: string) => {
    setReservations((prevRes) =>
      prevRes.map((res) => {
        if (res.id === resId) {
          if (res.balance > 0) {
            addToast(`Cannot check out. Guest has an outstanding balance of ${formatCurrency(res.balance)}.`, "error");
            return res;
          }

          // Update corresponding guest status
          setGuests((prevGuests) =>
            prevGuests.map((g) =>
              g.id === res.guestId
                ? { ...g, status: "Checked Out" }
                : g
            )
          );

          addSystemNotification(
            `Guest ${res.guestName} checked out of Room ${res.roomNumber}. Folio closed.`,
            "success",
            "checkout"
          );

          return { ...res, status: "Checked Out", paymentStatus: "Paid" };
        }
        return res;
      })
    );
  };

  // Post dynamic charges to guest folio
  const postFolioCharge = (
    resId: string, 
    category: BillingTransaction["category"], 
    description: string, 
    amount: number
  ) => {
    const reservation = reservations.find(r => r.id === resId);
    if (!reservation) return;

    const referenceId = `${category.substring(0,2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn: BillingTransaction = {
      id: `TXN-${Math.floor(81000 + Math.random() * 9000)}`,
      guestId: reservation.guestId,
      roomNumber: reservation.roomNumber,
      guestName: reservation.guestName,
      date: new Date().toISOString().split("T")[0],
      description,
      reference: referenceId,
      amount,
      category
    };

    setTransactions((prev) => [newTxn, ...prev]);

    setReservations((prevRes) =>
      prevRes.map((res) => {
        if (res.id === resId) {
          const newBal = res.balance + amount;
          return {
            ...res,
            balance: newBal,
            paymentStatus: newBal <= 0 ? "Paid" : "Pending"
          };
        }
        return res;
      })
    );

    addSystemNotification(`Posted ${category} charge (${formatCurrency(amount)}) to Room ${reservation.roomNumber} folio.`, amount < 0 ? "success" : "info", "billing");
  };

  // Update Work Order status (Maintenance)
  const updateWorkOrderStatus = (woId: string, status: WorkOrder["status"], engineerId?: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          let updatedWo = { ...wo, status };
          
          if (status === "Completed") {
            updatedWo.dateCompleted = new Date().toISOString();
            
            // Dec engineer task count
            setEngineers(prevEng => 
              prevEng.map(e => e.id === wo.assignedEngineerId 
                ? { ...e, activeTaskCount: Math.max(0, e.activeTaskCount - 1) }
                : e
              )
            );

            addSystemNotification(
              `Work Order ${woId} (Room ${wo.roomNumber}) marked Completed.`,
              "success",
              "workorder"
            );
          } else if (status === "In Progress" && engineerId) {
            const eng = engineers.find(e => e.id === engineerId);
            if (eng) {
              updatedWo.assignedEngineerId = engineerId;
              updatedWo.assignedEngineerName = eng.name;
              
              setEngineers(prevEng => 
                prevEng.map(e => e.id === engineerId 
                  ? { ...e, activeTaskCount: e.activeTaskCount + 1 }
                  : e
                )
              );
            }
          }

          return updatedWo;
        }
        return wo;
      })
    );
  };

  // Create new Work Order
  const createWorkOrder = (wo: Omit<WorkOrder, "id" | "dateCreated">) => {
    const id = `WO-${4100 + workOrders.length}`;
    const newWo: WorkOrder = {
      ...wo,
      id,
      dateCreated: new Date().toISOString()
    };

    setWorkOrders((prev) => [newWo, ...prev]);

    // If engineer assigned, increment active task count
    if (wo.assignedEngineerId) {
      setEngineers(prev =>
        prev.map(e => e.id === wo.assignedEngineerId
          ? { ...e, activeTaskCount: e.activeTaskCount + 1 }
          : e
        )
      );
    }

    addSystemNotification(
      `New maintenance ticket ${id} created for Room ${wo.roomNumber}. Priority: ${wo.priority}.`,
      wo.priority === "Emergency" ? "error" : "warning",
      "workorder"
    );
  };

  // Update Housekeeping Task status (Kanban board drag/button triggers)
  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask["status"], housekeeperName?: string) => {
    setHousekeepingTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updated = { 
            ...task, 
            status, 
            lastUpdated: "Just now", 
            assignedTo: housekeeperName || task.assignedTo 
          };

          if (status === "Completed") {
            // Update housekeeper stats
            setHousekeepers((prevHkp) =>
              prevHkp.map((hk) =>
                hk.name === updated.assignedTo
                  ? { ...hk, completedToday: hk.completedToday + 1 }
                  : hk
              )
            );

            addSystemNotification(
              `Room ${task.roomNumber} housekeeping completed by ${updated.assignedTo}.`,
              "success",
              "housekeeping"
            );
          }

          return updated;
        }
        return task;
      })
    );
  };

  // Approve downtime repairs for Out of Order rooms
  const approveDowntime = (downtimeId: string) => {
    setRoomDowntimes((prev) =>
      prev.map((dt) =>
        dt.id === downtimeId ? { ...dt, status: "In Repairs", progress: 10 } : dt
      )
    );
    addToast("Room downtime repairs approved and queue updated.", "success");
  };

  // Reinstate room back to active availability (removes from Downtime timeline)
  const reinstateRoom = (downtimeId: string) => {
    const downtime = roomDowntimes.find(dt => dt.id === downtimeId);
    if (!downtime) return;

    setRoomDowntimes((prev) => prev.filter(dt => dt.id !== downtimeId));

    addSystemNotification(
      `Room ${downtime.roomNumber} has been successfully reinstated and marked Clean/Vacant.`,
      "success",
      "system"
    );
  };

  // Update Inventory Stock levels and trigger alerts if stock is low
  const updateInventoryStock = (itemId: string, change: number) => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.stock + change);
          let status: InventoryItem["status"] = "In Stock";
          
          if (newStock === 0) {
            status = "Out of Stock";
          } else if (newStock <= item.minStock) {
            status = "Low Stock";
          }

          const updated = { ...item, stock: newStock, status };

          // Trigger warning alerts if stock drops below min threshold
          if (status !== item.status && (status === "Low Stock" || status === "Out of Stock")) {
            addSystemNotification(
              `Inventory warning: ${item.name} stock level is ${status.toLowerCase()} (${newStock} items).`,
              status === "Out of Stock" ? "error" : "warning",
              "system"
            );
          }

          return updated;
        }
        return item;
      })
    );
  };

  // Add new group reservation block
  const addNewGroupBlock = (block: Omit<GroupReservationBlock, "id" | "pickupRate" | "inventoryRemaining">) => {
    const id = `GRP-${811 + groupBlocks.length}`;
    const newBlock: GroupReservationBlock = {
      ...block,
      id,
      pickupRate: 0,
      inventoryRemaining: block.totalRoomsBlocked
    };
    setGroupBlocks((prev) => [...prev, newBlock]);
    addToast(`New group block created for ${block.groupName} (${block.totalRoomsBlocked} rooms).`, "success");
  };

  // CSV Guest import validator and loader
  const importCSVGuests = (importedList: Omit<Guest, "id">[]) => {
    const errors: string[] = [];
    let successCount = 0;
    const newGuests: Guest[] = [];

    importedList.forEach((guestData, index) => {
      const lineNum = index + 1;
      
      // Simple validation
      if (!guestData.name || guestData.name.trim() === "") {
        errors.push(`Row ${lineNum}: Guest Name is required.`);
        return;
      }
      if (!guestData.roomNumber || guestData.roomNumber.trim() === "") {
        errors.push(`Row ${lineNum}: Room Number is required.`);
        return;
      }
      
      // Check for duplicate active room number allocations
      const roomOccupied = guests.some(g => g.roomNumber === guestData.roomNumber && g.status === "Checked In");
      if (roomOccupied && guestData.status === "Checked In") {
        errors.push(`Row ${lineNum}: Room ${guestData.roomNumber} is currently occupied by checked-in guest.`);
        return;
      }

      newGuests.push({
        ...guestData,
        id: `GST-${1100 + guests.length + successCount}`
      });
      successCount++;
    });

    if (newGuests.length > 0) {
      setGuests((prev) => [...prev, ...newGuests]);
      // Also generate reservation records for them
      const newReservations: Reservation[] = newGuests.map((g, idx) => {
        const arrival = new Date("2026-06-17");
        const departure = new Date("2026-06-20");
        return {
          id: `RES-${5100 + reservations.length + idx}`,
          guestId: g.id,
          guestName: g.name,
          roomNumber: g.roomNumber,
          roomType: (g.suiteName.includes("Suite") ? "King Deluxe Suite" : "Standard Room") as Reservation["roomType"],
          arrivalDate: arrival.toISOString().split("T")[0],
          departureDate: departure.toISOString().split("T")[0],
          status: g.status === "Checked In" ? "Checked In" : g.status === "Checked Out" ? "Checked Out" : "Confirmed",
          rate: g.suiteName.includes("Suite") ? 450 : 150,
          balance: 0,
          paymentStatus: "Pending"
        };
      });
      setReservations((prev) => [...prev, ...newReservations]);

      addSystemNotification(
        `Imported ${successCount} guest records via CSV successfully.`,
        "success",
        "system"
      );
    }

    return { successCount, errors };
  };

  return (
    <HotelContext.Provider
      value={{
        guests,
        reservations,
        housekeepers,
        housekeepingTasks,
        engineers,
        workOrders,
        transactions,
        inventoryItems,
        groupBlocks,
        roomDowntimes,
        
        checkInReservation,
        checkOutReservation,
        postFolioCharge,
        updateWorkOrderStatus,
        createWorkOrder,
        updateHousekeepingStatus,
        reinstateRoom,
        approveDowntime,
        importCSVGuests,
        updateInventoryStock,
        addNewGroupBlock
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};
