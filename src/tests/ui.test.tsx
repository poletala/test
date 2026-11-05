import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from '../hooks/useStores';
import { RootStore } from '../stores/RootStore';
import { createDefaultConfig } from '../stores/QuizStore';
import { QuizPage } from '../pages/QuizPage';
import { OptionList } from '../components/quiz/OptionList';
import {
  multipleChoiceQuestion,
  questionsFixture,
  singleChoiceQuestion,
} from './fixtures';

function OptionHarness({ multiple = false }: { multiple?: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <>
      <OptionList
        question={multiple ? multipleChoiceQuestion : singleChoiceQuestion}
        selected={selected}
        submitted={false}
        onToggle={(id) =>
          setSelected((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
          )
        }
      />
      <output data-testid="selected">{selected.join(',')}</output>
    </>
  );
}

describe('UI выбора ответа', () => {
  it('переключает один вариант в single-choice', async () => {
    const user = userEvent.setup();
    render(<OptionHarness />);

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    await user.click(screen.getByText('2'));

    expect(screen.getByTestId('selected')).toHaveTextContent('b');
    expect(screen.getByRole('radio', { name: /B 2/ })).toBeChecked();
  });

  it('позволяет выбрать несколько вариантов в multiple-choice', async () => {
    const user = userEvent.setup();
    render(<OptionHarness multiple />);

    await user.click(screen.getByText('unknown требует narrowing'));
    await user.click(screen.getByText('any отключает проверку'));

    expect(screen.getByTestId('selected')).toHaveTextContent('a,b');
    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
  });

  it('проходит сессию до экрана результатов', async () => {
    const user = userEvent.setup();
    const store = new RootStore(questionsFixture);
    store.quiz.startCustom(
      { ...createDefaultConfig('study'), count: 1 },
      [singleChoiceQuestion.id],
    );

    render(
      <StoreProvider store={store}>
        <MemoryRouter
          initialEntries={['/quiz']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/results/:sessionId" element={<div>Экран результатов</div>} />
          </Routes>
        </MemoryRouter>
      </StoreProvider>,
    );

    await user.click(screen.getByRole('radio', { name: /B 2/ }));
    await user.click(screen.getByRole('button', { name: /Ответить/ }));

    expect(
      await screen.findByRole('heading', { name: /Верно — разберём механизм/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Показать результаты/ }));
    expect(await screen.findByText('Экран результатов')).toBeInTheDocument();
    expect(store.progress.sessions).toHaveLength(1);
    expect(store.progress.sessions[0]?.correct).toBe(1);
  });

  it('не показывает правильный ответ до отправки', () => {
    render(
      <OptionList
        question={singleChoiceQuestion}
        selected={[]}
        submitted={false}
        onToggle={() => undefined}
      />,
    );

    expect(screen.queryByText('✓')).not.toBeInTheDocument();
    expect(screen.queryByText('×')).not.toBeInTheDocument();
  });
});
