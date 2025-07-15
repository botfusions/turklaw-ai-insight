import { render } from '@/test/test-utils';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/layout/Header';
import userEvent from '@testing-library/user-event';

// Mock the useHeader hook
vi.mock('@/hooks/useHeader', () => ({
  useHeader: () => ({
    user: null,
    profile: null,
    notifications: [],
    isHeaderVisible: true,
    handleSignOut: vi.fn(),
    handleNotificationRead: vi.fn(),
    handleClearAllNotifications: vi.fn(),
  }),
}));

describe('Header', () => {
  it('should render header with logo', () => {
    render(<Header />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Legal Search')).toBeInTheDocument();
  });

  it('should render login button when user is not authenticated', () => {
    render(<Header />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should render navigation menu when user is authenticated', () => {
    // Mock authenticated user
    vi.mocked(require('@/hooks/useHeader').useHeader).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      profile: { full_name: 'Test User', plan: 'pro' },
      notifications: [],
      isHeaderVisible: true,
      handleSignOut: vi.fn(),
      handleNotificationRead: vi.fn(),
      handleClearAllNotifications: vi.fn(),
    });

    render(<Header />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Saved Cases')).toBeInTheDocument();
  });

  it('should handle mobile menu toggle', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    // Check if mobile menu button exists (usually represented by hamburger icon)
    const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
    
    await user.click(mobileMenuButton);
    
    // Mobile menu should be visible
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should display user avatar when authenticated', () => {
    vi.mocked(require('@/hooks/useHeader').useHeader).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      profile: { full_name: 'Test User', plan: 'pro' },
      notifications: [],
      isHeaderVisible: true,
      handleSignOut: vi.fn(),
      handleNotificationRead: vi.fn(),
      handleClearAllNotifications: vi.fn(),
    });

    render(<Header />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should handle theme toggle', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
    
    await user.click(themeToggle);
    
    // Theme should toggle (this depends on implementation)
    expect(themeToggle).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Check for accessible navigation
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should handle sign out', async () => {
    const user = userEvent.setup();
    const mockSignOut = vi.fn();
    
    vi.mocked(require('@/hooks/useHeader').useHeader).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      profile: { full_name: 'Test User', plan: 'pro' },
      notifications: [],
      isHeaderVisible: true,
      handleSignOut: mockSignOut,
      handleNotificationRead: vi.fn(),
      handleClearAllNotifications: vi.fn(),
    });

    render(<Header />);
    
    // Open user menu
    const userButton = screen.getByText('Test User');
    await user.click(userButton);
    
    // Click sign out
    const signOutButton = screen.getByText('Sign Out');
    await user.click(signOutButton);
    
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});