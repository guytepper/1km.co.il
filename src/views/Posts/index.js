import React from 'react';
import FourOhFour from './four-oh-four.js';
import LegalNotice from './legal-notice.js';
import One from './ProjectUpdates/one';
export const posts = [
  {
    slug: '404',
    title: '404',
    text: <FourOhFour />,
  },
  {
    slug: 'legal-notice',
    title: 'הבהרה משפטית',
    text: <LegalNotice />,
  },
  {
    slug: '1',
    title: 'עדכון #1 - קילומטר אחד',
    text: <One />,
  },
];

export default posts;
