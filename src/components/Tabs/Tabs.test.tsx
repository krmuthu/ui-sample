import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs } from './Tabs';
import { vi, describe, it, expect } from 'vitest';

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
    
    const content1 = screen.getByText('Content 1');
    expect(content1).toBeInTheDocument();
    
    // Check that hidden panels are not visible by checking for hidden attribute
    const panel2 = screen.queryByText('Content 2')?.closest('[role="tabpanel"]');
    const panel3 = screen.queryByText('Content 3')?.closest('[role="tabpanel"]');
    
    expect(panel2).not.toBeNull();
    expect(panel3).not.toBeNull();
    
    if (panel2) expect(panel2).toHaveAttribute('hidden');
    if (panel3) expect(panel3).toHaveAttribute('hidden');
  });

  it('changes active tab on click', () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Click the second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // Check that content 2 is visible and others are hidden
    const content2 = screen.getByText('Content 2');
    expect(content2).toBeInTheDocument();
    
    const panel1 = screen.queryByText('Content 1')?.closest('[role="tabpanel"]');
    const panel3 = screen.queryByText('Content 3')?.closest('[role="tabpanel"]');
    
    expect(panel1).not.toBeNull();
    expect(panel3).not.toBeNull();
    
    if (panel1) expect(panel1).toHaveAttribute('hidden');
    if (panel3) expect(panel3).toHaveAttribute('hidden');
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
    
    const content1 = screen.getByText('Content 1');
    expect(content1).toBeInTheDocument();
    
    const panel2 = screen.queryByText('Content 2')?.closest('[role="tabpanel"]');
    expect(panel2).not.toBeNull();
    if (panel2) expect(panel2).toHaveAttribute('hidden');
    
    // Keyboard navigation should skip disabled tab
    const tablist = screen.getByRole('tablist');
    const firstTab = screen.getByText('Tab 1');
    firstTab.focus();
    
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveTextContent('Tab 3');
  });

  it('supports controlled mode', () => {
    const handleChange = vi.fn();
    
    render(
      <Tabs
        tabs={mockTabs}
        activeTab="2"
        onChange={handleChange}
      />
    );
    
    // Initially shows the controlled tab
    const content2 = screen.getByText('Content 2');
    expect(content2).toBeInTheDocument();
    
    const panel1 = screen.queryByText('Content 1')?.closest('[role="tabpanel"]');
    const panel3 = screen.queryByText('Content 3')?.closest('[role="tabpanel"]');
    
    expect(panel1).not.toBeNull();
    expect(panel3).not.toBeNull();
    
    if (panel1) expect(panel1).toHaveAttribute('hidden');
    if (panel3) expect(panel3).toHaveAttribute('hidden');
    
    // Click triggers onChange but doesn't change tab
    fireEvent.click(screen.getByText('Tab 3'));
    expect(handleChange).toHaveBeenCalledWith('3');
    
    // Content remains unchanged because it's controlled
    expect(content2).toBeInTheDocument();
    if (panel1) expect(panel1).toHaveAttribute('hidden');
    if (panel3) expect(panel3).toHaveAttribute('hidden');
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
    const tab1 = screen.getByText('Tab 1').closest('[role="tab"]');
    expect(tab1).toHaveClass('rounded-full');
    
    rerender(<Tabs tabs={mockTabs} variant="solid-rounded" />);
    const activeTab = screen.getByText('Tab 1').closest('[role="tab"]');
    expect(activeTab).toHaveClass('rounded-full');
    // Check part of the active tab styling
    expect(activeTab).toHaveClass('bg-blue-500', 'text-white');
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Tabs tabs={mockTabs} size="sm" />);
    
    const tab1 = screen.getByText('Tab 1').closest('[role="tab"]');
    expect(tab1).toHaveClass('px-3', 'py-1.5', 'text-sm');
    
    rerender(<Tabs tabs={mockTabs} size="lg" />);
    const tab1Large = screen.getByText('Tab 1').closest('[role="tab"]');
    expect(tab1Large).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('stretches tabs when isFitted is true', () => {
    render(<Tabs tabs={mockTabs} isFitted />);
    
    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveClass('flex-1');
    });
  });
}); 