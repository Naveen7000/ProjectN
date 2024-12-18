db.collectionName.find({
  timestamp: {
    $gte: ISODate("2024-11-01T05:00:00.000+00:00"),
    $lte: ISODate("2024-11-01T19:00:00.000+00:00")
  },
  $expr: {
    $and: [
      { $eq: [{ $minute: "$timestamp" }, 0] },
      { $eq: [{ $second: "$timestamp" }, 0] }
    ]
  }
})


import React, { Component } from 'react';

class DatePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateInput: '',
            isValidDate: true,
        };
    }

    // Function to validate date format (MM/DD/YYYY)
    validateDateFormat = (dateString) => {
        // Define the expected date format (MM/DD/YYYY)
        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        
        // Check if the date matches the expected format
        return datePattern.test(dateString);
    };

    // Handler for input change
    handleDateChange = (event) => {
        const dateInput = event.target.value;
        const isValidDate = this.validateDateFormat(dateInput);

        // Update state with the input and its validity
        this.setState({
            dateInput,
            isValidDate,
        });
    };

    render() {
        const { dateInput, isValidDate } = this.state;

        return (
            <div>
                <input
                    type="text"
                    value={dateInput}
                    onChange={this.handleDateChange}
                    placeholder="MM/DD/YYYY"
                />
                {!isValidDate && <p style={{ color: 'red' }}>Invalid date format. Use MM/DD/YYYY.</p>}
            </div>
        );
    }
}

export default DatePickerComponent;

function convertToString(date) {
    // Check if input is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error("Invalid Date object");
    }

    // Extract month, day, and year from the Date object
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // Format and return as MM/DD/YYYY
    return `${month}/${day}/${year}`;
}

function convertToString(dateString) {
    // Split the input date string by '/'
    const [month, day, year] = dateString.split('/');

    // Validate the date parts
    if (!month || !day || !year || isNaN(new Date(`${year}-${month}-${day}`))) {
        throw new Error("Invalid date string");
    }

    // Ensure month and day are two digits
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');

    // Return the corrected date format
    return `${formattedMonth}/${formattedDay}/${year}`;
}

function convertToString(dateString) {
    // Parse the input date string into a Date object
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date)) {
        throw new Error("Invalid date string");
    }

    // Extract month, day, and year from the Date object
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // Format and return as MM/DD/YYYY
    return `${month}/${day}/${year}`;
}


function convertToDateObject(dateString) {
    // Split the input date string by '/'
    const [month, day, year] = dateString.split('/').map(Number);

    // Validate the date parts
    if (!month || !day || !year) {
        throw new Error("Invalid date string");
    }

    // Create a Date object (month is 0-indexed in JavaScript Date)
    const date = new Date(year, month - 1, day);

    // Check if the Date object is valid
    if (isNaN(date)) {
        throw new Error("Invalid date created");
    }

    return date;
}
