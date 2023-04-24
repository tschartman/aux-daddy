import React from 'react';

const SearchBar = ({ inputValue, setInputValue, handleInputFocus, handleInputBlur }) => {
  return (
    <input
      type="text"
      value={inputValue}
      placeholder="Search Music..."
      className="w-full md:w-96 m-4 px-3 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      onChange={(event) => setInputValue(event.target.value)}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
    />
  );
};

export default SearchBar;