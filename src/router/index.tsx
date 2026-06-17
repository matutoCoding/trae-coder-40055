import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Turning from '@/pages/Turning';
import HeatTreatment from '@/pages/HeatTreatment';
import Grinding from '@/pages/Grinding';
import Roller from '@/pages/Roller';
import Cage from '@/pages/Cage';
import Assembly from '@/pages/Assembly';
import Vibration from '@/pages/Vibration';
import Trace from '@/pages/Trace';
import Users from '@/pages/System/Users';
import Roles from '@/pages/System/Roles';
import NotFound from '@/pages/NotFound';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'turning',
        element: <Turning />,
      },
      {
        path: 'heat-treatment',
        element: <HeatTreatment />,
      },
      {
        path: 'grinding',
        element: <Grinding />,
      },
      {
        path: 'roller',
        element: <Roller />,
      },
      {
        path: 'cage',
        element: <Cage />,
      },
      {
        path: 'assembly',
        element: <Assembly />,
      },
      {
        path: 'vibration',
        element: <Vibration />,
      },
      {
        path: 'trace',
        element: <Trace />,
      },
      {
        path: 'system/users',
        element: <Users />,
      },
      {
        path: 'system/roles',
        element: <Roles />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
