// SlidingSearchBar.js
import React, { useState } from 'react';
import axios from 'axios';
import myPic from '../assets/myPic.jpeg';

const SlidingSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await axios.get(`/api/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    handleSearch();
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSearch}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Search
      </button>

      <div
        className={`fixed top-0 left-0 right-0 bg-black transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <input
            type="text"
            className="w-full px-4 py-2 bg-black text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for users..."
            value={query}
            aria-label="Search for users"
            onChange={handleChange}
          />
          <button
            onClick={toggleSearch}
            className="ml-2 text-white focus:outline-none"
          >
            ✖
          </button>
        </div>

        {results.length > 0 && (
          <div className="absolute z-10 w-full bg-black border-t border-gray-300 shadow-lg">
            <ul>
              {results.map((result, index) => (
                <li
                  key={index}
                  className="px-4 py-2 border-b border-gray-600 hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[42px] h-[42px] border border-zinc-500 rounded-full overflow-hidden">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        src={myPic}
                        alt={`Profile picture of ${result.username}`}
                      />
                    </div>
                    <span>{result.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidingSearchBar;
