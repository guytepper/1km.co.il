import React from 'react';
import FourOhFour from './four-oh-four.js';
import LegalNotice from './legal-notice.js';

export const posts = [
  {
    permalink: '404',
    title: '404',
    text: <FourOhFour />,
  },
  {
    permalink: 'legal-notice',
    title: 'הבהרה משפטית',
    text: <LegalNotice />,
  },
];

export default posts;
