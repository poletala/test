import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Необработанная ошибка приложения:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fatal-error">
          <div className="fatal-error__card">
            <span aria-hidden="true">{'{ ! }'}</span>
            <h1>Что-то пошло не так</h1>
            <p>
              Интерфейс столкнулся с неожиданной ошибкой. Прогресс в LocalStorage не
              пострадал — перезагрузите страницу и продолжите тренировку.
            </p>
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
