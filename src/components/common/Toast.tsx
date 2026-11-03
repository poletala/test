import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
import { Icon } from './Icon';

export const Toast = observer(function Toast() {
  const { ui } = useStores();
  if (!ui.toast) return null;
  return (
    <div className={`toast toast--${ui.toast.tone}`} role="status" aria-live="polite">
      <Icon name={ui.toast.tone === 'success' ? 'check' : ui.toast.tone === 'warning' ? 'alert' : 'sparkles'} size={18} />
      <span>{ui.toast.message}</span>
      <button type="button" aria-label="Закрыть уведомление" onClick={ui.clearToast}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
});
