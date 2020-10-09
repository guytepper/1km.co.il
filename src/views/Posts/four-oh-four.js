import React from 'react';
import { mdx } from 'mdx.macro';
import { Link } from 'react-router-dom';

const Content = mdx`
# אופס...
 עמוד זה לא קיים  
<Link to="/">בחזרה לעמוד הראשי</Link>
`;

export default Content;
