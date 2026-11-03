import type { Question } from '../../types';

export function CodeCompletionInput({
  question,
  value,
  disabled,
  onChange,
  onSubmit,
}: {
  question: Question;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const completion = question.completion;
  if (!completion) return null;
  return (
    <div className="completion">
      <label className="completion__label" htmlFor={`completion-${question.id}`}>
        Введите ответ
      </label>
      <div className="completion__field">
        <span className="completion__prompt" aria-hidden="true">
          &gt;_
        </span>
        <input
          id={`completion-${question.id}`}
          className="completion__input"
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !disabled && value.trim()) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder={completion.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-describedby={completion.inputHint ? `completion-hint-${question.id}` : undefined}
        />
      </div>
      {completion.inputHint ? (
        <p className="completion__hint" id={`completion-hint-${question.id}`}>
          {completion.inputHint}
        </p>
      ) : null}
      <p className="completion__note">
        Проверяется точное выражение после нормализации пробелов и регистра. Код не выполняется.
      </p>
    </div>
  );
}
