import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { SortOption, setSortBy } from "../features/filterSlice";
import { FaSort, FaAngleDown } from "react-icons/fa";

const SortMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((state) => state.filters.sortBy);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Сначала новые" },
    { value: "oldest", label: "Сначала старые" },
    { value: "price_high", label: "По убыванию цены" },
    { value: "price_low", label: "По возрастанию цены" },
  ];

  const handleSortChange = (option: SortOption) => {
    dispatch(setSortBy(option));
    setIsOpen(false);
  };

  const currentSortLabel = sortOptions.find(
    (option) => option.value === sortBy
  )?.label;

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{ minWidth: '120px', height: '32px' }}
      >
        <FaSort className="text-gray-500 text-xs" />
        <span className="truncate text-xs">{currentSortLabel}</span>
        <FaAngleDown className={`transition-transform text-xs ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {sortOptions.map((option) => (
              <li
                key={option.value}
                className={`px-3 py-1 text-xs cursor-pointer hover:bg-gray-100 ${
                  sortBy === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortMenu; 