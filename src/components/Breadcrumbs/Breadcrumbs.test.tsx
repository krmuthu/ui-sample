import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  const defaultItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', isActive: true },
  ];

  it('renders breadcrumb items correctly', () => {
    render(<Breadcrumbs items={defaultItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders home icon for the first item by default', () => {
    render(<Breadcrumbs items={defaultItems} />);
    
    const homeIcon = screen.getByRole('img', { hidden: true });
    expect(homeIcon).toBeInTheDocument();
  });

  it('does not render home icon when showHomeIcon is false', () => {
    render(<Breadcrumbs items={defaultItems} showHomeIcon={false} />);
    
    const homeIcon = screen.queryByRole('img', { hidden: true });
    expect(homeIcon).not.toBeInTheDocument();
  });

  it('renders custom separator', () => {
    render(<Breadcrumbs items={defaultItems} separator=">" />);
    
    const separators = screen.getAllByText('>');
    expect(separators).toHaveLength(2);
  });

  it('applies custom class names', () => {
    render(
      <Breadcrumbs
        items={defaultItems}
        className="custom-container"
        itemClassName="custom-item"
        separatorClassName="custom-separator"
      />
    );
    
    expect(screen.getByRole('navigation')).toHaveClass('custom-container');
    expect(screen.getByText('Home')).toHaveClass('custom-item');
    expect(screen.getAllByText('/')[0]).toHaveClass('custom-separator');
  });

  it('renders active item without link', () => {
    render(<Breadcrumbs items={defaultItems} />);
    
    const activeItem = screen.getByText('Electronics');
    expect(activeItem.tagName).toBe('SPAN');
    expect(activeItem).toHaveAttribute('aria-current', 'page');
  });

  it('renders non-active items as links', () => {
    render(<Breadcrumbs items={defaultItems} />);
    
    const homeLink = screen.getByText('Home');
    const productsLink = screen.getByText('Products');
    
    expect(homeLink.tagName).toBe('A');
    expect(productsLink.tagName).toBe('A');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('returns null when items array is empty', () => {
    const { container } = render(<Breadcrumbs items={[]} />);
    expect(container.firstChild).toBeNull();
  });
}); 