import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T | ((item: T) => string);
  initialRowsPerPage?: number;
  actions?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  initialRowsPerPage = 10,
  actions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    return data.filter((item) => {
      if (typeof searchKey === "function") {
        return searchKey(item).toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchKey) {
        const val = item[searchKey];
        return String(val).toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // Default: search all string/number fields in item
      return Object.values(item as Record<string, unknown>).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, searchKey]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // Handle function accessors or direct keys
      if (typeof valA === "function") valA = valA(a);
      if (typeof valB === "function") valB = valB(b);

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    
    const key = (column.sortKey || String(column.accessor)) as string;
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push(-1); // ellipsis
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-customText-mutedLight dark:text-customText-mutedDark" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-customBorder-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-customText-light dark:text-customText-dark shadow-sm transition-all"
          />
        </div>
        
        {/* Action Panel */}
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-customBorder-light dark:border-customBorder-dark rounded-xl bg-white dark:bg-customCard-dark shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-customText-light dark:text-customText-dark">
          <thead className="bg-[#F8F9FB] dark:bg-slate-800 border-b border-customBorder-light dark:border-customBorder-dark text-xs uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark font-semibold">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(column)}
                  className={`px-6 py-4 ${
                    column.sortable ? "cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-700/50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortKey === (column.sortKey || String(column.accessor)) ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )
                        ) : (
                          <div className="w-3 h-3 opacity-30 flex flex-col justify-center">
                            <ChevronUp className="w-2.5 h-2.5 -mb-0.5" />
                            <ChevronDown className="w-2.5 h-2.5 -mt-0.5" />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-customBorder-light dark:divide-customBorder-dark">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((column, colIdx) => {
                    const cellContent =
                      typeof column.accessor === "function"
                        ? column.accessor(item)
                        : (item[column.accessor] as React.ReactNode);
                    
                    return (
                      <td key={colIdx} className="px-6 py-4 font-medium align-middle">
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-customText-mutedLight dark:text-customText-mutedDark"
                >
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
          {/* Status info */}
          <div className="text-xs text-customText-mutedLight dark:text-customText-mutedDark">
            Showing <span className="font-semibold">{Math.min(filteredData.length, (currentPage - 1) * rowsPerPage + 1)}</span> to{" "}
            <span className="font-semibold">{Math.min(filteredData.length, currentPage * rowsPerPage)}</span> of{" "}
            <span className="font-semibold">{filteredData.length}</span> results
          </div>

          {/* Nav pagination */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Page Size select */}
            <div className="flex items-center space-x-1.5 mr-2">
              <span className="text-xs text-customText-mutedLight dark:text-customText-mutedDark">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-customBorder-dark rounded-lg py-1 px-1.5 text-customText-light dark:text-customText-dark focus:outline-none"
              >
                {[5, 10, 20, 50].map((sizeOption) => (
                  <option key={sizeOption} value={sizeOption}>
                    {sizeOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Prev page button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-customBorder-light dark:border-customBorder-dark bg-white dark:bg-customCard-dark text-customText-light dark:text-customText-dark hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-customCard-dark transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number steps */}
            {pageNumbers.map((num, idx) => {
              if (num === -1) {
                return (
                  <span
                    key={idx}
                    className="px-2 text-customText-mutedLight dark:text-customText-mutedDark select-none"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold border transition ${
                    currentPage === num
                      ? "bg-primary border-primary text-white"
                      : "border-customBorder-light dark:border-customBorder-dark bg-white dark:bg-customCard-dark text-customText-light dark:text-customText-dark hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {num}
                </button>
              );
            })}

            {/* Next page button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-customBorder-light dark:border-customBorder-dark bg-white dark:bg-customCard-dark text-customText-light dark:text-customText-dark hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-customCard-dark transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
