import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SearchModal.css';

/**
 * SearchModal props:
 * - open: boolean (show/hide modal)
 * - onClose: function
 * - onSearch: function (called with search text, for parent-controlled results)
 * - api: string (optional, endpoint to call with ?keyword=...)
 * - results: array of {label, value} (for parent-controlled results)
 * - onSelect: function (called with selected item)
 * - selected: array of {label, value} (currently selected items)
 * - onRemove: function (called with item to remove)
 * - placeholder: string
 */
export default function SearchModal({
  open,
  onClose,
  onSearch,
  api,
  results: propResults,
  onSelect,
  selected = [],
  onRemove,
  placeholder = 'Search...',
}) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setSearch('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (onSearch) {
      onSearch(search);
    } else if (api) {
      setLoading(true);
      axios
        .get(baseUrl + api, {
          headers: {
            Authorization:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNTAxMTc1fQ.eGqQT8W9GehLETGFwhYtUvdq304GEEVeMGRXoEeIEtmo7LtZNWonidm6ZiL1jW2XmunhBQ0fPmwbHnq3DB7PDA',
            RefreshToken:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzU4Mzk3NX0.Zks4sE2Wex6rYay4tubdv4Qdxx-i17dRcLPRxlKXCh440FMeHsDrNQhzVZirtp3ZzyTZqCt5QMD4ZkGmMaGIqg',
          },
          params: {
            keyword: search,
          },
        })
        .then((res) => {
          const data = res.data;
          if (Array.isArray(data)) {
            setResults(
              typeof data[0] === 'string'
                ? data.map((v) => ({ label: v, value: v }))
                : data
            );
          } else {
            setResults([]);
          }
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }
  }, [search, onSearch, api, open]);

  // Use parent results if provided, else internal
  const displayResults = propResults !== undefined ? propResults : results;

  if (!open) return null;

  return (
    <div className="searchModalOverlay">
      <div className="searchModalBox searchModalBoxLarge">
        <div className="searchModalHeader">
          {/* Selected pills */}
          {selected && selected.length > 0 && (
            <div className="searchModalSelectedList">
              {selected.map((item) => (
                <span className="searchModalSelectedPill" key={item.value}>
                  {item.label}
                  {onRemove && (
                    <button
                      className="searchModalSelectedRemove"
                      onClick={() => onRemove(item)}
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          <input
            className="searchModalSearchInput"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <button className="searchModalCloseX" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="searchModalResults">
          {loading ? (
            <div className="searchModalNoResult">Loading...</div>
          ) : displayResults && displayResults.length > 0 ? (
            displayResults.map((item) => (
              <div className="searchModalResultRow" key={item.foodId}>
                <span className="searchModalResultLabel">{item.foodName}</span>
                <button
                  className="searchModalResultAdd"
                  onClick={() => onSelect(item)}
                >
                  +
                </button>
              </div>
            ))
          ) : (
            <div className="searchModalNoResult">No results</div>
          )}
        </div>
      </div>
    </div>
  );
}
