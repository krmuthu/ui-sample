import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('supports keyboard navigation', () => {
    renderAccordion();
    
    const button1 = screen.getByText('Section 1');
    const content1 = screen.getByText('Content 1');
    
    // Enter key
    fireEvent.keyDown(button1, { key: 'Enter' });
    expect(content1.parentElement).toHaveClass('max-h-96');
    
    // Space key
    fireEvent.keyDown(button1, { key: ' ' });
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

  it('handles disabled items correctly', () => {
    render(
      <Accordion>
        <Accordion.Item id="1" header="Section 1" disabled>
          Content 1
        </Accordion.Item>
      </Accordion>
    );
    
    const button = screen.getByText('Section 1');
    const content = screen.getByText('Content 1');
    
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveClass('cursor-not-allowed');
    
    // Click should not expand the item
    fireEvent.click(button);
    expect(content.parentElement).toHaveClass('max-h-0');
    
    // Keyboard interaction should not expand the item
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(content.parentElement).toHaveClass('max-h-0');
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

  it('throws error when AccordionItem is rendered outside Accordion', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(
        <Accordion.Item id="1" header="Section 1">
          Content
        </Accordion.Item>
      );
    }).toThrow('AccordionItem must be used within an Accordion');
    
    consoleError.mockRestore();
  });
}); 