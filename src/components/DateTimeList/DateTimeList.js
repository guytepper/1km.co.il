import React from 'react';
import styled from 'styled-components';
import DateTimeListElement from '../DateTimeListElement';

export default function DateTimeList(props) {
  const {dateTimeList, setDateTimeList} = props;
  
  const addDateTime = (e) => {
  	e.preventDefault();
    setDateTimeList([...dateTimeList, {id: Math.max(...dateTimeList.map(item => item.id)) + 1, time:"17:30"}]);
  };

  return (
    <>
	    <span>
	    	{dateTimeList.map(dateTimeElement => (
	    		<DateTimeListElement key={dateTimeElement.id} dateTimeElement={dateTimeElement} dateTimeList={dateTimeList} setDateTimeList={setDateTimeList} /> 
	    		)
	    	)}
	    </span>
	    <button id="addDateTimeButton" onClick={(e)=>addDateTime(e)}>
          Add DateTime for another meeting
        </button>
    </>
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


