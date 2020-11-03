// eslint-disable-next-line
import React from 'react';
// eslint-disable-next-line
import Helmet from 'react-helmet';
import { mdx } from 'mdx.macro';

const Content = mdx`
<Helmet>
  <title>תרומה לפרוייקט</title>
</Helmet>

## תרומה לפרוייקט 

<div style={{ textAlign: 'center' }}>
"קילומטר אחד" הינו פרוייקט ללא מטרות רווח.  
כל צוות הפרוייקט עובד בהתנדבות מתוך אמונה במטרה.     


נהיה אסירי תודה לכל תרומה שתעזור לנו לכסות את עלויות תחזוקת האתר.


<p>ניתן להעביר <a href="https://paypal.me/guytepper" target="_blank" rel="noreferrer noopener">תשלום בפייפאל</a> לחשבון של גיא טפר (מוביל הפרוייקט) או דרך הביט באמצעות <a href="https://docs.google.com/forms/d/e/1FAIpQLSfVKiEvHZQlrHbmXt2jfVdAbetCtwAU7gN6mSDcw9Z5eEidug/viewform"  target="_blank" rel="noreferrer noopener">מילוי הטופס הבא</a>.</p>
  סכום התרומות שנאסף ועלויות הפעלת האתר יהיו שקופים ויפורסמו בהמשך.
במידה וכסף יישאר, נפנה לתורמים ונשאל לאן ירצו שכספם יגיע. 

תודה רבה!  
צוות קילומטר אחד
</div>

`;

export default Content;
