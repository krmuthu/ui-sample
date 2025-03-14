import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import ButtonGroup from './ButtonGroup';
import Button from '../Button/Button';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Wrap components in ThemeProvider for testing
const renderWithTheme = (ui: React.ReactElement, { theme = 'light' } = {}) => {
  return render(
    <ThemeProvider defaultTheme={theme as 'light' | 'dark'}>
      {ui}
    </ThemeProvider>
  );
};

describe('ButtonGroup', () => {
  it('renders correctly with default props', () => {
    renderWithTheme(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
    
    // Check that role="group" is set
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('applies horizontal orientation by default', () => {
    const { container } = renderWithTheme(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const groupElement = container.firstChild as HTMLElement;
    expect(groupElement).toHaveClass('flex-row');
    expect(groupElement).not.toHaveClass('flex-col');
  });

  it('applies vertical orientation when specified', () => {
    const { container } = renderWithTheme(
      <ButtonGroup orientation="vertical">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const groupElement = container.firstChild as HTMLElement;
    expect(groupElement).toHaveClass('flex-col');
    expect(groupElement).not.toHaveClass('flex-row');
  });

  it('applies correct spacing based on spacing prop', () => {
    const { container: defaultContainer } = renderWithTheme(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: compactContainer } = renderWithTheme(
      <ButtonGroup spacing="compact">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: looseContainer } = renderWithTheme(
      <ButtonGroup spacing="loose">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    expect(defaultContainer.firstChild).toHaveClass('gap-2');
    expect(compactContainer.firstChild).toHaveClass('gap-1');
    expect(looseContainer.firstChild).toHaveClass('gap-4');
  });

  it('applies connected style correctly', () => {
    const { container } = renderWithTheme(
      <ButtonGroup connected>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </ButtonGroup>
    );
    
    const groupElement = container.firstChild as HTMLElement;
    expect(groupElement).toHaveClass('overflow-hidden');
    
    // First button should have rounded-r-none
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('rounded-r-none');
    
    // Middle button should have rounded-none
    expect(buttons[1]).toHaveClass('rounded-none');
    
    // Last button should have rounded-l-none
    expect(buttons[2]).toHaveClass('rounded-l-none');
    
    // Second and third buttons should have negative margin
    expect(buttons[1]).toHaveClass('-ml-px');
    expect(buttons[2]).toHaveClass('-ml-px');
  });

  it('applies alignment correctly when fullWidth is true', () => {
    const { container: leftContainer } = renderWithTheme(
      <ButtonGroup fullWidth align="left">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: centerContainer } = renderWithTheme(
      <ButtonGroup fullWidth align="center">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: rightContainer } = renderWithTheme(
      <ButtonGroup fullWidth align="right">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    expect(leftContainer.firstChild).toHaveClass('w-full justify-start');
    expect(centerContainer.firstChild).toHaveClass('w-full justify-center');
    expect(rightContainer.firstChild).toHaveClass('w-full justify-end');
  });

  it('passes variant and size props to child buttons', () => {
    renderWithTheme(
      <ButtonGroup variant="secondary" size="small">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const buttons = screen.getAllByRole('button');
    
    // Both buttons should have the appropriate variant CSS variable classes
    expect(buttons[0]).toHaveClass('bg-[var(--btn-secondary-bg)]');
    expect(buttons[1]).toHaveClass('bg-[var(--btn-secondary-bg)]');
    
    // Both buttons should have the small size class
    expect(buttons[0]).toHaveClass('text-xs');
    expect(buttons[1]).toHaveClass('text-xs');
  });

  it('respects custom className prop', () => {
    const { container } = renderWithTheme(
      <ButtonGroup className="custom-class">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders correctly in dark mode', () => {
    renderWithTheme(
      <ButtonGroup variant="primary">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>,
      { theme: 'dark' }
    );
    
    const buttons = screen.getAllByRole('button');
    
    // Both buttons should have the appropriate variant CSS variable classes
    // The values of the CSS variables will be different in dark mode
    // but the class names remain the same
    expect(buttons[0]).toHaveClass('bg-[var(--btn-primary-bg)]');
    expect(buttons[1]).toHaveClass('bg-[var(--btn-primary-bg)]');
  });
}); 