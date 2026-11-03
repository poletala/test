import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { CATEGORIES, CATEGORY_BY_ID } from '../data/categories';
import type { CategoryId, Difficulty } from '../types';
import { createDefaultConfig } from '../stores/QuizStore';
import { PageHeader } from '../components/layout/PageHeader';
import { Button, ButtonLink } from '../components/common/Button';
import { DifficultyBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Icon } from '../components/common/Icon';

export const BookmarksPage = observer(function BookmarksPage() {
  const { questions, progress, quiz, ui } = useStores();
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');

  const bookmarked = useMemo(() => {
    const map = new Map(questions.map((question) => [question.id, question]));
    return progress.bookmarks
      .map((id) => map.get(id))
      .filter((question) => question !== undefined)
      .filter(
        (question) =>
          (categoryFilter === 'all' || question.category === categoryFilter) &&
          (difficultyFilter === 'all' || question.difficulty === difficultyFilter),
      );
  }, [questions, progress.bookmarks, categoryFilter, difficultyFilter]);

  const start = () => {
    if (progress.activeQuiz) {
      ui.notify('Сначала завершите текущую сессию.', 'warning');
      return;
    }
    const config = {
      ...createDefaultConfig('bookmarks'),
      categoryId: categoryFilter,
      difficulties:
        difficultyFilter === 'all'
          ? (['junior', 'junior-plus', 'middle'] as Difficulty[])
          : [difficultyFilter],
      count: bookmarked.length,
    };
    if (quiz.start(config)) navigate('/quiz');
    else ui.notify('В закладках нет вопросов под выбранные фильтры.', 'info');
  };

  return (
    <div className="page bookmarks-page">
      <PageHeader
        eyebrow="Повторение"
        title="Закладки"
        description="Вопросы, которые вы отметили для повторения. Это ваш личный список тем, к которым стоит вернуться."
        action={
          progress.bookmarks.length > 0 ? (
            <Button icon="play" onClick={start}>
              Тренировать закладки
            </Button>
          ) : null
        }
      />

      {progress.bookmarks.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="Закладок пока нет"
          description="Во время сессии нажмите «В закладки» на вопросе, который хотите пересмотреть. Он появится здесь и в отдельном режиме практики."
          action={<ButtonLink to="/practice" icon="play">Начать практику</ButtonLink>}
        />
      ) : (
        <>
          <div className="bookmarks-toolbar">
            <div className="bookmarks-toolbar__count">
              <Icon name="bookmark" size={18} />
              <strong>{progress.bookmarks.length}</strong>
              <span>сохранено</span>
            </div>
            <div className="bookmarks-toolbar__filters">
              <label className="field field--inline">
                <span className="sr-only">Фильтр по модулю</span>
                <select
                  className="select select--sm"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value as CategoryId | 'all')}
                >
                  <option value="all">Все модули</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field field--inline">
                <span className="sr-only">Фильтр по сложности</span>
                <select
                  className="select select--sm"
                  value={difficultyFilter}
                  onChange={(event) =>
                    setDifficultyFilter(event.target.value as Difficulty | 'all')
                  }
                >
                  <option value="all">Любая сложность</option>
                  <option value="junior">Junior</option>
                  <option value="junior-plus">Junior+</option>
                  <option value="middle">Middle</option>
                </select>
              </label>
            </div>
          </div>

          {bookmarked.length === 0 ? (
            <div className="inline-empty">
              <Icon name="alert" size={18} /> По выбранным фильтрам закладок нет.
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="bookmark-list">
              {bookmarked.map((question) => (
                <article className="bookmark-item" key={question.id}>
                  <div className="bookmark-item__top">
                    <span className="bookmark-item__category">
                      {CATEGORY_BY_ID[question.category].shortTitle}
                    </span>
                    <DifficultyBadge difficulty={question.difficulty} />
                    <span className="bookmark-item__topic">{question.topic}</span>
                    <button
                      type="button"
                      className="icon-button icon-button--danger"
                      aria-label="Удалить из закладок"
                      onClick={() => {
                        progress.toggleBookmark(question.id);
                        ui.notify('Вопрос убран из закладок.', 'info');
                      }}
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                  <h2>{question.question}</h2>
                  <div className="bookmark-item__tags">
                    {question.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                  <div className="bookmark-item__actions">
                    <ButtonLink to={`/category/${question.category}`} variant="ghost" size="sm" icon="arrow-right" iconPosition="right">
                      Модуль
                    </ButtonLink>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="refresh"
                      onClick={() => {
                        if (progress.activeQuiz) {
                          ui.notify('Сначала завершите текущую сессию.', 'warning');
                          return;
                        }
                        if (
                          quiz.startCustom(
                            { ...createDefaultConfig('study'), count: 1 },
                            [question.id],
                          )
                        ) {
                          navigate('/quiz');
                        }
                      }}
                    >
                      Повторить вопрос
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
});
