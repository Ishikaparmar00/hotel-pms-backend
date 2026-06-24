import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";
import { useHotel } from "../../context/HotelContext";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { FormError } from "../../components/ui/FormError";
import { 
  Receipt, 
  Coffee, 
  Wine, 
  Settings,
  Plus, 
  FileText,
  Percent, 
  DollarSign, 
  User, 
  Calendar,
  Send,
  Split,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export const BillingDashboard: React.FC = () => {
  const { reservations, transactions, postFolioCharge } = useHotel();
  
  // Simulated loading state
  const [isLoading, setIsLoading] = useState(true);

  // Select Sarah Montgomery's reservation by default
  const activeCheckins = reservations.filter(r => r.status === "Checked In");
  const [selectedResId, setSelectedResId] = useState("");
  
  // Charge Form state
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<any>("Mini Bar");

  // Validation error states
  const [descError, setDescError] = useState("");
  const [refError, setRefError] = useState("");
  const [amountError, setAmountError] = useState("");
  
  // Modal states
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Set default guest selection to Sarah Montgomery on load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);

    const sarah = reservations.find(r => r.guestName.includes("Sarah") && r.status === "Checked In");
    if (sarah) {
      setSelectedResId(sarah.id);
    } else if (activeCheckins.length > 0) {
      setSelectedResId(activeCheckins[0].id);
    }

    return () => clearTimeout(timer);
  }, [reservations]);

  const selectedRes = reservations.find(r => r.id === selectedResId);

  // Folio Activity list filtered for the selected guest
  const guestTransactions = transactions.filter(t => t.guestId === selectedRes?.guestId);

  // Quick Post click handler - populates form with defaults
  const handleQuickPost = (cat: string) => {
    setCategory(cat);
    const refNum = `${cat.substring(0,2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setReference(refNum);
    
    // Clear errors
    setDescError("");
    setRefError("");
    setAmountError("");

    switch(cat) {
      case "Mini Bar":
        setDescription("Mini Bar replenishment - Premium selection");
        setAmount(128.00);
        break;
      case "Laundry":
        setDescription("Express Valet dry cleaning & pressing");
        setAmount(45.00);
        break;
      case "Room Service":
        setDescription("In-room dining breakfast selection");
        setAmount(42.00);
        break;
      default:
        setDescription("High-speed Wi-Fi Premium package");
        setAmount(15.00);
    }
  };

  const handlePostCharge = () => {
    let isValid = true;
    if (!description.trim()) {
      setDescError("Service description is required.");
      isValid = false;
    } else {
      setDescError("");
    }

    if (!reference.trim()) {
      setRefError("Reference number is required.");
      isValid = false;
    } else if (!/^[A-Z]{2,4}-\d{5}(-[A-Z0-9]+)?$/.test(reference)) {
      setRefError("Reference must match standard XX-XXXXX format (e.g. MB-98234).");
      isValid = false;
    } else {
      setRefError("");
    }

    if (amount <= 0) {
      setAmountError("Transaction amount must be greater than $0.00.");
      isValid = false;
    } else {
      setAmountError("");
    }

    if (!isValid) return;

    setIsConfirmOpen(true);
  };

  const handleConfirmPost = () => {
    if (!selectedResId) return;
    postFolioCharge(selectedResId, category, description, amount);
    
    // Clear pending form
    setDescription("");
    setReference("");
    setAmount(0);
    setDescError("");
    setRefError("");
    setAmountError("");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in font-sans">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 w-1/3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Layout Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <div className="p-4 border border-customBorder-light dark:border-slate-800 rounded-2xl flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </Card>
            <Card className="p-5 space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
            </Card>
            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-48 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight">
            Transaction Hub
          </h1>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
            POS postings, guest account statements, ledgers adjustments, and payments settlement.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] px-4 py-2.5 rounded-xl text-xs font-bold text-customText-light dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> View Audit Log
          </button>
          <button className="bg-[#A21C1C] hover:bg-[#821414] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
            Today's Closings
          </button>
        </div>
      </div>

      {/* Main Grid: Active Folio & Posting Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (1/3): Active Folio Card & Quick Post */}
        <div className="space-y-6">
          {/* Active Folio selector & summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <User className="w-4.5 h-4.5 text-primary" /> Active Folio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark">
                  Select Guest Account
                </label>
                <select
                  value={selectedResId}
                  onChange={(e) => setSelectedResId(e.target.value)}
                  className="w-full text-xs bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
                >
                  <option value="">-- Select Checked In Guest --</option>
                  {activeCheckins.map(res => (
                    <option key={res.id} value={res.id}>
                      {res.guestName} (Room {res.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              {selectedRes && (
                <div className="space-y-4">
                  {/* Visual Guest details box matching screenshot */}
                  <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {selectedRes.guestName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-customText-light dark:text-white leading-tight">
                        {selectedRes.guestName}
                      </p>
                      <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-0.5 leading-none">
                        Room {selectedRes.roomNumber} • {selectedRes.roomType}
                      </p>
                      <span className="inline-block mt-2">
                        <StatusBadge status="Checked In" />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-customText-mutedLight">Arrival Date:</span>
                      <span className="font-bold text-customText-light dark:text-white">Oct 12, 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-customText-mutedLight">Departure Date:</span>
                      <span className="font-bold text-customText-light dark:text-white">Oct 15, 2026</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-customBorder-light dark:border-[#334155]">
                      <span className="font-bold text-customText-light dark:text-white">Current Balance</span>
                      <span className="text-sm font-extrabold text-primary dark:text-[#FB923C]">
                        ${selectedRes.balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Post Grid */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                🛒 Quick Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => handleQuickPost("Mini Bar")}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                >
                  <span className="text-xl group-hover:scale-105 transition">🍷</span>
                  <span className="text-xs font-bold text-customText-light dark:text-white mt-1.5">Mini Bar</span>
                </button>

                <button
                  onClick={() => handleQuickPost("Laundry")}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                >
                  <span className="text-xl group-hover:scale-105 transition">🧺</span>
                  <span className="text-xs font-bold text-customText-light dark:text-white mt-1.5">Laundry</span>
                </button>

                <button
                  onClick={() => handleQuickPost("Room Service")}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                >
                  <span className="text-xl group-hover:scale-105 transition">🍽️</span>
                  <span className="text-xs font-bold text-customText-light dark:text-white mt-1.5">Room Service</span>
                </button>

                <button
                  onClick={() => handleQuickPost("Misc Fee")}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                >
                  <span className="text-xl group-hover:scale-105 transition">•••</span>
                  <span className="text-xs font-bold text-customText-light dark:text-white mt-1.5">Misc Fees</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (2/3): Pending POS Charge composer & ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* POS Posting panel */}
          <Card>
            <CardHeader className="border-b-0 pb-1 flex justify-between items-center w-full">
              <div>
                <CardTitle>Pending Charge</CardTitle>
                <span className="text-xs text-customText-mutedLight">Review details before posting to guest folio.</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-customText-mutedLight font-bold uppercase tracking-wider">Total Amount</p>
                <p className="text-xl font-extrabold text-primary dark:text-[#FB923C]">${amount.toFixed(2)}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-customText-light dark:text-white">Service Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Mini Bar replenishment - Premium selection"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (e.target.value.trim()) setDescError("");
                    }}
                    className="w-full text-xs bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
                  />
                  <FormError message={descError} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-customText-light dark:text-white">Reference #</label>
                  <input
                    type="text"
                    placeholder="e.g. MB-98234-X"
                    value={reference}
                    onChange={(e) => {
                      setReference(e.target.value);
                      if (e.target.value.trim()) setRefError("");
                    }}
                    className="w-full text-xs bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
                  />
                  <FormError message={refError} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-customText-light dark:text-white">Transaction Amount ($)</label>
                  <input
                    type="number"
                    value={amount === 0 ? "" : amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      if (Number(e.target.value) > 0) setAmountError("");
                    }}
                    placeholder="0.00"
                    className="w-full text-xs bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
                  />
                  <FormError message={amountError} />
                </div>

                {/* Transfer / Distribution options */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-customText-light dark:text-white">Transfer & Distribution</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => alert("Transfer charge initiated.")}
                      className="flex-1 py-2 border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-customText-light dark:text-white flex items-center justify-center gap-1"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-secondary" /> Transfer Charge
                    </button>
                    <button 
                      type="button" 
                      onClick={() => alert("Split transaction initiated.")}
                      className="flex-1 py-2 border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-customText-light dark:text-white flex items-center justify-center gap-1"
                    >
                      <Split className="w-3.5 h-3.5 text-secondary" /> Split Bill
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Preview & Posting button actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-customBorder-light dark:border-[#334155] gap-3">
                <span className="text-[10px] text-customText-mutedLight flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Digital receipt will be sent to s.montgomery@email.com
                </span>

                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setIsReceiptOpen(true)}
                    disabled={!selectedResId}
                    className="flex-1 sm:flex-none px-4 py-2 border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-customText-light dark:text-white rounded-xl transition"
                  >
                    Preview Receipt
                  </button>
                  <button
                    onClick={handlePostCharge}
                    disabled={!selectedResId}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-dark text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Post & Authorize
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Folio Activity Table */}
          <Card>
            <CardHeader className="flex justify-between items-center border-b-0 pb-1">
              <CardTitle>Folio Activity</CardTitle>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-customBorder-light dark:border-[#334155] text-[10px] font-bold">
                <span className="px-2 py-1 text-customText-mutedLight cursor-pointer">All Folios</span>
                <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-customText-light dark:text-white shadow-sm cursor-pointer">Current Item</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F8F9FB] dark:bg-slate-800/80 border-b border-customBorder-light dark:border-[#334155] text-customText-mutedLight dark:text-customText-mutedDark uppercase font-bold tracking-wider py-3.5">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-customBorder-light/50 dark:divide-[#334155]/50 font-semibold">
                    {guestTransactions.length > 0 ? (
                      guestTransactions.map((txn) => (
                        <tr 
                          key={txn.id} 
                          className={`hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition ${
                            txn.description.toLowerCase().includes("mini bar replenishment") ? "bg-rose-500/5 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" : ""
                          }`}
                        >
                          <td className="px-4 py-3.5 text-customText-mutedLight">{txn.date}</td>
                          <td className="px-4 py-3.5 text-customText-light dark:text-white">{txn.description}</td>
                          <td className="px-4 py-3.5 text-customText-mutedLight">{txn.reference}</td>
                          <td className={`px-4 py-3.5 text-right font-bold ${txn.amount < 0 ? "text-emerald-600" : "text-customText-light dark:text-white"}`}>
                            ${txn.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-customText-mutedLight">
                          No transaction postings found for this folio.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Folio Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Account Statement Preview"
      >
        {selectedRes && (
          <div className="space-y-6 text-xs text-customText-light dark:text-white p-2">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-customBorder-light dark:border-[#334155] pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-primary">EventHub360</h3>
                <p className="text-[10px] text-customText-mutedLight mt-0.5">Elite Hotel Accommodation Receipt</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Folio #: Statement-{selectedRes.id}</p>
                <p className="text-[10px] text-customText-mutedLight">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Guest Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div>
                <p className="text-[10px] text-customText-mutedLight uppercase tracking-wider font-bold">Bill To:</p>
                <p className="font-bold text-sm mt-1">{selectedRes.guestName}</p>
                <p className="text-customText-mutedLight mt-0.5">Room {selectedRes.roomNumber} - {selectedRes.roomType}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-customText-mutedLight uppercase tracking-wider font-bold">Duration:</p>
                <p className="font-bold mt-1">{selectedRes.arrivalDate} to {selectedRes.departureDate}</p>
                <p className="text-customText-mutedLight mt-0.5">Payment Status: {selectedRes.paymentStatus}</p>
              </div>
            </div>

            {/* Itemized ledger lists */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-bold text-customText-mutedLight tracking-wider border-b border-customBorder-light dark:border-[#334155] pb-1.5">
                Itemized Summary
              </p>
              <div className="divide-y divide-customBorder-light/50 dark:divide-[#334155]/50">
                {guestTransactions.map(t => (
                  <div key={t.id} className="flex justify-between py-2.5 font-semibold">
                    <div>
                      <p className="text-customText-light dark:text-white">{t.description}</p>
                      <span className="text-[9px] text-customText-mutedLight block">Ref: {t.reference} • {t.date}</span>
                    </div>
                    <span className="font-bold">${t.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-customBorder-light dark:border-[#334155] pt-4 flex flex-col items-end space-y-1.5 font-bold">
              <div className="flex justify-between w-1/2 text-customText-mutedLight">
                <span>Subtotal Charges:</span>
                <span>${selectedRes.balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-1/2 text-customText-mutedLight">
                <span>GST/Sales Tax:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between w-1/2 text-primary border-t border-customBorder-light dark:border-[#334155] pt-2 text-sm font-extrabold">
                <span>Outstanding Balance:</span>
                <span>${selectedRes.balance.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsReceiptOpen(false)}
              className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition transform active:scale-95"
            >
              Close Statement
            </button>
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmPost}
        title="Confirm Folio Post"
        message={`Are you sure you want to post a transaction charge of $${amount.toFixed(2)} (${category}) to ${selectedRes?.guestName}'s active folio?`}
        confirmText="Yes, Post Charge"
        cancelText="Cancel"
        type="warning"
      />

    </div>
  );
};
