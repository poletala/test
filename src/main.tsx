import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './app/App';
import { AppErrorBoundary } from './app/ErrorBoundary';
import { QUESTIONS } from './data';
import { RootStore } from './stores/RootStore';
import { StoreProvider } from './hooks/useStores';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Корневой элемент #root не найден');
}

const store = new RootStore(QUESTIONS);

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <StoreProvider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </StoreProvider>
    </AppErrorBoundary>
  </StrictMode>,
);
