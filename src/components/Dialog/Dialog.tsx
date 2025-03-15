import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface DialogProps {
  /**
   * Whether the dialog is open or not
   * @default false
   */
  open: boolean;
  
  /**
   * Function called when the dialog should close
   */
  onClose: () => void;
  
  /**
   * The title of the dialog, displayed at the top
   */
  title?: React.ReactNode;
  
  /**
   * The content of the dialog
   */
  children: React.ReactNode;
  
  /**
   * The size of the dialog
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether to show a close button in the header
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Whether clicking the backdrop should close the dialog
   * @default true
   */
  closeOnBackdropClick?: boolean;
  
  /**
   * Whether pressing the Escape key should close the dialog
   * @default true
   */
  closeOnEsc?: boolean;
  
  /**
   * Content to render in the footer area, typically actions like "Cancel" and "Confirm" buttons
   */
  footer?: React.ReactNode;
  
  /**
   * Additional CSS class name for the dialog
   */
  className?: string;
  
  /**
   * ID for the dialog for accessibility purposes
   */
  id?: string;
  
  /**
   * ID for the dialog title for accessibility purposes
   */
  titleId?: string;
  
  /**
   * ID for the dialog description for accessibility purposes
   */
  descriptionId?: string;
}

const Dialog: React.FC<DialogProps> = ({
  open = false,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  footer,
  className = '',
  id,
  titleId: propsTitleId,
  descriptionId: propsDescriptionId,
}) => {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLElement | null>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  const generatedId = useRef(`dialog-${Math.random().toString(36).substr(2, 9)}`);
  const dialogId = id || generatedId.current;
  const titleId = propsTitleId || `${dialogId}-title`;
  const descriptionId = propsDescriptionId || `${dialogId}-description`;
  
  // Track mount state for SSR compatibility
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Handle ESC key press
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, closeOnEsc]);
  
  // Lock body scroll and store previously focused element
  useEffect(() => {
    if (open) {
      // Save the active element to restore focus later
      previousActiveElement.current = document.activeElement;
      
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Focus the dialog or the first focusable element inside
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length > 0) {
            initialFocusRef.current = focusableElements[0] as HTMLElement;
            initialFocusRef.current.focus();
          } else {
            dialogRef.current.focus();
          }
        }
      });
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = originalOverflow;
        
        // Restore focus to the previously active element
        if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
          (previousActiveElement.current as HTMLElement).focus();
        }
      };
    }
  }, [open]);
  
  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
  };
  
  // Don't render anything on the server or when not mounted
  if (!mounted || !open) return null;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };
  
  const dialog = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-black bg-opacity-50 transition-opacity"
      onClick={handleBackdropClick}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={descriptionId}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        id={dialogId}
        className={`
          relative rounded-lg bg-white dark:bg-gray-800 shadow-xl 
          transform transition-all w-full 
          ${sizeClasses[size]} 
          ${className}
        `}
        tabIndex={-1}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id={titleId} className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h2>
            {showCloseButton && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div id={descriptionId} className="px-6 py-4">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
  
  return createPortal(dialog, document.body);
};

export default Dialog; 