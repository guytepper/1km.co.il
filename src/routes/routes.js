import { Admin, SignUp, ProtestMap, ProtestPage, AddProtest, PostView, LiveEvent, FourOhFour, Weekly } from '../views';
import { UploadForm } from '../components';

const routes = [
  {
    path: ['/', '/weekly'],
    component: Weekly,
    key: 'WEEKLY',
    exact: true,
  },
  {
    path: '/map',
    component: ProtestMap,
    key: 'PROTEST_MAP',
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
  },
  {
    path: '/upload-image',
    component: UploadForm,
  },
  { path: ['/about', '/donate', '/project-updates/:slug', '/legal-notice'], component: PostView },
];

export default routes;
