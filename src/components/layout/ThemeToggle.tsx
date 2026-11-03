import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
import { Icon } from '../common/Icon';

export const ThemeToggle = observer(function ThemeToggle() {
  const { ui } = useStores();
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={ui.toggleTheme}
      aria-label={ui.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={ui.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
    >
      <Icon name={ui.theme === 'dark' ? 'sun' : 'moon'} size={18} />
      <span>{ui.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
    </button>
  );
});
