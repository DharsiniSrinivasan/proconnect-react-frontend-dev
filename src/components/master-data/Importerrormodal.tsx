import {
  X,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface ImportError {
  row: number;
  error: string;
}

interface ImportErrorModalProps {
  open: boolean;
  onClose: () => void;
  errors: ImportError[];
  successCount?: number;
  totalRows?: number;
  fileType?: string;
}

export const ImportErrorModal = ({
  open,
  onClose,
  errors,
  successCount = 0,
  totalRows = 0,
  fileType = "Data",
}: ImportErrorModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
    }
  }, [searchTerm, open]);

  const filteredErrors = useMemo(
    () =>
      errors.filter(
        (err) =>
          err.row.toString().includes(searchTerm) ||
          err.error.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [errors, searchTerm],
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedErrors = filteredErrors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const downloadErrorReport = () => {
    const csvContent = [
      ["Row Number", "Error Message"],
      ...errors.map((err) => [err.row, err.error]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileType}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/20 rounded-lg border border-warning/30">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Import Validation Errors
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {errors.length} {errors.length === 1 ? "row" : "rows"} failed
                validation
                {totalRows > 0 && ` out of ${totalRows} total rows`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success summary if available */}
        {successCount > 0 && (
          <div className="mx-6 mt-4">
            <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
              <p className="text-sm text-success">
                ✓ {successCount} {successCount === 1 ? "row" : "rows"} imported
                successfully
              </p>
            </div>
          </div>
        )}

        {/* Search and Download */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by row number or error message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              onClick={downloadErrorReport}
              className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-foreground transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Error List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredErrors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm
                ? "No errors match your search"
                : "No errors to display"}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedErrors?.map((error, index) => (
                  <div
                    key={`${error.row}-${index}`}
                    className="group p-4 bg-muted/20 hover:bg-muted/40 border border-border/50 hover:border-warning/30 rounded-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-warning/20 border border-warning/30 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-semibold text-warning">
                            {error.row}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Row {error.row}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {error.error}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between w-full">
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-input border border-border rounded text-sm focus:outline-none focus:border-primary/50"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage)}
                  className="w-8 h-8 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
                >
                  {currentPage}
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Page info */}
              <div className="text-sm text-muted-foreground">
                {startIndex + 1}-{Math.min(endIndex, filteredErrors.length)} of{" "}
                {filteredErrors.length}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
