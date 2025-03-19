import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';

const mockTabs = [
  { id: '1', label: 'Tab 1', children: <div>Content 1</div> },
  { id: '2', label: 'Tab 2', children: <div>Content 2</div> },
  { id: '3', label: 'Tab 3', children: <div>Content 3</div> },
];

const mockTabsWithDisabled = [
  { id: '1', label: 'Tab 1', children: <div>Content 1</div> },
  { id: '2', label: 'Tab 2', children: <div>Content 2</div>, disabled: true },
  { id: '3', label: 'Tab 3', children: <div>Content 3</div> },
];

describe('Tabs', () => {
  it('renders all tab buttons', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('shows the first tab content by default', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.queryByText('Content 2')).not.toBeVisible();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
  });

  it('changes active tab on click', () => {
    render(<Tabs tabs={mockTabs} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
  });

  it('supports keyboard navigation', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const tablist = screen.getByRole('tablist');
    const firstTab = screen.getByText('Tab 1');
    
    // Focus first tab
    firstTab.focus();
    
    // Press right arrow to move to next tab
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveTextContent('Tab 2');
    
    // Press right arrow again to move to last tab
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveTextContent('Tab 3');
    
    // Press right arrow on last tab to cycle to first
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveTextContent('Tab 1');
    
    // Press left arrow to cycle to last tab
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(document.activeElement).toHaveTextContent('Tab 3');
    
    // Press Home to go to first tab
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(document.activeElement).toHaveTextContent('Tab 1');
    
    // Press End to go to last tab
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(document.activeElement).toHaveTextContent('Tab 3');
  });

  it('handles disabled tabs correctly', () => {
    render(<Tabs tabs={mockTabsWithDisabled} />);
    
    const disabledTab = screen.getByText('Tab 2');
    
    expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    expect(disabledTab).toHaveClass('cursor-not-allowed');
    
    // Click should not change tab
    fireEvent.click(disabledTab);
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.queryByText('Content 2')).not.toBeVisible();
    
    // Keyboard navigation should skip disabled tab
    const tablist = screen.getByRole('tablist');
    const firstTab = screen.getByText('Tab 1');
    firstTab.focus();
    
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveTextContent('Tab 3');
  });

  it('supports controlled mode', () => {
    const handleChange = jest.fn();
    
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="2"
        onChange={handleChange}
      />
    );
    
    // Initially shows the controlled tab
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
    
    // Click triggers onChange but doesn't change tab
    fireEvent.click(screen.getByText('Tab 3'));
    expect(handleChange).toHaveBeenCalledWith('3');
    
    // Content remains unchanged because it's controlled
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeVisible();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
  });

  it('supports lazy loading of tab content', () => {
    const { rerender } = render(<Tabs tabs={mockTabs} lazy />);
    
    // Only first tab content should be rendered initially
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
    
    // Switch to second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // Now first and second tab content should be rendered
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
    
    // Disable lazy loading
    rerender(<Tabs tabs={mockTabs} lazy={false} />);
    
    // All content should be rendered
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Tabs tabs={mockTabs} variant="enclosed" />);
    
    expect(screen.getByRole('tablist')).toHaveClass('bg-gray-50', 'rounded-t-lg');
    
    rerender(<Tabs tabs={mockTabs} variant="soft-rounded" />);
    expect(screen.getByRole('button', { name: 'Tab 1' })).toHaveClass('rounded-full');
    
    rerender(<Tabs tabs={mockTabs} variant="solid-rounded" />);
    const activeTab = screen.getByRole('button', { name: 'Tab 1' });
    expect(activeTab).toHaveClass('rounded-full', 'bg-blue-500', 'text-white');
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Tabs tabs={mockTabs} size="sm" />);
    
    expect(screen.getByRole('button', { name: 'Tab 1' })).toHaveClass('px-3', 'py-1.5', 'text-sm');
    
    rerender(<Tabs tabs={mockTabs} size="lg" />);
    expect(screen.getByRole('button', { name: 'Tab 1' })).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('stretches tabs when isFitted is true', () => {
    render(<Tabs tabs={mockTabs} isFitted />);
    
    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveClass('flex-1');
    });
  });
}); 