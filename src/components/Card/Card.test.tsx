import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title and subtitle when provided', () => {
    render(
      <Card title="Card Title" subtitle="Card Subtitle">
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Card footer={<button>Action</button>}>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('displays a loading spinner when isLoading is true', () => {
    render(
      <Card isLoading>
        <p>Card content</p>
      </Card>
    );
    
    // The loading spinner should be visible
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // The children should not be rendered when loading
    expect(screen.queryByText('Card content')).not.toBeInTheDocument();
  });

  it('applies hoverable class when hoverable prop is true', () => {
    render(
      <Card hoverable>
        <p>Card content</p>
      </Card>
    );
    
    // Find the card container by its class instead of data-testid
    const card = document.querySelector('.hover\\:shadow-md');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('transition-shadow');
  });

  it('does not apply border when bordered prop is false', () => {
    render(
      <Card bordered={false}>
        <p>Card content</p>
      </Card>
    );
    
    // Find the card container
    const card = screen.getByText('Card content').closest('.bg-white');
    expect(card).not.toHaveClass('border', 'border-gray-200');
  });

  it('does not apply padding when padded prop is false', () => {
    render(
      <Card padded={false}>
        <p>Card content</p>
      </Card>
    );
    
    const body = screen.getByText('Card content').closest('div');
    expect(body).not.toHaveClass('px-6', 'py-4');
  });

  it('applies custom className to card container', () => {
    render(
      <Card className="custom-class">
        <p>Card content</p>
      </Card>
    );
    
    // Find the card container
    const card = screen.getByText('Card content').closest('.bg-white');
    expect(card).toHaveClass('custom-class');
  });

  it('applies custom headerClassName when title is present', () => {
    render(
      <Card 
        title="Card Title" 
        headerClassName="custom-header-class"
      >
        <p>Card content</p>
      </Card>
    );
    
    const header = screen.getByText('Card Title').closest('div');
    expect(header).toHaveClass('custom-header-class');
  });

  it('applies custom bodyClassName to body container', () => {
    render(
      <Card bodyClassName="custom-body-class">
        <p>Card content</p>
      </Card>
    );
    
    const body = screen.getByText('Card content').closest('div');
    expect(body).toHaveClass('custom-body-class');
  });

  it('applies custom footerClassName when footer is present', () => {
    render(
      <Card 
        footer={<button>Action</button>}
        footerClassName="custom-footer-class"
      >
        <p>Card content</p>
      </Card>
    );
    
    const footer = screen.getByRole('button', { name: 'Action' }).closest('div');
    expect(footer).toHaveClass('custom-footer-class');
  });

  it('renders a card with all default props', () => {
    render(
      <Card>
        <p>Default card</p>
      </Card>
    );
    
    // Find the card container
    const card = screen.getByText('Default card').closest('.bg-white');
    const body = screen.getByText('Default card').closest('div');
    
    // Default classes should be applied
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm');
    expect(card).toHaveClass('border', 'border-gray-200');
    expect(body).toHaveClass('px-6', 'py-4');
  });

  it('does not render header when title and subtitle are not provided', () => {
    render(
      <Card>
        <p>No header card</p>
      </Card>
    );
    
    // Find the card container
    const card = screen.getByText('No header card').closest('.bg-white');
    expect(card?.childNodes.length).toBe(1); // Only body should be rendered
  });

  it('renders complex card with all features', () => {
    render(
      <Card 
        title="Complex Card" 
        subtitle="With all features"
        footer={<div>Footer content</div>}
        hoverable
      >
        <p>Complex card content</p>
      </Card>
    );
    
    expect(screen.getByText('Complex Card')).toBeInTheDocument();
    expect(screen.getByText('With all features')).toBeInTheDocument();
    expect(screen.getByText('Complex card content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
    
    // Find the card container
    const card = screen.getByText('Complex Card').closest('.bg-white');
    expect(card).toHaveClass('hover:shadow-md');
  });
}); 