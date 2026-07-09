import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { api } from "../../services/api";
import Papa from "papaparse";
import { 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  Check, 
  Key,
  ChevronDown,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

export const FrontDeskDashboard: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<"All Guests" | "Not Checked In" | "Checked-In" | "Pending" | "Warning">("All Guests");

  // Selection for bulk actions
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([]);

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importSummary, setImportSummary] = useState<{ parsedRows: any[]; successCount: number; errors: string[] } | null>(null);

  // Modals
  const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any>(null);

  // Form states for Block
  const [blockForm, setBlockForm] = useState<any>({});
  
  // Form states for Guest
  const [guestForm, setGuestForm] = useState<any>({});

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/group-checkin/groups');
      setGroups(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const activeGroup = groups[activeGroupIndex];

  // --- CSV Logic ---
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const validateCSV = () => {
    if (!csvFile) return;
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];
        let successCount = 0;
        const validRows: any[] = [];

        results.data.forEach((row: any, index) => {
          if (!row['Guest Name']) errors.push(`Row ${index + 1}: Missing Guest Name`);
          else if (!row['Room Type']) errors.push(`Row ${index + 1}: Missing Room Type`);
          else if (!row['Arrival Date']) errors.push(`Row ${index + 1}: Missing Arrival Date`);
          else if (!row['Departure Date']) errors.push(`Row ${index + 1}: Missing Departure Date`);
          else {
            // validate dates
            const arr = new Date(row['Arrival Date']);
            const dep = new Date(row['Departure Date']);
            if (isNaN(arr.getTime()) || isNaN(dep.getTime())) {
               errors.push(`Row ${index + 1}: Invalid date format. Use YYYY-MM-DD.`);
            } else if (arr >= dep) {
               errors.push(`Row ${index + 1}: Departure must be after arrival.`);
            } else {
               successCount++;
               validRows.push({
                 guestName: row['Guest Name'],
                 roomType: row['Room Type'],
                 arrivalDate: arr.toISOString(),
                 departureDate: dep.toISOString(),
                 billingType: row['Billing Type'] || 'Guest Pay',
                 specialRequests: row['Special Requests'] || ''
               });
            }
          }
        });

        setImportSummary({ parsedRows: validRows, successCount, errors });
      },
      error: (error) => {
        alert("Failed to parse CSV: " + error.message);
      }
    });
  };

  const commitCSVImport = async () => {
    if (!importSummary || !activeGroup) return;
    try {
      await api.post(`/group-checkin/groups/${activeGroup.id}/guests/import`, importSummary.parsedRows);
      setImportSummary(null);
      setCsvFile(null);
      fetchGroups();
      alert("Successfully imported guests!");
    } catch (error) {
      alert("Import failed.");
    }
  };

  // --- BULK ACTIONS ---
  const handleBulkAction = async (action: string, actionData?: any) => {
    if (selectedGuestIds.length === 0) return alert("Select at least one guest.");
    if (!activeGroup) return;
    try {
      await api.post(`/group-checkin/groups/${activeGroup.id}/guests/bulk-action`, {
        action,
        guestIds: selectedGuestIds,
        actionData
      });
      setSelectedGuestIds([]);
      fetchGroups();
      if (action === 'checkin') alert("Bulk Check-In complete for ready guests.");
      if (action === 'assign-room') alert("Rooms automatically assigned sequentially.");
      if (action === 'delete') alert("Guests deleted successfully.");
    } catch (e) {
      console.error(e);
      alert("Bulk action failed.");
    }
  };

  const toggleGuestSelection = (id: number) => {
    if (selectedGuestIds.includes(id)) {
      setSelectedGuestIds(selectedGuestIds.filter(x => x !== id));
    } else {
      setSelectedGuestIds([...selectedGuestIds, id]);
    }
  };
  const selectAllGuests = (filteredGuests: any[]) => {
    if (selectedGuestIds.length === filteredGuests.length) {
      setSelectedGuestIds([]);
    } else {
      setSelectedGuestIds(filteredGuests.map(g => g.id));
    }
  };

  // --- EDIT BLOCK ---
  const openEditBlock = () => {
    if (!activeGroup) return;
    setBlockForm({
      groupName: activeGroup.groupName,
      eventName: activeGroup.eventName || '',
      arrivalDate: new Date(activeGroup.arrivalDate).toISOString().split('T')[0],
      departureDate: new Date(activeGroup.departureDate).toISOString().split('T')[0],
      cutoffDate: activeGroup.cutoffDate ? new Date(activeGroup.cutoffDate).toISOString().split('T')[0] : '',
      roomsBlocked: activeGroup.roomsBlocked
    });
    setIsEditBlockOpen(true);
  };

  const saveEditBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup) return;
    try {
      await api.put(`/group-checkin/groups/${activeGroup.id}`, blockForm);
      setIsEditBlockOpen(false);
      fetchGroups();
    } catch (e) {
      alert("Failed to update block");
    }
  };

  // --- GUEST MODAL ---
  const openGuestModal = (guest?: any) => {
    if (guest) {
      setEditingGuest(guest);
      setGuestForm({
        guestName: guest.guestName,
        roomType: guest.roomType,
        arrivalDate: new Date(guest.arrivalDate).toISOString().split('T')[0],
        departureDate: new Date(guest.departureDate).toISOString().split('T')[0],
        roomNumber: guest.roomNumber || '',
        checkinStatus: guest.checkinStatus,
        billingType: guest.billingType
      });
    } else {
      setEditingGuest(null);
      setGuestForm({
        guestName: '',
        roomType: 'Standard',
        arrivalDate: activeGroup ? new Date(activeGroup.arrivalDate).toISOString().split('T')[0] : '',
        departureDate: activeGroup ? new Date(activeGroup.departureDate).toISOString().split('T')[0] : '',
        roomNumber: '',
        checkinStatus: 'Pending',
        billingType: 'Guest Pay'
      });
    }
    setIsGuestModalOpen(true);
  };

  const saveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup) return;
    try {
      if (editingGuest) {
        await api.put(`/group-checkin/guests/${editingGuest.id}`, guestForm);
      } else {
        await api.post(`/group-checkin/groups/${activeGroup.id}/guests`, guestForm);
      }
      setIsGuestModalOpen(false);
      fetchGroups();
    } catch (e: any) {
      alert("Error saving guest: " + (e.message || ""));
    }
  };

  // --- RENDER HELPERS ---
  const filteredGuests = activeGroup?.guests?.filter((g: any) => {
    if (activeTab === "Not Checked In") return g.checkinStatus !== "Checked-In";
    if (activeTab === "Checked-In") return g.checkinStatus === "Checked-In";
    if (activeTab === "Pending") return g.checkinStatus === "Pending";
    if (activeTab === "Warning") return !g.roomNumber && g.checkinStatus === "Checked-In"; // Just an example warning logic
    return true;
  }) || [];

  if (isLoading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading Live Data...</div>;

  return (
    <div className="space-y-6 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Front Desk</h1>
          <p className="text-sm text-gray-500 mt-1">Live Group check-in blocks, assignments, and CSV imports.</p>
        </div>
        {groups.length > 1 && (
          <select 
            className="border border-gray-300 rounded p-2 text-sm"
            value={activeGroupIndex} 
            onChange={(e) => setActiveGroupIndex(Number(e.target.value))}
          >
            {groups.map((g, i) => <option key={g.id} value={i}>{g.groupName}</option>)}
          </select>
        )}
      </div>

      {!activeGroup ? (
        <Card className="p-10 text-center text-gray-500"><p>No Active Groups Found.</p></Card>
      ) : (
        <>
          {/* Active Block Info */}
          <Card className="relative overflow-hidden bg-white border border-gray-200">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-bl-full pointer-events-none"></div>
            <CardHeader className="flex justify-between items-start border-b-0 pb-1">
              <div>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Active Block</span>
                <CardTitle className="mt-2 text-xl font-bold text-gray-900">{activeGroup.groupName}</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">{activeGroup.eventName}</p>
              </div>
              <div className="flex gap-2 relative z-10">
                <button onClick={openEditBlock} className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
                  <Edit size={14} className="inline mr-1" /> Edit Block
                </button>
                <button onClick={() => document.getElementById('csv-upload')?.click()} className="bg-[#003B95] text-white font-bold text-xs py-2 px-4 rounded-lg shadow transition hover:bg-blue-800 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4" /> CSV Upload
                </button>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold">
                <div><p className="text-gray-500">Block Dates</p><p className="text-gray-900 mt-1">{new Date(activeGroup.arrivalDate).toLocaleDateString()} — {new Date(activeGroup.departureDate).toLocaleDateString()}</p></div>
                <div><p className="text-gray-500">Cut-off Date</p><p className="text-rose-600 font-bold mt-1">{activeGroup.cutoffDate ? new Date(activeGroup.cutoffDate).toLocaleDateString() : 'None'}</p></div>
                <div><p className="text-gray-500">Group ID</p><p className="text-gray-900 mt-1">{activeGroup.groupId}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4"><p className="text-xs text-gray-500 uppercase font-bold">Rooms Blocked</p><p className="text-3xl font-bold text-gray-900 mt-1">{activeGroup.roomsBlocked}</p></Card>
            <Card className="p-4">
              <p className="text-xs text-gray-500 uppercase font-bold">Pickup Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeGroup.pickupRate}%</p>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2"><div className="bg-[#003B95] h-full rounded-full" style={{ width: `${Math.min(100, activeGroup.pickupRate)}%` }}></div></div>
            </Card>
            <Card className="p-4"><p className="text-xs text-gray-500 uppercase font-bold">Picked Up</p><p className="text-3xl font-bold text-gray-900 mt-1">{activeGroup.roomsPickedUp}</p></Card>
            <Card className="p-4"><p className="text-xs text-gray-500 uppercase font-bold">Remaining</p><p className="text-3xl font-bold text-rose-600 mt-1">{activeGroup.inventoryRemaining}</p></Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Table */}
            <div className="xl:col-span-2 space-y-4">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 gap-3">
                  <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold">
                    {(["All Guests", "Not Checked In", "Checked-In", "Pending"].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-3 py-1.5 rounded-md transition ${activeTab === tab ? "bg-white shadow text-[#003B95] font-bold" : "text-gray-500"}`}>{tab}</button>
                    )))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleBulkAction('assign-room', {startRoom: 101})} title="Auto-assign Rooms" className="p-2 border border-gray-300 hover:bg-gray-50 rounded text-gray-600"><Key size={16} /></button>
                    <button onClick={() => handleBulkAction('checkin')} title="Bulk Check-In" className="p-2 border border-gray-300 hover:bg-gray-50 rounded text-gray-600"><Check size={16} /></button>
                    <button onClick={() => handleBulkAction('delete')} title="Bulk Delete" className="p-2 border border-gray-300 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={16} /></button>
                    <button onClick={() => openGuestModal()} className="px-3 py-1.5 bg-[#003B95] text-white rounded text-xs font-bold flex items-center"><Plus size={14} className="mr-1"/> Add Guest</button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                          <th className="px-4 py-3"><input type="checkbox" onChange={() => selectAllGuests(filteredGuests)} checked={selectedGuestIds.length === filteredGuests.length && filteredGuests.length > 0} /></th>
                          <th className="px-4 py-3">Guest</th>
                          <th className="px-4 py-3">Room</th>
                          <th className="px-4 py-3">Dates</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredGuests.length === 0 && (
                          <tr><td colSpan={6} className="text-center py-8 text-gray-500">No guests found.</td></tr>
                        )}
                        {filteredGuests.map((g: any) => (
                          <tr key={g.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3"><input type="checkbox" checked={selectedGuestIds.includes(g.id)} onChange={() => toggleGuestSelection(g.id)} /></td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-gray-900">{g.guestName}</p>
                              <p className="text-xs text-gray-500">{g.confirmationNumber}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-gray-800">{g.roomNumber || 'Unassigned'}</p>
                              <p className="text-xs text-gray-500">{g.roomType}</p>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <p className="text-gray-900">{new Date(g.arrivalDate).toLocaleDateString('en-GB')} - {new Date(g.departureDate).toLocaleDateString('en-GB')}</p>
                              <p className="text-gray-500">{g.numberOfNights} Nights</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${g.checkinStatus === 'Checked-In' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{g.checkinStatus}</span>
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                              <button onClick={() => openGuestModal(g)} className="text-blue-600 hover:underline text-xs font-bold">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CSV Importer Column */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">CSV Rooming List Importer</CardTitle></CardHeader>
                <CardContent>
                  <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition" onClick={() => document.getElementById('csv-upload')?.click()}>
                    <UploadCloud className="text-gray-400 mb-2 w-8 h-8" />
                    <p className="text-sm font-bold text-gray-700">{csvFile ? csvFile.name : 'Click to select CSV File'}</p>
                    <p className="text-xs text-gray-500 mt-1">Columns required: Guest Name, Room Type, Arrival Date, Departure Date</p>
                  </div>
                  {csvFile && (
                    <button onClick={validateCSV} className="w-full mt-4 bg-gray-900 text-white font-bold py-2 rounded shadow">Validate CSV Data</button>
                  )}

                  {importSummary && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-3 text-sm">
                      <p className="font-bold text-green-700"><CheckCircle className="inline mr-1 w-4 h-4" /> {importSummary.successCount} Rows Validated</p>
                      {importSummary.errors.length > 0 && (
                        <div className="text-rose-600 text-xs space-y-1 mt-2">
                          <p className="font-bold"><AlertTriangle className="inline mr-1 w-4 h-4"/> {importSummary.errors.length} Errors Found</p>
                          <div className="max-h-24 overflow-y-auto pl-5">
                            {importSummary.errors.map((e,i) => <p key={i}>• {e}</p>)}
                          </div>
                        </div>
                      )}
                      <button onClick={commitCSVImport} className="w-full bg-[#003B95] text-white font-bold py-2 rounded mt-2">Commit Import ({importSummary.successCount} records)</button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* MODALS */}
      {isEditBlockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-[500px] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Edit Group Block</h3>
              <button onClick={() => setIsEditBlockOpen(false)} className="text-gray-400 hover:text-black">✖</button>
            </div>
            <form onSubmit={saveEditBlock} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-bold mb-1">Group Name</label><input required className="w-full border p-2 rounded" value={blockForm.groupName} onChange={e=>setBlockForm({...blockForm, groupName: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Event Name</label><input className="w-full border p-2 rounded" value={blockForm.eventName} onChange={e=>setBlockForm({...blockForm, eventName: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Arrival Date</label><input type="date" required className="w-full border p-2 rounded" value={blockForm.arrivalDate} onChange={e=>setBlockForm({...blockForm, arrivalDate: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Departure Date</label><input type="date" required className="w-full border p-2 rounded" value={blockForm.departureDate} onChange={e=>setBlockForm({...blockForm, departureDate: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Cut-off Date</label><input type="date" className="w-full border p-2 rounded" value={blockForm.cutoffDate} onChange={e=>setBlockForm({...blockForm, cutoffDate: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Rooms Blocked</label><input type="number" required className="w-full border p-2 rounded" value={blockForm.roomsBlocked} onChange={e=>setBlockForm({...blockForm, roomsBlocked: parseInt(e.target.value)})} /></div>
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <button type="button" onClick={()=>setIsEditBlockOpen(false)} className="px-4 py-2 border rounded font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#003B95] text-white rounded font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-[500px] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">{editingGuest ? "Edit Guest" : "Add Guest"}</h3>
              <button onClick={() => setIsGuestModalOpen(false)} className="text-gray-400 hover:text-black">✖</button>
            </div>
            <form onSubmit={saveGuest} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block font-bold mb-1">Guest Name</label><input required className="w-full border p-2 rounded" value={guestForm.guestName} onChange={e=>setGuestForm({...guestForm, guestName: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Room Type</label><input required className="w-full border p-2 rounded" value={guestForm.roomType} onChange={e=>setGuestForm({...guestForm, roomType: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Room Number (Assign)</label><input className="w-full border p-2 rounded" value={guestForm.roomNumber} placeholder="e.g. 101" onChange={e=>setGuestForm({...guestForm, roomNumber: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Arrival Date</label><input type="date" required className="w-full border p-2 rounded" value={guestForm.arrivalDate} onChange={e=>setGuestForm({...guestForm, arrivalDate: e.target.value})} /></div>
                <div><label className="block font-bold mb-1">Departure Date</label><input type="date" required className="w-full border p-2 rounded" value={guestForm.departureDate} onChange={e=>setGuestForm({...guestForm, departureDate: e.target.value})} /></div>
                <div>
                  <label className="block font-bold mb-1">Status</label>
                  <select className="w-full border p-2 rounded" value={guestForm.checkinStatus} onChange={e=>setGuestForm({...guestForm, checkinStatus: e.target.value})}>
                    <option value="Pending">Pending</option>
                    <option value="Checked-In">Checked-In</option>
                    <option value="Checked-Out">Checked-Out</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Billing Type</label>
                  <select className="w-full border p-2 rounded" value={guestForm.billingType} onChange={e=>setGuestForm({...guestForm, billingType: e.target.value})}>
                    <option value="Guest Pay">Guest Pay</option>
                    <option value="Company Pay">Company Pay</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <button type="button" onClick={()=>setIsGuestModalOpen(false)} className="px-4 py-2 border rounded font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#003B95] text-white rounded font-bold">Save Guest</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
