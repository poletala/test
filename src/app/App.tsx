import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { CategoryPage } from '../pages/CategoryPage';
import { PracticePage } from '../pages/PracticePage';
import { QuizPage } from '../pages/QuizPage';
import { ResultsPage } from '../pages/ResultsPage';
import { ReadinessPage } from '../pages/ReadinessPage';
import { BookmarksPage } from '../pages/BookmarksPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="results/:sessionId" element={<ResultsPage />} />
        <Route path="readiness" element={<ReadinessPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
