import { useEffect } from 'react';
import { fetchPendingEdits } from '../../api';
import React, { useState } from 'react';

function EditRow({ created_at, diff = {} }) {
  return (
    <div>
      <div>Created at</div>
      <div>
        {Object.keys(diff).map((key) => (
          <div>
            <div>{key}</div>
            <div>
              <span styles="text-decoration: line-through;">{JSON.stringify(diff[key].oldValue)}</span> <span>{JSON.stringify(diff[key].newValue)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function _fetchPendingEdits(setEdits) {
    const result = await fetchPendingEdits();
    setEdits(result);
  }

function useFetchEdits() {
    const [edits, setEdits] = useState(null);
  
    useEffect(() => {
      _fetchPendingEdits(setEdits);
    }, []);
  
    return {
     edits
    };
  }
export default function EditsAdmin() {
    const {edits} = useFetchEdits();
  if (!edits) {
    return <div>Loading...</div>;
  }

  console.log('edits', edits)

  return (
    <div>
      {edits.map((edit) => (
        <EditRow {...edit} />
      ))}
    </div>
  );
}
