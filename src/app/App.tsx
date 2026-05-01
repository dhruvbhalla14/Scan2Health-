import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MobileContainer } from './components/MobileContainer';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <MobileContainer>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </MobileContainer>
  );
}