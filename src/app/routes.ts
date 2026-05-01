import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SplashScreen,
  },
  {
    path: '/home',
    Component: HomeScreen,
  },
  {
    path: '/scanner',
    Component: ScannerScreen,
  },
  {
    path: '/result/:id',
    Component: ResultScreen,
  },
  {
    path: '/history',
    Component: HistoryScreen,
  },
  {
    path: '/profile',
    Component: ProfileScreen,
  },
]);
