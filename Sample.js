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
