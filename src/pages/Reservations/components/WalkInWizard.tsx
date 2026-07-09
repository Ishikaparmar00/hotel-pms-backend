import React, { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Check, CreditCard, User, FileText, UploadCloud, ChevronRight, CheckCircle } from "lucide-react";
import { api } from "../../../services/api";

interface WalkInWizardProps {
  isOpen: boolean;
  onClose: () => void;
  availableRooms: any[];
  onComplete: () => void;
}

export const WalkInWizard: React.FC<WalkInWizardProps> = ({ isOpen, onClose, availableRooms, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data
  const [guest, setGuest] = useState({ firstName: "", lastName: "", gender: "Male", dob: "", nationality: "India", phone: "", email: "" });
  const [identity, setIdentity] = useState({ type: "Passport", number: "", uploaded: false });
  const [stay, setStay] = useState({ roomId: "", roomType: "", adults: 1, children: 0, arrivalDate: new Date().toISOString().split('T')[0], departureDate: "", ratePlan: "Standard" });
  const [payment, setPayment] = useState({ method: "Credit Card", advance: 0 });

  const steps = [
    { id: 1, title: "Guest Info", icon: <User size={16}/> },
    { id: 2, title: "Identity", icon: <FileText size={16}/> },
    { id: 3, title: "Stay Details", icon: <Check size={16}/> },
    { id: 4, title: "Payment", icon: <CreditCard size={16}/> },
    { id: 5, title: "Confirm", icon: <CheckCircle size={16}/> },
  ];

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const room = availableRooms.find(r => r.id.toString() === id);
    if(room) setStay({...stay, roomId: id, roomType: room.roomType});
  };

  const calculateTotal = () => {
    const room = availableRooms.find(r => r.id.toString() === stay.roomId);
    if(!room || !stay.departureDate) return 0;
    const d1 = new Date(stay.arrivalDate);
    const d2 = new Date(stay.departureDate);
    const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    return (room.price * nights) + 50; // Add 50 for taxes/fees
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/reservation-desk/walk-in', {
        ...guest,
        passportNumber: identity.number, // Re-using existing passport/DL backend mapping
        roomId: parseInt(stay.roomId),
        checkOut: stay.departureDate,
        adults: stay.adults,
        children: stay.children,
        paymentMethod: payment.method,
        depositAmount: payment.advance,
        idDocumentType: identity.type,
        idDocumentUrl: identity.uploaded ? "simulated_upload_url.jpg" : null
      });
      onComplete();
    } catch (e) {
      alert("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Walk-In Registration Wizard">
      <div className="w-[600px] max-w-full">
        {/* Stepper Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step === s.id ? 'bg-[#003B95] text-white' : step > s.id ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                {step > s.id ? <Check size={14}/> : s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step === s.id ? 'text-[#003B95]' : 'text-gray-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <div className="p-6 text-sm min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-bold mb-1">First Name *</label><input required className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-[#003B95]/20 outline-none" value={guest.firstName} onChange={e=>setGuest({...guest, firstName: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Last Name *</label><input required className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-[#003B95]/20 outline-none" value={guest.lastName} onChange={e=>setGuest({...guest, lastName: e.target.value})} /></div>
                <div>
                  <label className="block font-bold mb-1">Gender</label>
                  <select className="w-full border border-gray-200 p-2 rounded-lg" value={guest.gender} onChange={e=>setGuest({...guest, gender: e.target.value})}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div><label className="block font-bold mb-1">Date of Birth</label><input type="date" className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-[#003B95]/20 outline-none" value={guest.dob} onChange={e=>setGuest({...guest, dob: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Mobile *</label><input required className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-[#003B95]/20 outline-none" value={guest.phone} onChange={e=>setGuest({...guest, phone: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Email</label><input type="email" className="w-full border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-[#003B95]/20 outline-none" value={guest.email} onChange={e=>setGuest({...guest, email: e.target.value})} /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Document Type *</label>
                  <select className="w-full border border-gray-200 p-2 rounded-lg" value={identity.type} onChange={e=>setIdentity({...identity, type: e.target.value})}>
                    <option>Passport</option><option>Aadhaar</option><option>Driving Licence</option><option>PAN</option>
                  </select>
                </div>
                <div><label className="block font-bold mb-1">Document Number *</label><input required className="w-full border border-gray-200 p-2 rounded-lg" value={identity.number} onChange={e=>setIdentity({...identity, number: e.target.value})} /></div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition" onClick={()=>setIdentity({...identity, uploaded: true})}>
                {identity.uploaded ? (
                  <div className="text-emerald-600 font-bold flex flex-col items-center">
                    <CheckCircle className="mb-2 w-8 h-8"/> Document Uploaded Successfully
                  </div>
                ) : (
                  <>
                    <UploadCloud className="text-gray-400 mb-2 w-8 h-8"/>
                    <p className="font-bold text-gray-700">Click to capture / upload Document</p>
                    <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, PDF</p>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-bold mb-1">Arrival Date</label><input type="date" disabled className="w-full border border-gray-200 p-2 rounded-lg bg-gray-100" value={stay.arrivalDate} /></div>
                <div><label className="block font-bold mb-1">Departure Date *</label><input type="date" required className="w-full border border-gray-200 p-2 rounded-lg" value={stay.departureDate} onChange={e=>setStay({...stay, departureDate: e.target.value})} /></div>
                <div className="col-span-2">
                  <label className="block font-bold mb-1">Assign Available Room *</label>
                  <select required className="w-full border border-gray-200 p-2 rounded-lg" value={stay.roomId} onChange={handleRoomChange}>
                    <option value="">-- Select a Room --</option>
                    {availableRooms.map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} - {r.roomType} (${r.price}/nt)</option>)}
                  </select>
                </div>
                <div><label className="block font-bold mb-1">Adults</label><input type="number" min="1" className="w-full border border-gray-200 p-2 rounded-lg" value={stay.adults} onChange={e=>setStay({...stay, adults: parseInt(e.target.value)})} /></div>
                <div><label className="block font-bold mb-1">Children</label><input type="number" min="0" className="w-full border border-gray-200 p-2 rounded-lg" value={stay.children} onChange={e=>setStay({...stay, children: parseInt(e.target.value)})} /></div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center font-bold text-sm text-gray-700"><span>Estimated Total:</span><span className="text-xl text-[#003B95]">${calculateTotal()}</span></div>
                <p className="text-xs text-gray-500 mt-1">Includes room charges and estimated taxes.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Payment Method</label>
                  <select className="w-full border border-gray-200 p-2 rounded-lg" value={payment.method} onChange={e=>setPayment({...payment, method: e.target.value})}>
                    <option>Credit Card (Terminal)</option><option>Cash</option><option>Bank Transfer</option>
                  </select>
                </div>
                <div><label className="block font-bold mb-1">Advance Deposit Received</label><input type="number" className="w-full border border-gray-200 p-2 rounded-lg" value={payment.advance} onChange={e=>setPayment({...payment, advance: parseFloat(e.target.value)})} /></div>
              </div>
              {payment.method === 'Credit Card (Terminal)' && (
                <div className="mt-4 border border-gray-200 rounded-xl p-4 flex items-center justify-center bg-gray-50">
                  <span className="font-bold text-gray-500 animate-pulse">Waiting for Payment Terminal... (Mock)</span>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-center py-6">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Ready to Check-in</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">
                All required details have been collected for {guest.firstName} {guest.lastName}. 
                An instant walk-in reservation will be created and checked-in automatically.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={handlePrev} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition">Back</button>
          ) : <div></div>}
          
          {step < 5 ? (
            <button onClick={handleNext} disabled={step === 1 && (!guest.firstName || !guest.phone)} className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg shadow hover:bg-orange-700 transition flex items-center gap-1 disabled:opacity-50">
              Next Step <ChevronRight size={16}/>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow hover:bg-emerald-700 transition flex items-center gap-2">
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
