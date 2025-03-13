import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonGroup from './ButtonGroup';
import Button from '../Button/Button';

describe('ButtonGroup', () => {
  it('renders correctly with default props', () => {
    render(
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
    const { container } = render(
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
    const { container } = render(
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
    const { container: defaultContainer } = render(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: compactContainer } = render(
      <ButtonGroup spacing="compact">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: looseContainer } = render(
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
    const { container } = render(
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
    const { container: leftContainer } = render(
      <ButtonGroup fullWidth align="left">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: centerContainer } = render(
      <ButtonGroup fullWidth align="center">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const { container: rightContainer } = render(
      <ButtonGroup fullWidth align="right">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    expect(leftContainer.firstChild).toHaveClass('w-full justify-start');
    expect(centerContainer.firstChild).toHaveClass('w-full justify-center');
    expect(rightContainer.firstChild).toHaveClass('w-full justify-end');
  });

  it('passes variant, color, and size props to child buttons', () => {
    render(
      <ButtonGroup variant="outlined" color="secondary" size="small">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    const buttons = screen.getAllByRole('button');
    
    // Create a button with the expected props and extract its classes
    const { container } = render(
      <Button variant="outlined" color="secondary" size="small">Test</Button>
    );
    const expectedClasses = container.firstChild?.className.split(' ') || [];
    
    // Check that the buttons in the group have the same styling classes
    expectedClasses.forEach(className => {
      if (className.trim()) {
        expect(buttons[0]).toHaveClass(className);
        expect(buttons[1]).toHaveClass(className);
      }
    });
  });

  it('respects custom className prop', () => {
    const { container } = render(
      <ButtonGroup className="custom-class">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 