import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Datepicker extends React.Component {
    state = {
        startDate: new Date(),
        endDate: new Date()
    };
    
    handleChangeStartDate = date => {
        this.setState({
            startDate: date
        }, () => this.props.dateChange(this.state));
    };

    handleChangeEndDate = date => {
        this.setState({
            endDate: date
        }, () => this.props.dateChange(this.state));
    }
    
    render() {
        const { startDate, endDate } = this.state;
        return (
            <div>
                <label htmlFor="sDate"> From Date </label>
                <DatePicker
                    dateFormat="yyyy/MM/dd"
                    selected={startDate}
                    onChange={this.handleChangeStartDate}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                />
                <React.Fragment>
                    <label htmlFor="sDate"> To Date  </label>
                    <DatePicker
                        dateFormat="yyyy/MM/dd"
                        selected={endDate}
                        onChange={this.handleChangeEndDate}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                    />
                </React.Fragment>
            </div>
        );
    }
}

export default Datepicker;