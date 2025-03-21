import React from 'react';
import { Dialog } from '../Dialog/Dialog';

// Define interfaces
export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Function called when the modal is closed
   */
  onClose: () => void;
  
  /**
   * The title of the modal
   */
  title?: React.ReactNode;
  
  /**
   * The content of the modal
   */
  children?: React.ReactNode;
  
  /**
   * The size of the modal
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Whether to close the modal when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Whether to close the modal when pressing escape
   * @default true
   */
  closeOnEscape?: boolean;
  
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Whether the modal is centered
   * @default true
   */
  centered?: boolean;
}

// Define Footer props
interface FooterProps {
  children: React.ReactNode;
}

// Define the compound component interface for Modal
interface ModalComponent extends React.FC<ModalProps> {
  Footer: React.FC<FooterProps>;
}

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Define the size mapping function
const mapSize = (size?: ModalSize) => {
  switch (size) {
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
    case 'xl':
    case 'full':
      return 'large';
    default:
      return 'medium';
  }
};

// Modal Footer component
const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
      {children}
    </div>
  );
};

// Modal component implementation
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  centered = true,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={title}
      closeOnBackdropClick={closeOnOutsideClick}
      closeOnEsc={closeOnEscape}
      showCloseButton={showCloseButton}
      centered={centered}
      size={mapSize(size)}
    >
      {children}
    </Dialog>
  );
};

// Attach Footer to Modal
// @ts-expect-error - Adding Footer property to functional component
Modal.Footer = Footer;

// Export as ModalComponent
const ModalWithFooter = Modal as ModalComponent;
export { ModalWithFooter as Modal }; 