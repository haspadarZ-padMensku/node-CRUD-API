import transform from './transform';

describe('transform', () => {
  it('should return string + !', () => {
    expect(transform('test')).toBe('test!');
  });
});
