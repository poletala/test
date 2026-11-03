import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
import { Toast } from '../common/Toast';
import { Icon, type IconName } from '../common/Icon';
import { ProgressBar } from '../common/ProgressBar';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Обзор', icon: 'dashboard', end: true },
  { to: '/practice', label: 'Практика', icon: 'practice' },
  { to: '/readiness', label: 'Готовность', icon: 'readiness' },
  { to: '/bookmarks', label: 'Закладки', icon: 'bookmark' },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export const AppLayout = observer(function AppLayout() {
  const { progress, questions } = useStores();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const answered = progress.answeredCount;
  const total = questions.length;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <ScrollToTop />

      <div className={`mobile-topbar ${menuOpen ? 'mobile-topbar--open' : ''}`}>
        <button
          type="button"
          className="icon-button"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
        <NavLink to="/" className="brand brand--mobile">
          <span className="brand__mark">{'{ }'}</span>
          <span>Interview Trainer</span>
        </NavLink>
        <ThemeToggle />
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Закрыть меню"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`} aria-label="Главная навигация">
        <NavLink to="/" className="brand">
          <span className="brand__mark">{'{ }'}</span>
          <span className="brand__text">
            <strong>Frontend</strong>
            <small>Interview Trainer</small>
          </span>
        </NavLink>

        <nav className="sidebar__nav">
          <span className="sidebar__caption">Навигация</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.to === '/bookmarks' && progress.bookmarks.length > 0 ? (
                <span className="nav-item__count">{progress.bookmarks.length}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__progress">
          <div className="sidebar__progress-head">
            <span>Прогресс банка</span>
            <strong>
              {answered}/{total}
            </strong>
          </div>
          <ProgressBar value={answered} max={Math.max(total, 1)} label="Пройдено вопросов" size="sm" />
          <p>Не спешите: важнее глубина, чем количество галочек.</p>
        </div>

        <div className="sidebar__footer">
          <ThemeToggle />
          <span className="sidebar__version">v1.0 · локальный прогресс</span>
        </div>
      </aside>

      <main id="main-content" className="main-content" tabIndex={-1}>
        <Outlet />
        <footer className="app-footer">
          <span>Frontend Interview Trainer</span>
          <span>Практика важнее заучивания · React + TypeScript + MobX</span>
        </footer>
      </main>
      <Toast />
    </div>
  );
});
