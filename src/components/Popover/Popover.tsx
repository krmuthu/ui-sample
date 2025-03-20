import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  /**
   * The trigger element that opens the popover
   */
  trigger: React.ReactNode;
  
  /**
   * The content to display in the popover
   */
  children: React.ReactNode;
  
  /**
   * The placement of the popover relative to the trigger
   * @default 'bottom'
   */
  placement?: PopoverPlacement;
  
  /**
   * Whether the popover is open
   */
  isOpen?: boolean;
  
  /**
   * Callback when the popover opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
  
  /**
   * Whether to show an arrow pointing to the trigger
   * @default true
   */
  arrow?: boolean;
  
  /**
   * Whether to close the popover when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Custom class name for the popover
   */
  className?: string;
  
  /**
   * The title of the popover
   */
  title?: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  isOpen: controlledIsOpen,
  onOpenChange,
  arrow = true,
  closeOnOutsideClick = true,
  className = '',
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const open = controlledIsOpen ?? isOpen;

  useEffect(() => {
    if (!closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
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

  const togglePopover = () => {
    const newIsOpen = !open;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const getPopoverPosition = () => {
    if (!triggerRef.current) return {};

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    switch (placement) {
      case 'top':
        return {
          bottom: `${window.innerHeight - rect.top + scrollY + 8}px`,
          left: `${rect.left + scrollX}px`,
        };
      case 'bottom':
        return {
          top: `${rect.bottom + scrollY + 8}px`,
          left: `${rect.left + scrollX}px`,
        };
      case 'left':
        return {
          top: `${rect.top + scrollY}px`,
          right: `${window.innerWidth - rect.left + scrollX + 8}px`,
        };
      case 'right':
        return {
          top: `${rect.top + scrollY}px`,
          left: `${rect.right + scrollX + 8}px`,
        };
    }
  };

  const getArrowPosition = () => {
    switch (placement) {
      case 'top':
        return 'bottom-[-8px] left-1/2 -translate-x-1/2 border-t-gray-200 border-x-transparent border-b-transparent';
      case 'bottom':
        return 'top-[-8px] left-1/2 -translate-x-1/2 border-b-gray-200 border-x-transparent border-t-transparent';
      case 'left':
        return 'right-[-8px] top-1/2 -translate-y-1/2 border-l-gray-200 border-y-transparent border-r-transparent';
      case 'right':
        return 'left-[-8px] top-1/2 -translate-y-1/2 border-r-gray-200 border-y-transparent border-l-transparent';
    }
  };

  return (
    <>
      <div ref={triggerRef} onClick={togglePopover} className="inline-block">
        {trigger}
      </div>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            className={`
              absolute z-50 min-w-[200px] max-w-sm
              bg-white rounded-lg shadow-lg
              border border-gray-200
              ${className}
            `}
            style={getPopoverPosition()}
          >
            {title && (
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-medium">{title}</h3>
              </div>
            )}
            <div className="p-4">{children}</div>
            {arrow && (
              <div
                className={`
                  absolute w-0 h-0
                  border-[8px] border-solid
                  ${getArrowPosition()}
                `}
                style={{
                  borderColor: 'transparent',
                  ...(placement === 'top' && { borderTopColor: '#e5e7eb' }),
                  ...(placement === 'bottom' && { borderBottomColor: '#e5e7eb' }),
                  ...(placement === 'left' && { borderLeftColor: '#e5e7eb' }),
                  ...(placement === 'right' && { borderRightColor: '#e5e7eb' }),
                }}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
}; 