import React, { useState } from "react";
import { CheckCircle, Fingerprint, ScanSearch, Upload, UserCheck, XCircle } from "lucide-react";
import { api } from "../../../services/api";

interface VerificationDeskProps {
  reservation: any;
  onVerify: () => void;
  onCheckIn: () => void;
}

export const VerificationDesk: React.FC<VerificationDeskProps> = ({ reservation, onVerify, onCheckIn }) => {
  const [ocrStatus, setOcrStatus] = useState<'Idle'|'Scanning'|'Success'>('Idle');
  const [documentType, setDocumentType] = useState('Passport');
  
  const handleUpload = () => {
    // Simulate OCR delay
    setOcrStatus('Scanning');
    setTimeout(() => {
      setOcrStatus('Success');
    }, 2000);
  };

  const handleApprove = async () => {
    try {
      await api.post(`/reservation-desk/verify/${reservation.id}`, {
        idDocumentType: documentType,
        idDocumentUrl: "ocr_scanned_doc.pdf",
        signatureUrl: "digital_sig.png",
        guestPhotoUrl: "webcam_capture.jpg"
      });
      onVerify(); // trigger parent refresh
    } catch (e) {
      alert("Verification update failed");
    }
  };

  if (!reservation) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center py-12 text-gray-400">
        <ScanSearch size={40} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm font-bold">Select a guest from the roster</p>
        <p className="text-xs mt-1">to begin verification and check-in</p>
      </div>
    );
  }

  const isVerified = reservation.verificationStatus === 'Verified';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2"><UserCheck size={20} className="text-[#003B95]"/> Verification Desk</h2>
        {isVerified && <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Verified</span>}
        {reservation.verificationStatus === 'Pending' && <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Pending</span>}
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center font-extrabold text-blue-700 text-xl">
          {reservation.guestName.charAt(0)}
        </div>
        <h3 className="font-bold text-xl mt-3">{reservation.guestName}</h3>
        <p className="text-sm text-gray-500">{reservation.reservationNumber}</p>
      </div>

      {!isVerified ? (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ID Document Scanner</label>
            <select className="w-full border border-gray-300 p-2 text-sm rounded-lg mb-3" value={documentType} onChange={e=>setDocumentType(e.target.value)}>
              <option>Passport</option><option>Aadhaar</option><option>Driving Licence</option>
            </select>
            
            {ocrStatus === 'Idle' && (
              <div onClick={handleUpload} className="border-2 border-dashed border-[#003B95]/30 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition">
                <Upload className="mx-auto text-[#003B95] mb-2" size={24}/>
                <p className="text-sm font-bold text-[#003B95]">Upload & Scan ID</p>
              </div>
            )}
            
            {ocrStatus === 'Scanning' && (
              <div className="rounded-lg p-6 text-center bg-gray-100 animate-pulse border border-gray-200">
                <ScanSearch className="mx-auto text-amber-500 mb-2 animate-spin" size={24}/>
                <p className="text-sm font-bold text-gray-600">Extracting OCR Data...</p>
              </div>
            )}

            {ocrStatus === 'Success' && (
              <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-200">
                <p className="text-sm font-bold text-emerald-800 flex items-center justify-center gap-1 mb-2"><CheckCircle size={16}/> Extraction Complete</p>
                <div className="text-xs text-emerald-700 space-y-1 bg-white p-2 rounded border border-emerald-100 opacity-80">
                  <p><strong>Name:</strong> {reservation.guestName}</p>
                  <p><strong>Doc No:</strong> XXXX-8932</p>
                  <p><strong>Match Confidence:</strong> 99%</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Capture Face</button>
            <button className="py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">E-Signature</button>
          </div>

          <button onClick={handleApprove} disabled={ocrStatus !== 'Success'} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Approve & Verify Guest
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold"><Fingerprint size={16}/> Identity Confirmed</div>
            <p className="text-xs text-emerald-700">Document: {reservation.idDocumentType}</p>
          </div>
          
          {reservation.status !== 'Checked-In' && reservation.status !== 'Completed' && (
            <button onClick={onCheckIn} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition">
              Complete Check-In
            </button>
          )}
        </div>
      )}
    </div>
  );
};
