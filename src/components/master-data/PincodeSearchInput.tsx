import { Search, Loader2, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NeonInput } from "./MasterModal";
import { useFacilityStore } from "@/stores/masterStore";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (item: any) => void;
  error?: boolean;
  initialGeographyId?: number;
}

const PincodeSearchInput = ({
  value,
  onChange,
  onSelect,
  error,
  initialGeographyId,
}: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { fetchGeography, geography } = useFacilityStore();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentPage = 0;

  useEffect(() => {
    if (initialGeographyId && geography.length > 0 && !isInitialized) {
      const matched = geography.find(
        (g) => g.geography_master_id === initialGeographyId,
      );

      if (matched) {
        setSelectedItem(matched);
        setIsInitialized(true);
      }
    }
  }, [initialGeographyId, geography, isInitialized]);

  useEffect(() => {
    if (!selectedItem && value?.trim()) {
      setSearchResults(geography ?? []);
      setIsLoading(false);
    }
  }, [geography, selectedItem, value]);

  useEffect(() => {
    if (selectedItem) return;

    const handler = setTimeout(async () => {
      if (!value?.trim()) {
        setSearchResults([]);
        setIsOpen(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await fetchGeography(currentPage, 10, value);
        setIsOpen(true);
      } catch (err) {
        console.error("Pincode fetch failed", err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [value, fetchGeography, selectedItem]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    setIsOpen(false);
    setSearchResults([]);
    onSelect(item);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />

        <NeonInput
          value={value}
          placeholder="Search by pincode.."
          error={error}
          className="pl-9 pr-10"
          onFocus={() => {
            if (!selectedItem && searchResults.length > 0) {
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            if (selectedItem && e.target.value !== selectedItem.pincode) {
              setSelectedItem(null);
              setIsInitialized(false);
            }
            onChange(e);
          }}
        />

        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !selectedItem && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg max-h-52 overflow-y-auto z-[9999]">
          {searchResults?.map((item) => (
            <button
              key={item.geography_master_id}
              onClick={() => handleSelect(item)}
              className="flex gap-3 px-4 py-3 cursor-pointer hover:bg-accent border-b last:border-0"
            >
              <MapPin className="w-4 h-4 text-primary mt-1" />
              <div>
                <div className="text-sm font-medium">{item.pincode}</div>
                <div className="text-xs text-muted-foreground">
                  {item.district}, {item.city}, {item.state}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen &&
        !isLoading &&
        value &&
        searchResults.length === 0 &&
        !selectedItem && (
          <div className="absolute left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg p-4 z-[9999]">
            <p className="text-sm text-muted-foreground text-center">
              No pincodes found
            </p>
          </div>
        )}
    </div>
  );
};

export default PincodeSearchInput;
