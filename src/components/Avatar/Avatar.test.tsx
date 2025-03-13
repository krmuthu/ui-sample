import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders correctly with an image', () => {
    render(<Avatar src="test-image.jpg" alt="Test avatar" />);
    const img = screen.getByAltText('Test avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-image.jpg');
  });

  it('renders initials when no image is provided', () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('generates initials from name when no initials are provided', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('takes first two letters from single name', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('handles empty name gracefully', () => {
    render(<Avatar name="" />);
    // Should render an empty span, not throw an error
    const avatarElement = screen.getByRole('generic');
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.textContent).toBe('');
  });

  it('falls back to initials if image fails to load', () => {
    const { container } = render(<Avatar src="invalid-image.jpg" name="John Doe" />);
    
    // Simulate image load error
    const img = container.querySelector('img');
    if (img) {
      // Trigger the onError handler
      img.dispatchEvent(new Event('error'));
    }
    
    // Check that initials are shown
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Avatar size="xs" />);
    expect(screen.getByRole('generic')).toHaveClass('w-6 h-6');
    
    rerender(<Avatar size="small" />);
    expect(screen.getByRole('generic')).toHaveClass('w-8 h-8');
    
    rerender(<Avatar size="medium" />);
    expect(screen.getByRole('generic')).toHaveClass('w-10 h-10');
    
    rerender(<Avatar size="large" />);
    expect(screen.getByRole('generic')).toHaveClass('w-12 h-12');
    
    rerender(<Avatar size="xl" />);
    expect(screen.getByRole('generic')).toHaveClass('w-16 h-16');
  });

  it('applies different shapes correctly', () => {
    const { rerender } = render(<Avatar shape="circle" />);
    expect(screen.getByRole('generic')).toHaveClass('rounded-full');
    
    rerender(<Avatar shape="rounded" />);
    expect(screen.getByRole('generic')).toHaveClass('rounded-md');
    
    rerender(<Avatar shape="square" />);
    expect(screen.getByRole('generic')).toHaveClass('rounded-none');
  });

  it('applies different colors correctly', () => {
    const { rerender } = render(<Avatar color="primary" />);
    expect(screen.getByRole('generic')).toHaveClass('bg-primary-100');
    
    rerender(<Avatar color="secondary" />);
    expect(screen.getByRole('generic')).toHaveClass('bg-secondary-100');
    
    rerender(<Avatar color="success" />);
    expect(screen.getByRole('generic')).toHaveClass('bg-success-100');
    
    rerender(<Avatar color="error" />);
    expect(screen.getByRole('generic')).toHaveClass('bg-error-100');
    
    rerender(<Avatar color="warning" />);
    expect(screen.getByRole('generic')).toHaveClass('bg-warning-100');
    
    rerender(<Avatar color="neutral" />);
    expect(screen.getByRole('generic')).toHaveClass('bg-neutral-100');
  });

  it('shows status indicators correctly', () => {
    const { rerender } = render(<Avatar status="online" />);
    expect(screen.getByLabelText('Status: online')).toHaveClass('bg-success-500');
    
    rerender(<Avatar status="offline" />);
    expect(screen.getByLabelText('Status: offline')).toHaveClass('bg-neutral-300');
    
    rerender(<Avatar status="away" />);
    expect(screen.getByLabelText('Status: away')).toHaveClass('bg-warning-500');
    
    rerender(<Avatar status="busy" />);
    expect(screen.getByLabelText('Status: busy')).toHaveClass('bg-error-500');
    
    rerender(<Avatar status="none" />);
    expect(screen.queryByLabelText(/Status:/)).not.toBeInTheDocument();
  });

  it('adds a border when bordered prop is true', () => {
    render(<Avatar bordered />);
    expect(screen.getByRole('generic')).toHaveClass('border-2');
  });

  it('accepts custom className', () => {
    render(<Avatar className="custom-class" />);
    expect(screen.getByRole('generic')).toHaveClass('custom-class');
  });

  it('spreads additional props to the root element', () => {
    render(<Avatar data-testid="avatar-test" />);
    expect(screen.getByTestId('avatar-test')).toBeInTheDocument();
  });
}); 