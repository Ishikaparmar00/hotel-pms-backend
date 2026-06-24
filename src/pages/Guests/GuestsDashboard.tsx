import React from "react";
import { useHotel } from "../../context/HotelContext";
import { DataTable } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";

export const GuestsDashboard: React.FC = () => {
  const { guests, reservations } = useHotel();

  // Map guests and join reservation balance
  const data = guests.map(g => {
    const res = reservations.find(r => r.guestId === g.id);
    return {
      ...g,
      balance: res ? res.balance : 0,
      paymentStatus: res ? res.paymentStatus : "Paid"
    };
  });

  const columns = [
    {
      header: "Guest ID",
      accessor: "id",
      sortable: true
    },
    {
      header: "Guest Name",
      accessor: (item: any) => (
        <div>
          <p className="font-extrabold text-customText-light dark:text-white leading-tight">
            {item.name}
          </p>
          <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-0.5">
            {item.email}
          </p>
        </div>
      ),
      sortable: true,
      sortKey: "name"
    },
    {
      header: "VIP Tier",
      accessor: (item: any) => (
        <StatusBadge status={item.vipStatus ? "VIP" : "Standard"} />
      ),
      sortable: true,
      sortKey: "vipStatus"
    },
    {
      header: "Loyalty Status",
      accessor: (item: any) => (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
          item.loyaltyTier === "Platinum" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400" :
          item.loyaltyTier === "Gold" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
          item.loyaltyTier === "Silver" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
        }`}>
          {item.loyaltyTier}
        </span>
      ),
      sortable: true,
      sortKey: "loyaltyTier"
    },
    {
      header: "Room #",
      accessor: "roomNumber",
      sortable: true
    },
    {
      header: "Folio Balance",
      accessor: (item: any) => (
        <span className={`font-bold ${item.balance > 0 ? "text-primary dark:text-rose-400" : "text-emerald-600"}`}>
          ${item.balance.toFixed(2)}
        </span>
      ),
      sortable: true,
      sortKey: "balance"
    },
    {
      header: "Invoice Ledger",
      accessor: (item: any) => (
        <Link
          to="/billing"
          className="flex items-center gap-1 text-primary dark:text-[#FB923C] hover:underline font-bold text-xs"
        >
          <Receipt className="w-3.5 h-3.5" /> View Folio
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight">
          Guests Profile Directory
        </h1>
        <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
          Historical log index of all hotel guest accounts, VIP statuses, and active statements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Master Guest Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search guest profiles by name or ID..."
            searchKey={(item) => `${item.name} ${item.id} ${item.email}`}
            initialRowsPerPage={10}
          />
        </CardContent>
      </Card>
    </div>
  );
};
