import { Admin, SignUp, ProtestMap, ProtestPage, AddProtest, PostView, LiveEvent, Weekly } from '../views';
import { UploadForm } from '../components';

const routes = [
  {
    path: ['/', '/map'],
    component: ProtestMap,
    key: 'PROTEST_MAP',
    exact: true,
  },
  {
    path: ['/weekly'],
    component: Weekly,
    key: 'WEEKLY',
  },
  {
    path: '/admin',
    component: Admin,
    key: 'PROTEST_MAP',
  },
  {
    path: ['/protest/:id', '/protest/:id/gallery'],
    component: ProtestPage,
    key: 'PROTEST_PAGE',
  },
  {
    path: '/add-protest',
    component: AddProtest,
    key: 'ADD_PROTEST',
  },
  {
    path: '/sign-up',
    component: SignUp,
    key: 'SIGN_UP',
  },
  {
    path: ['/live', '/live/qr'],
    component: LiveEvent,
    key: 'LIVE_EVENT',
  },
  {
    path: '/upload-image',
    component: UploadForm,
    key: 'UPLOAD_FORM',
  },
  { path: ['/about', '/donate', '/project-updates/:slug', '/legal-notice'], component: PostView, key: 'POST_VIEW' },
];

export default routes;
