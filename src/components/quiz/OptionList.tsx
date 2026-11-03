import type { Question } from '../../types';

interface OptionListProps {
  question: Question;
  selected: string[];
  submitted: boolean;
  onToggle: (optionId: string) => void;
}

export function OptionList({ question, selected, submitted, onToggle }: OptionListProps) {
  const multiple = question.type === 'multiple-choice';
  return (
    <fieldset className="options" disabled={submitted}>
      <legend className="sr-only">
        {multiple ? 'Выберите все верные варианты' : 'Выберите один вариант'}
      </legend>
      {multiple ? (
        <p className="options__hint">
          <span className="options__hint-icon">2+</span>
          Можно выбрать несколько вариантов
        </p>
      ) : null}
      {question.options?.map((option, index) => {
        const isSelected = selected.includes(option.id);
        const isCorrect = submitted && question.correctAnswers.includes(option.id);
        const isWrong = submitted && isSelected && !question.correctAnswers.includes(option.id);
        return (
          <label
            key={option.id}
            className={[
              'option',
              isSelected ? 'option--selected' : '',
              isCorrect ? 'option--correct' : '',
              isWrong ? 'option--wrong' : '',
              submitted ? 'option--locked' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <input
              className="sr-only"
              type={multiple ? 'checkbox' : 'radio'}
              name={`question-${question.id}`}
              value={option.id}
              checked={isSelected}
              onChange={() => onToggle(option.id)}
              disabled={submitted}
            />
            <span className="option__marker">{String.fromCharCode(65 + index)}</span>
            <span className="option__text">{option.text}</span>
            <span className="option__state" aria-hidden="true">
              {isCorrect ? <span className="option__state-icon">✓</span> : null}
              {isWrong ? <span className="option__state-icon">×</span> : null}
              {!submitted ? <span className="option__radio" /> : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
