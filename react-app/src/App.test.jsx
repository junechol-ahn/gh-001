import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the Vite logo', () => {
    render(<App />);
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument();
  });
});