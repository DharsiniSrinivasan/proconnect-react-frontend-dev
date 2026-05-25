  import { useState, useEffect } from "react";
  import { useSearchParams } from "react-router-dom";
  import { AppShell } from "@/components/layout/AppShell";
  import { Button } from "@/components/ui/button";
  import {
    DatasetSummaryStrip,
    DatasetSummaryStripSkeleton,
  } from "@/components/data-acquisition/DatasetSummaryStrip";
  import {
    DatasetTable,
    SortOrder,
  } from "@/components/data-acquisition/DatasetTable";
  import { useDataSetStore } from "@/stores/dataSetStore";
  
  import { getStorage } from "@/utils/storage";

  const DatasetsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const storage = getStorage();

    const getInitialState = () => {
      const savedState = storage.getItem("datasetPageState");
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          return null;
        }
      }
      return null;
    };

    const initialState = getInitialState();

    const [currentPage, setCurrentPage] = useState<number>(
      initialState?.page || 1,
    );
    const [filter_name, setFilter_name] = useState(
      initialState?.filter_name || "",
    );
    const [filter_customer, setFilter_customer] = useState(
      initialState?.filter_customer || "",
    );
    const [batch_name, setBatch_name] = useState(initialState?.batch_name || "");
    const [filter_uploadId, setUploadId] = useState(
      initialState?.filter_uploadId || "",
    );
    const [filter_uploadAt, setUploadAt] = useState(
      initialState?.filter_uploadAt || null,
    );
    const [filter_uploadBy, setUploadBy] = useState(
      initialState?.filter_uploadBy || "",
    );
    const [statusFilter, setStatusFilter] = useState(
      initialState?.statusFilter || "",
    );
    const [filter_dqs, setDqs] = useState(initialState?.filter_dqs || "");
    const [sortBy, setSortBy] = useState<string | null>(
      initialState?.sortBy || null,
    );
    const [sortOrder, setSortOrder] = useState<SortOrder>(
      initialState?.sortOrder || null,
    );
    const {
      data, 
      summary,
      pageSize,
      setPageSize,
      fetchDataSet,
      isLoading,
      total,
      error,
    } = useDataSetStore();

    useEffect(() => {
      if (initialState?.pageSize) {
        setPageSize(initialState.pageSize);
      }
    }, []);

    useEffect(() => {
      const lastViewedDataset = storage.getItem("lastViewedDataset");
      if (lastViewedDataset && !searchParams.get("highlight")) {
        setSearchParams({ highlight: lastViewedDataset }); 
        storage.removeItem("lastViewedDataset");
        setTimeout(() => {
          storage.removeItem("datasetPageState");
        }, 2000);
      }
    }, []);

    useEffect(() => {
      fetchDataSet(
        currentPage,
        pageSize,
        batch_name,
        filter_customer,
        filter_name,
        filter_uploadId,
        statusFilter,
        filter_uploadBy,
        filter_uploadAt,
        Number(filter_dqs),
        sortBy,
        sortOrder,
      );
    }, [
      pageSize,
      currentPage,
      batch_name,
      filter_customer,
      filter_name,
      filter_uploadAt,
      filter_uploadBy,
      filter_uploadId,
      filter_dqs,
      statusFilter,
      sortBy,
      sortOrder,
      fetchDataSet,
    ]);

   

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    };

    const handleStatusFilterChange = (value: string) => {
      setStatusFilter(value);
      setCurrentPage(1);
    };

    const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setCurrentPage(1);
    };

    // Calculate total pages safely

    const hasSummary = summary && Object.keys(summary).length > 0;

    // Handle error state
    if (error) {
      return (
        <AppShell pageTitle="Data Ingestion" pageSubtitle="Batches">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Error Loading Data
            </h2>
            <p className="text-muted-foreground mb-4">
              {"Failed to load datasets"}
            </p>
            <Button onClick={() => fetchDataSet(currentPage, pageSize)}>
              Retry
            </Button>
          </div>
        </AppShell>
      );
    }

    return (
      <AppShell pageTitle="Data Ingestion" pageSubtitle="Batches">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Data Ingestion – Batches
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and view all your uploaded batches
            </p>
          </div>
        </div>

        {/* Summary Strip */}
        <section className="mb-6">
          {!hasSummary ? (
            <DatasetSummaryStripSkeleton />
          ) : (
            <DatasetSummaryStrip summary={summary} />
          )}
        </section>

        {/* Datasets Table */}
        <section>
          <DatasetTable
            isLoading={isLoading}
            datasets={data}
            onPageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
            page={currentPage}
            onPageChange={handlePageChange}
            totalRecords={total}
            // Filter props
            batch_name={batch_name}
            setBatch_name={setBatch_name}
            filter_name={filter_name}
            setFilter_name={setFilter_name}
            filter_customer={filter_customer}
            setFilter_customer={setFilter_customer}
            filter_uploadId={filter_uploadId}
            setUploadId={setUploadId}
            filter_uploadAt={filter_uploadAt}
            setUploadAt={setUploadAt}
            filter_uploadBy={filter_uploadBy}
            setUploadBy={setUploadBy}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            filter_dqs={filter_dqs}
            setDqs={setDqs}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </section>
      </AppShell>
    );
  };

  export default DatasetsPage;
