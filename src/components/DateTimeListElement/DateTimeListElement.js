import React from 'react';
import styled from 'styled-components/macro';
import { ProtestFormLabel, ProtestFormInput } from '../ProtestForm/ProtestForm';

export default function DateTimeListElement(props) {
  const { dateTimeElement, dateTimeList, setDateTimeList } = props;

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
  };

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
    const newList = dateTimeList.filter((item) => item.id !== dateTimeElementId);
    setDateTimeList(newList);
  };

  return (
    <Wrapper key={dateTimeElement.id}>
      <ProtestFormLabel>
        תאריך מפגש
        <ProtestFormInput
          type="date"
          defaultValue={dateTimeElement.date ? dateTimeElement.date : '2020-10-24'}
          name="meeting_date"
          onChange={(event) => onDateChanged(event, dateTimeElement.id)}
        ></ProtestFormInput>
      </ProtestFormLabel>
      <ProtestFormLabel>
        שעת מפגש
        <ProtestFormInput
          type="time"
          defaultValue={dateTimeElement.time}
          name="meeting_time"
          onChange={(event) => onTimeChanged(event, dateTimeElement.id)}
        ></ProtestFormInput>
      </ProtestFormLabel>

      {dateTimeList.length > 1 && (
        <RemoveItem onClick={(event) => removeDateTime(event, dateTimeElement.id)} role="button" src="/icons/trash.svg" />
      )}
    </Wrapper>
  );
}

const RemoveItem = styled.img`
  position: absolute;
  cursor: pointer;
  top: -10px;
  left: -10px;
  display: none;
`;

const Wrapper = styled.div`
  position: relative;
  padding: 8px;
  margin-top: 8px;
  border: 1px solid transparent;

  &:hover {
    border-color: #d2d2d2;

    ${RemoveItem} {
      display: block;
    }
  }
`;
