import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { useProcessStore } from '@/store/useProcessStore';
import { useUserStore } from '@/store/useUserStore';

function AppInitializer() {
  const initProcessData = useProcessStore((state) => state.initMockData);
  const initUserData = useUserStore((state) => state.initMockData);

  useEffect(() => {
    initProcessData();
    initUserData();
  }, [initProcessData, initUserData]);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppInitializer />
    </BrowserRouter>
  </StrictMode>,
);
