import type { Question } from '../../types';
import { getCorrectOptionTexts, isAnswerCorrect } from '../../utils/answerValidation';
import { Button } from '../common/Button';
import { CodeBlock } from '../common/CodeBlock';
import { Icon } from '../common/Icon';

interface ExplanationPanelProps {
  question: Question;
  selectedAnswers: string[];
  textAnswer: string;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onNext?: () => void;
  isLast?: boolean;
}

export function ExplanationPanel({
  question,
  selectedAnswers,
  textAnswer,
  bookmarked,
  onToggleBookmark,
  onNext,
  isLast = false,
}: ExplanationPanelProps) {
  const correct = isAnswerCorrect(question, selectedAnswers, textAnswer);
  const correctTexts = getCorrectOptionTexts(question);
  const selectedOptions = (question.options ?? []).filter((option) =>
    selectedAnswers.includes(option.id),
  );
  const selectedWrong = selectedOptions.filter(
    (option) => !question.correctAnswers.includes(option.id),
  );
  const correctOptions = (question.options ?? []).filter((option) =>
    question.correctAnswers.includes(option.id),
  );

  return (
    <section
      className={`explanation ${correct ? 'explanation--correct' : 'explanation--incorrect'}`}
      aria-live="polite"
    >
      <div className="explanation__result">
        <span className="explanation__result-icon">
          <Icon name={correct ? 'check' : 'close'} size={24} />
        </span>
        <div>
          <h2>{correct ? 'Верно — разберём механизм' : 'Неверно — это важнее, чем кажется'}</h2>
          <p>
            {correct
              ? 'Правильный ответ поможет закрепить модель. Прочитайте разбор, даже если ответ очевиден.'
              : 'Ниже — правильный ответ и пошаговый разбор. Именно такие ошибки лучше всего запоминаются.'}
          </p>
        </div>
      </div>

      <div className="answer-compare">
        <div className="answer-compare__block answer-compare__block--correct">
          <span>Правильный ответ</span>
          <strong>{correctTexts.join(' · ')}</strong>
        </div>
        {!correct ? (
          <div className="answer-compare__block answer-compare__block--wrong">
            <span>Ваш ответ</span>
            <strong>
              {question.completion
                ? textAnswer.trim() || 'Ответ не введён'
                : selectedOptions.length > 0
                  ? selectedOptions.map((option) => option.text).join(' · ')
                  : 'Ответ не выбран'}
            </strong>
          </div>
        ) : null}
      </div>

      {!correct && selectedWrong.length > 0 ? (
        <div className="explanation__section explanation__section--why-wrong">
          <h3>Почему выбранный вариант неверен</h3>
          <ul className="reason-list">
            {selectedWrong.map((option) => (
              <li key={option.id}>
                <span className="reason-list__label">{option.text}</span>
                <p>{option.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!correct && question.completion ? (
        <div className="explanation__section explanation__section--why-wrong">
          <h3>Где ошибка в вводе</h3>
          <p>
            Проверьте имя метода, аргументы и возвращаемое значение. Ответ сравнивается с
            эталонным выражением; пробелы и регистр нормализуются, но смысл выражения должен совпасть.
          </p>
        </div>
      ) : null}

      {correct && correctOptions.length > 0 ? (
        <div className="explanation__section explanation__section--why-right">
          <h3>Почему ваш ответ верен</h3>
          <ul className="reason-list">
            {correctOptions.map((option) => (
              <li key={option.id}>
                <span className="reason-list__label">{option.text}</span>
                <p>{option.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="explanation__section">
        <h3>Разбор</h3>
        <div className="explanation__prose">
          {question.explanation.split('\n').map((paragraph, index) =>
            paragraph.trim() ? <p key={index}>{paragraph}</p> : null,
          )}
        </div>
      </div>

      {question.codeExample ? (
        <div className="explanation__section">
          <h3>Практический пример</h3>
          <CodeBlock
            code={question.codeExample}
            language={question.codeExampleLanguage ?? question.codeLanguage ?? 'javascript'}
            title="Пример"
            compact
          />
        </div>
      ) : null}

      <div className="explanation__grid">
        <div className="explanation__section explanation__section--mistakes">
          <h3>
            <Icon name="alert" size={17} /> Частые заблуждения
          </h3>
          <ul className="mistake-list">
            {question.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </div>
        <div className="explanation__section explanation__section--tip">
          <h3>
            <Icon name="lightbulb" size={17} /> Как ответить на собеседовании
          </h3>
          <p>{question.interviewTip}</p>
        </div>
      </div>

      <div className="explanation__section explanation__section--options">
        <h3>Разбор всех вариантов</h3>
        <ul className="option-review">
          {question.options?.map((option, index) => {
            const optionCorrect = question.correctAnswers.includes(option.id);
            const optionSelected = selectedAnswers.includes(option.id);
            return (
              <li key={option.id} className={optionCorrect ? 'option-review__item--correct' : ''}>
                <span className="option-review__marker">{String.fromCharCode(65 + index)}</span>
                <div>
                  <strong>
                    {option.text}
                    {optionCorrect ? <em>правильный</em> : null}
                    {!optionCorrect && optionSelected ? <em className="option-review__your">ваш выбор</em> : null}
                  </strong>
                  <p>{option.explanation}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="explanation__summary">
        <Icon name="book" size={18} />
        <div>
          <strong>Запомнить</strong>
          <p>{question.summary}</p>
        </div>
      </div>

      <div className="explanation__actions">
        <Button
          variant={bookmarked ? 'success' : 'secondary'}
          icon="bookmark"
          onClick={onToggleBookmark}
        >
          {bookmarked ? 'В закладках' : 'Сохранить для повторения'}
        </Button>
        {onNext ? (
          <Button icon="arrow-right" iconPosition="right" onClick={onNext}>
            {isLast ? 'Показать результаты' : 'Следующий вопрос'}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
