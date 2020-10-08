import React from 'react';
import styled from 'styled-components';

export default function DateTimeListElement(props) {
  const {dateTimeElement, dateTimeList, setDateTimeList} = props;

  const onDateChanged = (e, dateTimeElementId) => {
    const newList = dateTimeList.map((item) => {
      if (item.id === dateTimeElementId) {
        const updatedItem = {
          ...item,
          date: e.target.value,
        };
 
        return updatedItem;
      }
 
      return item;
    });
 
    setDateTimeList(newList);
  }

  const onTimeChanged = (e, dateTimeElementId) => {
    const newList = dateTimeList.map((item) => {
      if (item.id === dateTimeElementId) {
        const updatedItem = {
          ...item,
          time: e.target.value,
        };
 
        return updatedItem;
      }
 
      return item;
    });
 
    setDateTimeList(newList);
  };

  const removeDateTime = (e, dateTimeElementId) => {
    e.preventDefault();
    const newList = dateTimeList.filter(item=> item.id !== dateTimeElementId);
    setDateTimeList(newList);
  };

  return (
    <div key={dateTimeElement.id}>
                שעת מפגש
      <ProtestFormInput type="time" defaultValue={dateTimeElement.time} name="meeting_time" onChange={(event)=>onTimeChanged(event, dateTimeElement.id)} ></ProtestFormInput>
      meeting date
      <ProtestFormInput type="date" defaultValue={dateTimeElement.date?dateTimeElement.date : ''} name="meeting_date" onChange={(event)=>onDateChanged(event, dateTimeElement.id)} ></ProtestFormInput>
      {dateTimeList.length>1 && <button id="removeDateTimeButton" onClick={(event)=>removeDateTime(event, dateTimeElement.id)}>
          Remove DateTime {dateTimeElement.id}
        </button>}
    </div>
  );
}


const ProtestFormInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;

