import { makeAutoObservable } from 'mobx';
import { THEME_STORAGE_KEY } from '../utils/storage';

export type Theme = 'dark' | 'light';
export type ToastTone = 'success' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

function getInitialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage может быть недоступен.
  }
  return 'dark';
}

export class UiStore {
  theme: Theme = getInitialTheme();
  toast: Toast | null = null;
  private toastCounter = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.applyTheme();
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, this.theme);
    } catch {
      // no-op
    }
    this.applyTheme();
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
    this.applyTheme();
  }

  notify(message: string, tone: ToastTone = 'info'): void {
    this.toastCounter += 1;
    this.toast = { id: this.toastCounter, message, tone };
    window.setTimeout(() => {
      if (this.toast?.id === this.toastCounter) this.toast = null;
    }, 3600);
  }

  clearToast(): void {
    this.toast = null;
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = this.theme;
    document.documentElement.style.colorScheme = this.theme;
  }
}
