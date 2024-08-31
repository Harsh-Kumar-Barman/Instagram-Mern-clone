// SearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import myPic from '../assets/myPic.jpeg';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [query]);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await axios.get(`/api/search?query=${query}`);
    //   console.log(response.data )
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleChange = (e) => {
    setQuery(prev=>e.target.value.trim());
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center">
        <input
          type="text"
          className="w-full px-4 py-2 border bg-black text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for users..."
          value={query}
          aria-label="Search for users"
          onChange={handleChange}
        />
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-black border border-gray-300 rounded-lg shadow-lg">
          <ul>
            {results.map((result, index) => (
              <li
                key={result._id}
                className="px-4 py-2 border-b border-gray-600 hover:bg-gray-800"
              >
                <Link to={`/profile/${result.username}`}>
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
                      </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
