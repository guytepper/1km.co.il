import React, { useState } from 'react';
import styled from 'styled-components/macro';

function Checkbox({ children, onChange, disabled, style }) {
  const [checked, setChecked] = useState(false);

  const onCheck = (isChecked) => {
    const checkedUpdated = !checked;
    setChecked(checkedUpdated);
    if (onChange) {
      onChange(checkedUpdated);
    }
  };

  return (
    <CheckboxWrapper style={style}>
      <CheckboxInput type="checkbox" onChange={onCheck} value={checked} disabled={disabled} />
      <span>{children}</span>
    </CheckboxWrapper>
  );
}

export default Checkbox;

const CheckboxWrapper = styled.label`
  display: grid;
  grid-template-columns: 20px 1fr;
  column-gap: 5px;
  align-items: center;
  margin: 7.5px 0;
  font-size: 15px;
  font-weight: 100;
`;

const CheckboxInput = styled.input`
  width: 20px;
  height: 20px;
`;
