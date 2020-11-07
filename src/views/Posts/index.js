import React from 'react';
import FourOhFour from './four-oh-four.js';
import LegalNotice from './legal-notice.js';
import ProjectSupport from './project-support';
import DonatePage from './donate-page';
import One from './ProjectUpdates/one';

export const posts = [
  {
    slug: '404',
    title: 'הדף לא נמצא - קילומטר  אחד',
    text: <FourOhFour />,
  },
  {
    slug: 'legal-notice',
    title: 'הבהרה משפטית - קילומטר אחד',
    permalink: '/legal-notice',
    text: <LegalNotice />,
  },
  {
    slug: 'about',
    title: 'על הפרוייקט - קילומטר אחד',
    permalink: '/about',
    text: <ProjectSupport />,
  },
  {
    slug: 'donate',
    title: 'תרומה לפרוייקט - קילומטר אחד',
    permalink: '/donate',
    text: <DonatePage />,
  },
  {
    slug: '1',
    title: 'עדכון #1 - קילומטר אחד',
    text: <One />,
  },
];

export default posts;
