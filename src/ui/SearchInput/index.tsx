import React, { useRef } from "react";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";

interface SearchComponentProps {
  params: Record<string, any>;
  navigate: (params: { search: string }) => void;
}

export const SearchInput: React.FC<SearchComponentProps> = ({
  params,
  navigate,
}) => {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue = (e.target as HTMLInputElement).value;

    // Clear any existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new debounce timer
    debounceTimer.current = setTimeout(() => {
      const queryString = convertObjectIntoQueryParams({
        ...params,
        searchKey: inputValue,
      });
      navigate({ search: queryString });
    }, 2000); 
  };

  return (
    <div className="relative col-span-1">
      <input
        type="text"
        className="w-auto border border-gray-300 rounded-md pl-10 py-2 text-sm"
        placeholder="Search by name"
        onKeyUp={handleKeyUp}
        defaultValue={params?.searchKey}
      />
      <div className="absolute top-2.5 left-3 text-gray-500">🔍</div>
    </div>
  );
};

export default SearchInput;
