// src/components/BarChart.js

import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom';
import Chart from 'chart.js/auto'; // Automatically register all componentsS
import zoomPlugin from 'chartjs-plugin-zoom';
import './../App.css'
Chart.register(zoomPlugin);
const BarChart = ({ data }) => {
    const [product, setProduct] = useState("");

    useEffect(() => {

    }, [product])


    const products = ["A", "B", "C", "D", "E", "F"];
    // Prepare data for the chart
    const barData = {
        labels: products, // X-axis labels representing each product
        datasets: [
            {
                label: "Products", // Common label for the dataset
                data: [
                    data.reduce((sum, item) => sum + parseInt(item.A), 0), // Total for A
                    data.reduce((sum, item) => sum + parseInt(item.B), 0), // Total for B
                    data.reduce((sum, item) => sum + parseInt(item.C), 0), // Total for C
                    data.reduce((sum, item) => sum + parseInt(item.D), 0), // Total for D
                    data.reduce((sum, item) => sum + parseInt(item.E), 0), // Total for E
                    data.reduce((sum, item) => sum + parseInt(item.F), 0), // Total for F
                ],
                backgroundColor: products.map(p => p === product ? 'red' : 'blue'), // Dynamically highlight a product if needed
                borderColor: 'blue',
                borderWidth: 2,
                hoverBackgroundColor: "red",
            },
        ],
    };


    const lineData = {


        labels: data.map(item => item.Day), // Extracting dates for the x-axis
        datasets: [
            {
                label: `Product ${product}`,
                data: data.map(item => item[product]), // Extracting entries for product A
                fill: false,
                borderColor: "blue",
                tension: 0.1,
                backgroundColor: 'blue',
            },

        ]
    };
    const zoomOptions = {
        limits: {
            x: { min: 0, max: 2000, minRange: 10 },
            y: { min: 0, max: 2000, minRange: 10 }
        },
        pan: {
            enabled: true,
            mode: 'xy',
        },
        zoom: {
            wheel: {
                enabled: true,
            },
            pinch: {
                enabled: true
            },
            mode: 'x',
            onZoomComplete({ chart }) {
                // This update is needed to display up to date zoom level in the title.
                // Without this, previous zoom level is displayed.
                // The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
                chart.update('none');
            }
        }
    };


    return (
        <div className='analytics-dashboard'>
            <div className="chart">

                <Bar
                    data={barData}
                    options={{
                        indexAxis: 'y', // Keep bars horizontal
                        responsive: true,
                        aspectRatio: 2 / 1.5,
                        plugins: {

                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 10,
                                    },
                                    padding: 10,
                                    boxWidth: 20,
                                },
                            },
                            title: {
                                display: true,
                                text: 'Total Time Spent on Features A, B, C, D, E, F',
                            },
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    autoSkip: false, // Prevent auto-skipping of labels
                                    maxRotation: 90, // Maximum rotation angle
                                    minRotation: 90, // Minimum rotation angle
                                },
                            },
                        },

                        onClick: (event, elements) => {

                            if (elements.length > 0) {
                                const index = elements[0].index;

                                const selectedProduct = products[index];
                                setProduct(selectedProduct);
                            }
                        },
                    }}
                />

            </div>
            <div className="chart">

                <Line
                    data={lineData}
                    options={{
                        responsive: true,
                        aspectRatio: 2 / 1.5,

                        plugins: {
                            zoom: zoomOptions,
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 10,
                                    },
                                    padding: 10,
                                    boxWidth: 20,
                                },
                            },
                            title: {
                                display: true,
                                text: 'Time Spent Over Days',
                            },



                        },

                    }}
                />
            </div>
        </div>
    );
};

export default BarChart;
