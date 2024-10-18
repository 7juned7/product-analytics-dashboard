import { useContext, useEffect, useState, useCallback } from 'react';
import './App.css';
import axios from "axios";
import BarChart from './Components/BarChart';
import Filter from './Components/Filter';
import { AuthContext } from './Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const { user, setUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [resetFilters, setResetFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized handleFilter function
  const handleFilter = useCallback((filter, dataToFilter, shouldUpdateUrl = true) => {
    setResetFilters(false);
    if (shouldUpdateUrl) {
      const queryParams = new URLSearchParams({
        ageRange: filter.ageRange || '',
        gender: filter.gender || '',
        startDate: filter.startDate || '',
        endDate: filter.endDate || ''
      }).toString();
      navigate(`/?${queryParams}`, { replace: true }); // Update URL without reloading
    }

    const changeDateFormat = (date) => {
      date = new Date(date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const startDate = changeDateFormat(filter.startDate);
    const endDate = changeDateFormat(filter.endDate);

    let filteredResults = dataToFilter.filter((item) => {
      const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`); // Reformat to YYYY-MM-DD
      };

      const start = formatDate(startDate);
      const end = formatDate(endDate);
      const itemDate = formatDate(item.Day);

      return itemDate >= start && itemDate <= end; // Directly return the condition
    });

    if (filter.gender) {
      filteredResults = filteredResults.filter((item) => item.Gender.includes(filter.gender));
    }

    if (filter.ageRange) {
      filteredResults = filteredResults.filter((item) => item.Age.includes(filter.ageRange));
    }

    setFilteredData(filteredResults);
    localStorage.setItem('filterPreferences', JSON.stringify({
      startDate: filter.startDate,
      endDate: filter.endDate,
      gender: filter.gender,
      ageRange: filter.ageRange
    }));
  }, [navigate]); // Add navigate to the dependencies

  // Memoized fetchData function
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get('/api/data'); // Calling the backend API
      setData(res.data);

      const filterPreferences = JSON.parse(localStorage.getItem('filterPreferences'));
      if (filterPreferences) {
        handleFilter(filterPreferences, res.data); // Apply saved filter preferences to fetched data
      }
    } catch (error) {
      console.error("There was an error fetching the data:", error.message);
    }
  }, [handleFilter]); // Add handleFilter as a dependency

  // useEffect to fetch data on mount
  useEffect(() => {
    fetchData(); // Fetch data on mount

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [fetchData, setUser]); // Include fetchData in the dependencies

  const clearPreferences = () => {
    localStorage.removeItem('filterPreferences');
    navigate('/'); // Remove preferences from localStorage
    setFilteredData([]); // Reset filteredData to the original data
    setResetFilters(true);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filterFromUrl = {
      ageRange: queryParams.get('ageRange') || '',
      gender: queryParams.get('gender') || '',
      startDate: queryParams.get('startDate') || '',
      endDate: queryParams.get('endDate') || ''
    };
    if (filterFromUrl.startDate || filterFromUrl.gender || filterFromUrl.ageRange || filterFromUrl.endDate) {
      handleFilter(filterFromUrl, data, false); // Apply filters from URL on page load
    }
  }, [location.search, data, handleFilter]); // Include handleFilter in the dependencies

  return (
    <div className="App">
      <div className="container">
        {user ? (
          <main>
            <section className='filterSection'>
              <Filter handleApply={handleFilter} handleClearPreferences={clearPreferences} data={data} reset={resetFilters} />
            </section>
            <section className='charts'>
              <BarChart data={filteredData} />
            </section>
          </main>
        ) : ("Please log in")}
      </div>
    </div>
  );
}

export default App;
