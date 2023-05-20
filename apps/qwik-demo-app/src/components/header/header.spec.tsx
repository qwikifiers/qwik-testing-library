import { render, screen } from 'qwik-testing-library';
import Header from './header';

describe(`header`, () => {
  test('should find the docs link', async () => {
    await render(<Header />);
    expect(screen.getByText('Docs')).toBeTruthy();
  });
});
