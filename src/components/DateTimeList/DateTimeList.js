import React from 'react';
import styled from 'styled-components/macro';
import DateTimeListElement from '../DateTimeListElement';

export default function DateTimeList(props) {
  const { dateTimeList, setDateTimeList } = props;

  const addDateTime = (e) => {
    e.preventDefault();
    setDateTimeList([
      ...dateTimeList,
      { id: Math.max(...dateTimeList.map((item) => item.id)) + 1, date: '2020-10-24', time: '17:30' },
    ]);
  };

  return (
    <>
      <span>
        {dateTimeList.map((dateTimeElement) => (
          <DateTimeListElement
            key={dateTimeElement.id}
            dateTimeElement={dateTimeElement}
            dateTimeList={dateTimeList}
            setDateTimeList={setDateTimeList}
          />
        ))}
      </span>
      <AddMore onClick={(e) => addDateTime(e)}>+ הוספת תאריך עתידי</AddMore>
    </>
  );
}

const AddMore = styled.div`
  color: #2980b9;
  font-size: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: pointer;
`;
