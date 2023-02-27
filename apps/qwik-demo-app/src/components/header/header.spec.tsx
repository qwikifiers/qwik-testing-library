import { render } from 'qwik-testing-library';
import Header from './header';

describe(`header`, () => {
  

  test('should find the docs link', async () => {
    const { getByText } = await render(<Header />);
    expect(getByText('Docs')).toBeTruthy();
  
  });
});