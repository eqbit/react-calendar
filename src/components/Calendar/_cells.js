import React from 'react';
import dateFns from "date-fns";
import format from '../../lib/format';
import Cell from './_cell';
import QuickAddEventForm from '../QuickAddEventForm'
import {getEventKey, getDayKey, getDate, getStoredEvents} from '../../lib/functions';

const storedEvents = getStoredEvents();
const initEvents = storedEvents ? storedEvents : {};

class Cells extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            events: initEvents
        }
    }
    
    addEvent = (day, event) => {
        const {events} = this.state;
        
        if(!event || !event.title) {
            console.log("no data");
            return;
        }
        
        events[getEventKey(day)] = {
            title: event.title,
            date: getDate(day),
            people: event.people,
            description: event.description
        };
        
        localStorage.setItem("events", JSON.stringify(events));
        this.setState({events});
    };
    
    submitHandler = (day, data) => {
        this.addEvent(day, data);
    };
    
    deleteHandler = (day) => {
        const {events} = this.state;
    
        delete events[getEventKey(day)];
    
        localStorage.setItem("events", JSON.stringify(events));
        this.setState({events});
    };

    render() {
        const { currentTime, selectedDate } = this.props.state;
        const monthStart = dateFns.startOfMonth(currentTime);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);

        let rows = [];
        let days = [];

        let day = startDate;
        let formattedDate = "";

        let dateFormat = "dddd, D";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {

                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                const isSelected = dateFns.isSameDay(day, selectedDate);
                const hasEvent = this.state.events ? !!this.state.events[getEventKey(day)] : false;

                days.push(
                    <Cell
                        key={day}
                        day={day}
                        formattedDate={formattedDate}
                        isSelected={isSelected}
                        onClick={() => {
                            this.props.onDateClick(cloneDay);
                        }}
                        hasEvent={hasEvent}
                        event={hasEvent ? this.state.events[getEventKey(day)] : null}
                        dayNumber={i}
                        active={getDayKey(day) === this.props.state.activeCellKey}
                        submitHandler={this.submitHandler}
                        deleteHandler={this.deleteHandler}
                        handleFormClose={this.props.handleFormClose}
                    />
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="calendar-body-row" key={day}>{days}</div>
            );
            days = [];
            dateFormat = "D";
        }
        return <>
                {this.props.showQuickAddForm && <QuickAddEventForm handleQuickFormClose={() => this.props.handleQuickAdd(false)} submitHandler={this.submitHandler}/>}
    
                <div className="container calendar-body">{rows}</div>;
               </>
    }
}

export default Cells;