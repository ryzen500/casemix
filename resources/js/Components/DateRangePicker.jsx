import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css"; // Import Flatpickr styles
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";


const DateRangePicker = ({ label, dateRange, setDateRange, isRange, handleToggle }) => {
    return (
        <div>
            <h1 style={{marginBottom:"10px"}}>{label}</h1>

            <div style={{ display: "flex", alignItems: "center" }}>
                <Flatpickr
                    value={dateRange}
                    onChange={(selectedDates) => setDateRange(selectedDates)}
                    options={{
                        mode: isRange ? "range" : "single",
                        dateFormat: "Y-m-d",
                        disableMobile: true,
                    }}
                />

                {/* Toggle switch icon only */}
                {/* <i 
                    className={`fa-solid ${isRange ? 'fa-toggle-on' : 'fa-toggle-off'}`} 
                    style={{ fontSize: "24px", marginLeft: "10px", cursor: "pointer" }}
                    onClick={handleToggle}
                /> */}
                <FontAwesomeIcon
                    icon={isRange ? faToggleOn : faToggleOff}
                    style={{ fontSize: "24px", marginLeft: "10px", cursor: "pointer" }}
                    onClick={handleToggle}
                />
                <span style={{marginLeft:"15px"}}>
                {isRange ? "Filter Berdasarkan Periode" : "Filter Berdasarkan Harian"}

                </span>

            </div>
        </div>
    );
};

export default DateRangePicker;
