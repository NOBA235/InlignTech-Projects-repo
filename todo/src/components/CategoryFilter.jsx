import React from 'react';
import { BsGrid } from 'react-icons/bs';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { value: 'all', label: 'All', icon: '📋', count: null },
    { value: 'work', label: 'Work', icon: '💼', color: 'bg-blue-500' },
    { value: 'personal', label: 'Personal', icon: '👤', color: 'bg-green-500' },
    { value: 'shopping', label: 'Shopping', icon: '🛒', color: 'bg-purple-500' },
    { value: 'health', label: 'Health', icon: '🏥', color: 'bg-red-500' },
    { value: 'education', label: 'Education', icon: '📚', color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BsGrid className="text-gray-600" />
        <span className="text-gray-600 font-medium">Categories:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
              ${selectedCategory === category.value
                ? 'bg-white shadow-md border border-gray-200'
                : 'bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            {category.icon && (
              <span className="text-xl">{category.icon}</span>
            )}
            <span className="font-medium text-gray-700">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;