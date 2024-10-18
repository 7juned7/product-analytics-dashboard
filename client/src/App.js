
import { useContext, useEffect, useState } from 'react';
import './App.css';
import axios from "axios"

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





  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }


  }, [])

  const handleFilter = (filter, dataToFilter, shouldUpdateUrl = true) => {
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


    const changeDateFormate = (date) => {
      date = new Date(date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      return formattedDate;
    }
    const startDate = changeDateFormate(filter.startDate);
    const endDate = changeDateFormate(filter.endDate);


    let filteredResults = dataToFilter.filter((item) => {
      const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);  // Reformat to YYYY-MM-DD
      };
      const x = formatDate(startDate)
      const y = formatDate(endDate)
      const itemDate = formatDate(item.Day)

      if (itemDate >= x && itemDate <= y) {

        return itemDate
      }



    });


    if (filter.gender) {
      filteredResults = filteredResults.filter((item) => item.Gender.includes(filter.gender));
    }

    // Apply age range filter
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
  };
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
    // If filters exist in the URL, apply them
    if (filterFromUrl.startDate || filterFromUrl.gender || filterFromUrl.ageRange || filterFromUrl.endDate) {
      handleFilter(filterFromUrl, data, false); // Apply filters from URL on page load
    }
  }, [location.search, data]);


  return (
    <div className="App">
      <div className="container">



        {user ? (<main>
          <section className='filterSection'>
            <Filter handleApply={handleFilter} handleClearPreferences={clearPreferences} data={data} reset={resetFilters} />

          </section>
          <section className='charts'>
            <BarChart data={filteredData} />
          </section>
        </main>) : ("Please log in")}
      </div>
    </div>
  );
}

export default App;
