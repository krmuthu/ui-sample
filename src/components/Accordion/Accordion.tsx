import React, { createContext, useContext, useState } from 'react';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
  isItemOpen: (id: string) => boolean;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

export interface AccordionProps {
  /**
   * Children must be AccordionItem components
   */
  children: React.ReactNode;
  
  /**
   * Allow multiple items to be expanded at once
   * @default false
   */
  allowMultiple?: boolean;
  
  /**
   * Default expanded item IDs
   */
  defaultOpenItems?: string[];
  
  /**
   * Optional class name for the accordion wrapper
   */
  className?: string;
}

export interface AccordionItemProps {
  /**
   * Unique identifier for the accordion item
   */
  id: string;
  
  /**
   * Header content
   */
  header: React.ReactNode;
  
  /**
   * Panel content
   */
  children: React.ReactNode;
  
  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Optional class name for the item wrapper
   */
  className?: string;
}

// Define the compound component type
type AccordionComponent = React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  header,
  children,
  disabled = false,
  className = '',
}) => {
  const context = useContext(AccordionContext);
  
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }
  
  const { isItemOpen, toggleItem } = context;
  const isOpen = isItemOpen(id);

  const handleClick = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleItem(id);
    }
  };

  return (
    <div className={`${className}`}>
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        aria-controls={`accordion-panel-${id}`}
        className={`
          flex w-full items-center justify-between px-4 py-4 text-left
          ${disabled 
            ? 'cursor-not-allowed text-gray-400' 
            : 'text-gray-900 hover:bg-gray-50'
          }
        `}
      >
        <span className="font-medium">{header}</span>
        <svg
          className={`h-5 w-5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <div
        id={`accordion-panel-${id}`}
        role="region"
        aria-labelledby={`accordion-header-${id}`}
        className={`
          overflow-hidden transition-all duration-200 ease-in-out
          ${isOpen ? 'max-h-96' : 'max-h-0'}
        `}
      >
        <div className="px-4 pb-4 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

const AccordionBase: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };

  const isItemOpen = (id: string) => openItems.includes(id);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, isItemOpen, allowMultiple }}>
      <div className={`divide-y divide-gray-200 rounded-lg border border-gray-200 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Create the Accordion component with the compound component type
export const Accordion: AccordionComponent = Object.assign(AccordionBase, { Item: AccordionItem });

export default Accordion; 