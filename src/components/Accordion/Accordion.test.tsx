import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  const renderAccordion = (props = {}) => {
    return render(
      <Accordion {...props}>
        <Accordion.Item id="1" header="Section 1">
          Content 1
        </Accordion.Item>
        <Accordion.Item id="2" header="Section 2">
          Content 2
        </Accordion.Item>
      </Accordion>
    );
  };

  it('renders all accordion items', () => {
    renderAccordion();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('expands and collapses items on click', () => {
    renderAccordion();
    
    const button1 = screen.getByText('Section 1');
    const content1 = screen.getByText('Content 1');
    
    // Initially content should be hidden
    expect(content1.parentElement).toHaveClass('max-h-0');
    
    // Click to expand
    fireEvent.click(button1);
    expect(content1.parentElement).toHaveClass('max-h-96');
    
    // Click to collapse
    fireEvent.click(button1);
    expect(content1.parentElement).toHaveClass('max-h-0');
  });

  it('allows multiple items to be expanded when allowMultiple is true', () => {
    renderAccordion({ allowMultiple: true });
    
    const button1 = screen.getByText('Section 1');
    const button2 = screen.getByText('Section 2');
    const content1 = screen.getByText('Content 1');
    const content2 = screen.getByText('Content 2');
    
    // Expand first item
    fireEvent.click(button1);
    expect(content1.parentElement).toHaveClass('max-h-96');
    expect(content2.parentElement).toHaveClass('max-h-0');
    
    // Expand second item
    fireEvent.click(button2);
    expect(content1.parentElement).toHaveClass('max-h-96');
    expect(content2.parentElement).toHaveClass('max-h-96');
  });
  
  it('collapses other items when allowMultiple is false', () => {
    renderAccordion({ allowMultiple: false });
    
    const button1 = screen.getByText('Section 1');
    const button2 = screen.getByText('Section 2');
    const content1 = screen.getByText('Content 1');
    const content2 = screen.getByText('Content 2');
    
    // Expand first item
    fireEvent.click(button1);
    expect(content1.parentElement).toHaveClass('max-h-96');
    expect(content2.parentElement).toHaveClass('max-h-0');
    
    // Expand second item
    fireEvent.click(button2);
    expect(content1.parentElement).toHaveClass('max-h-0');
    expect(content2.parentElement).toHaveClass('max-h-96');
  });

  it('respects defaultOpenItems prop', () => {
    renderAccordion({ defaultOpenItems: ['1'] });
    
    const content1 = screen.getByText('Content 1');
    const content2 = screen.getByText('Content 2');
    
    expect(content1.parentElement).toHaveClass('max-h-96');
    expect(content2.parentElement).toHaveClass('max-h-0');
  });
  
  it('applies custom className to components', () => {
    render(
      <Accordion className="custom-accordion">
        <Accordion.Item id="1" header="Section 1" className="custom-item">
          Content 1
        </Accordion.Item>
      </Accordion>
    );
    
    expect(screen.getByRole('button').parentElement).toHaveClass('custom-item');
    expect(screen.getByRole('button').parentElement?.parentElement).toHaveClass('custom-accordion');
  });
}); 