// src/components/Filter.js

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Filter = ({ handleApply, data, handleClearPreferences, reset }) => {

    // Initialize state for all filters in a single object
    const [filters, setFilters] = useState({
        ageRange: '',
        gender: '',
        startDate: null,
        endDate: null,
    });

    // Define the min and max dates
    const minAllowedDate = new Date(2022, 9, 4); // 4th October 2022
    const maxAllowedDate = new Date(2022, 9, 29); // 29th October 2022

    useEffect(() => {
        if (reset) {
            setFilters({
                ageRange: '',
                gender: '',
                startDate: null,
                endDate: null
            });
        }

    }, [reset]);


    useEffect(() => {

        const storedPreferences = localStorage.getItem('filterPreferences');
        console.log(storedPreferences)
        if (storedPreferences) {
            const parsedPreferences = JSON.parse(storedPreferences);
            setFilters((prevFilters) => ({
                ...prevFilters,
                ...parsedPreferences, // Spread the stored preferences into the filters
            }));
        } else {
            console.log('No preferences found in localStorage.');
        }
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleDateChange = (date, name) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: date,
        }));
    };

    return (
        <section className='filter-section'>
            <h2>Filter By:</h2>
            <div >
                <label htmlFor='ageRange'>
                    Age Range:
                    <select
                        id='ageRange'
                        name="ageRange"
                        value={filters.ageRange}
                        onChange={handleChange}
                    >
                        <option value="">Select Age Range</option>
                        <option value="15-25">15-25</option>
                        <option value=">25">>25</option>
                    </select>
                </label>
            </div>
            <div>
                <label htmlFor='gender'>
                    Gender:
                    <select
                        id='gender'
                        name="gender"
                        value={filters.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
            </div>
            <div>
                <label htmlFor='startDate'>
                    Start Date:
                    <DatePicker
                        id='startDate'
                        name='startDate'
                        required
                        selected={filters.startDate}
                        onChange={(date) => handleDateChange(date, 'startDate')}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select start date"
                        minDate={minAllowedDate} // Restrict to start date from 4th December 2022
                        maxDate={maxAllowedDate} // Restrict to end date up to 29th December 2022
                    />
                </label>
            </div>
            <div>
                <label htmlFor='endDate'>
                    End Date:
                    <DatePicker
                        id='endDate'
                        name='endDate'
                        required
                        selected={filters.endDate}
                        onChange={(date) => handleDateChange(date, 'endDate')}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select end date"
                        minDate={filters.startDate} // Ensure end date is not before start date
                        maxDate={maxAllowedDate}
                    />
                </label>
            </div>
            <div className="filter-btns">
                <button className='apply-btn' onClick={() => handleApply(filters, data)}>Apply</button>
                <button className='clear-btn' onClick={() => handleClearPreferences()}>Clear Preferences</button>

            </div>
        </section>
    );
};

export default Filter;
