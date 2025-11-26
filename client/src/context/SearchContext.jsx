// client/src/context/SearchContext.jsx
import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchedLocation, setSearchedLocation] = useState(null);

  return (
    <SearchContext.Provider value={{ searchedLocation, setSearchedLocation }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};