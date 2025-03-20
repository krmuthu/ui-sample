import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type MenuPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface MenuProps {
  /**
   * The trigger element that opens the menu
   */
  trigger: React.ReactNode;
  
  /**
   * The content of the menu
   */
  children: React.ReactNode;
  
  /**
   * The placement of the menu relative to the trigger
   * @default 'bottom'
   */
  placement?: MenuPlacement;
  
  /**
   * Whether the menu is open
   */
  isOpen?: boolean;
  
  /**
   * Callback when the menu opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
  
  /**
   * Whether to close the menu when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Custom class name for the menu
   */
  className?: string;
}

export interface MenuItemProps {
  /**
   * The content of the menu item
   */
  children: React.ReactNode;
  
  /**
   * Callback when the menu item is clicked
   */
  onClick?: () => void;
  
  /**
   * Whether the menu item is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the menu item is currently selected
   */
  selected?: boolean;
  
  /**
   * Icon to display before the menu item text
   */
  icon?: React.ReactNode;
  
  /**
   * Custom class name for the menu item
   */
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  disabled = false,
  selected = false,
  icon,
  className = '',
}) => {
  const baseClasses = 'flex items-center px-4 py-2 text-sm cursor-pointer transition-colors';
  const stateClasses = disabled
    ? 'opacity-50 cursor-not-allowed bg-gray-50'
    : selected
    ? 'bg-blue-50 text-blue-700'
    : 'hover:bg-gray-100';

  return (
    <div
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${stateClasses} ${className}`}
      tabIndex={disabled ? -1 : 0}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </div>
  );
};

export const Menu: React.FC<MenuProps> = ({
  trigger,
  children,
  placement = 'bottom',
  isOpen: controlledIsOpen,
  onOpenChange,
  closeOnOutsideClick = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const open = controlledIsOpen ?? isOpen;

  useEffect(() => {
    if (!closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, closeOnOutsideClick, onOpenChange]);

  const toggleMenu = () => {
    const newIsOpen = !open;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const getMenuPosition = () => {
    if (!triggerRef.current) return {};

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    switch (placement) {
      case 'top':
        return {
          bottom: `${window.innerHeight - rect.top + scrollY}px`,
          left: `${rect.left + scrollX}px`,
        };
      case 'bottom':
        return {
          top: `${rect.bottom + scrollY}px`,
          left: `${rect.left + scrollX}px`,
        };
      case 'left':
        return {
          top: `${rect.top + scrollY}px`,
          right: `${window.innerWidth - rect.left + scrollX}px`,
        };
      case 'right':
        return {
          top: `${rect.top + scrollY}px`,
          left: `${rect.right + scrollX}px`,
        };
    }
  };

  return (
    <>
      <div ref={triggerRef} onClick={toggleMenu}>
        {trigger}
      </div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className={`
              absolute z-50 min-w-[200px]
              bg-white rounded-md shadow-lg
              border border-gray-200
              py-1
              ${className}
            `}
            style={getMenuPosition()}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}; 