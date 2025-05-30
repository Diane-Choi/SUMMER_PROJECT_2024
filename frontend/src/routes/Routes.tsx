import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import App from '../App';
import MyCloset from '../pages/MyCloset';
import OutfitGenerator from '../pages/OutfitGenerator';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import Profile from '../pages/Profile';
import Favorites from '../pages/Favorites';
import RecentlyViewed from '../pages/RecentlyViewed';

export const Routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        element: <AuthOutlet fallbackPath="/login" />,
        children: [
          {
            path: '/outfit-generator',
            element: <OutfitGenerator />,
          },
          {
            path: '/my-closet',
            element: <MyCloset />,
          },
          {
            path: '/profile',
            element: <Profile />,
          },
          {
            path: '/favorites',
            element: <Favorites />,
          },
          {
            path: '/recently-viewed',
            element: <RecentlyViewed />,
          },
        ],
      },
    ],
  },
]);
