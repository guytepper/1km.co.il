import React from 'react';
import FourOhFour from './four-oh-four.js';
import LegalNotice from './legal-notice.js';
import ProjectSupport from './project-support';
import One from './ProjectUpdates/one';

console.dir(One);

export const posts = [
  {
    slug: '404',
    title: '404',
    text: <FourOhFour />,
  },
  {
    slug: 'legal-notice',
    title: 'הבהרה משפטית',
    permalink: '/legal-notice',
    text: <LegalNotice />,
  },
  {
    slug: 'support-the-project',
    title: 'תמכו בפרוייקט - קילומטר אחד',
    permalink: '/support-the-project',
    text: <ProjectSupport />,
  },
  {
    slug: '1',
    title: 'עדכון #1 - קילומטר אחד',
    text: <One />,
  },
];

export default posts;
