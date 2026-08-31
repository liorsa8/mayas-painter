import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import React from 'react';

describe("Maya's Painter App", () => {
  it('renders the header title in Hebrew', () => {
    render(<App />);
    expect(screen.getByText('הצייר של מאיה')).toBeInTheDocument();
  });

  it('shows templates modal when clicking the button', () => {
    render(<App />);
    const templatesBtn = screen.getByText('תבניות');
    fireEvent.click(templatesBtn);
    expect(screen.getByText('בחרו ציור לצביעה!')).toBeInTheDocument();
  });

  it('changes brush size when clicked', () => {
    render(<App />);
    const bigBrushBtn = screen.getByTitle('מברשת גדול');
    fireEvent.click(bigBrushBtn);
    expect(bigBrushBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
