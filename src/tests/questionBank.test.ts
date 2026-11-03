import { QUESTIONS } from '../data';
import { validateQuestionBank } from '../data/validate';

describe('question bank', () => {
  it('matches the catalogue contract', () => {
    expect(validateQuestionBank(QUESTIONS)).toEqual([]);
  });
});
