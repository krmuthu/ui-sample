import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders card with title', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders card with subtitle', () => {
    render(
      <Card
        title="Test Card"
        subtitle="Test Subtitle"
      >
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders card with footer', () => {
    render(
      <Card
        title="Test Card"
        footer={<button>Action</button>}
      >
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(
      <Card title="Test Card" isLoading={true}>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Card content')).not.toBeInTheDocument();
  });

  it('renders without border when bordered is false', () => {
    render(
      <Card title="Test Card" bordered={false}>
        <p>Card content</p>
      </Card>
    );

    const card = screen.getByRole('article');
    expect(card).not.toHaveClass('border');
  });

  it('renders without padding when padded is false', () => {
    render(
      <Card title="Test Card" padded={false}>
        <p>Card content</p>
      </Card>
    );

    const body = screen.getByText('Card content').parentElement;
    expect(body).not.toHaveClass('px-6', 'py-4');
  });

  it('renders with hover effect when hoverable is true', () => {
    render(
      <Card title="Test Card" hoverable={true}>
        <p>Card content</p>
      </Card>
    );

    const card = screen.getByRole('article');
    expect(card).toHaveClass('transition-shadow', 'duration-200', 'hover:shadow-md');
  });

  it('renders with custom className', () => {
    render(
      <Card title="Test Card" className="custom-class">
        <p>Card content</p>
      </Card>
    );

    const card = screen.getByRole('article');
    expect(card).toHaveClass('custom-class');
  });

  it('renders with custom header className', () => {
    render(
      <Card
        title="Test Card"
        headerClassName="custom-header"
      >
        <p>Card content</p>
      </Card>
    );

    const header = screen.getByText('Test Card').parentElement;
    expect(header).toHaveClass('custom-header');
  });

  it('renders with custom body className', () => {
    render(
      <Card
        title="Test Card"
        bodyClassName="custom-body"
      >
        <p>Card content</p>
      </Card>
    );

    const body = screen.getByText('Card content').parentElement;
    expect(body).toHaveClass('custom-body');
  });

  it('renders with custom footer className', () => {
    render(
      <Card
        title="Test Card"
        footer={<button>Action</button>}
        footerClassName="custom-footer"
      >
        <p>Card content</p>
      </Card>
    );

    const footer = screen.getByText('Action').parentElement;
    expect(footer).toHaveClass('custom-footer');
  });

  it('renders without header when no title or subtitle', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders without footer when no footer content', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });
}); 