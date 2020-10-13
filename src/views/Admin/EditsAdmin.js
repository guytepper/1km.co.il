import { useEffect } from 'react';
import { fetchPendingEdits, fetchProtest, fetchUser, setEditAsViewed } from '../../api';
import React, { useState } from 'react';
import { formatDate } from '../../utils';

function getFieldName(fieldKey) {
  switch (fieldKey) {
    case 'displayName':
      return 'שם המקום';
    case 'streetAddress':
      return 'כתובת';
    case 'coords':
      return 'קואורדינטות';
    case 'whatsAppLink':
      return 'לינק לוואצאפ';
    case 'telegramLink':
      return 'לינק לטלגרם';
    case 'notes':
      return 'הערות';
    case 'dateTimeList':
      return 'תאריך ושעה';
    default:
      return '';
  }
}

function EditField({ diff, keyName, type }) {
  const value = (diff[keyName] || {})[type];

  switch (keyName) {
    case 'dateTimeList':
      return value.map((dt) => (
        <div key={`${dt.date}-${dt.time}`}>
          {formatDate(dt.date)} - {dt.time}
        </div>
      ));
    default:
      return <div>{value}</div>;
  }
}

function EditRow({ created_at, diff = {}, userId, protestId, id }) {
  const [expanded, setExpanded] = useState(false);
  const [protest, setProtest] = useState(null);
  const [user, setUser] = useState(null);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (expanded) {
      fetchProtest(protestId).then((p) => {
        if (p) {
          setProtest(p);
        }
      });

      fetchUser(userId).then((u) => {
        if (u) {
          setUser(u);
        }
      });
    }
  }, [expanded, protestId, userId]);

  if (viewed) {
    return null;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>{formatDate(created_at.toDate())}</div>
        <div>
          {Object.keys(diff).map((key) => (
            <div style={{ padding: '16px', display: 'flex' }} key={key}>
              <div style={{ marginBottom: '8px' }}>
                <b>{getFieldName(key)}</b>
              </div>
              <div style={{ paddingRight: '10px' }}>
                <span style={{ textDecoration: 'line-through' }}>
                  <EditField keyName={key} diff={diff} type="oldValue" />
                </span>
                <span>
                  <EditField keyName={key} diff={diff} type="newValue" />
                </span>
              </div>
            </div>
          ))}
        </div>
        <div onClick={() => setExpanded(true)}>פרטים נוספים</div>
        <button
          onClick={() => {
            setEditAsViewed(id);
            setViewed(true);
          }}
        >
          ראיתי
        </button>
      </div>

      {expanded && protest && user && (
        <div>
          {JSON.stringify(protest)} + {JSON.stringify(user)}
        </div>
      )}
    </>
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
    edits,
  };
}
export default function EditsAdmin() {
  const { edits } = useFetchEdits();
  if (!edits) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {edits.map((edit) => (
        <EditRow {...edit} key={edit.uid} />
      ))}
    </div>
  );
}
