import React, { useState, useRef, useEffect } from 'react';

export interface TabProps {
  /**
   * Unique identifier for the tab
   */
  id: string;
  
  /**
   * Label to display in the tab button
   */
  label: React.ReactNode;
  
  /**
   * Content to display when tab is active
   */
  children: React.ReactNode;
  
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Icon to display before the label
   */
  icon?: React.ReactNode;
  
  /**
   * Custom class name for the tab panel
   */
  className?: string;
}

export interface TabsProps {
  /**
   * Array of tab items
   */
  tabs: TabProps[];
  
  /**
   * Currently active tab ID (controlled mode)
   */
  activeTab?: string;
  
  /**
   * Default active tab ID (uncontrolled mode)
   * @default first non-disabled tab
   */
  defaultActiveTab?: string;
  
  /**
   * Callback when active tab changes
   */
  onChange?: (tabId: string) => void;
  
  /**
   * Whether to render tab content only when active
   * @default true
   */
  lazy?: boolean;
  
  /**
   * Visual variant of the tabs
   * @default "line"
   */
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
  
  /**
   * Size of the tab buttons
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to stretch tabs to full width
   * @default false
   */
  isFitted?: boolean;
  
  /**
   * Custom class name for the tabs wrapper
   */
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  onChange,
  lazy = true,
  variant = 'line',
  size = 'md',
  isFitted = false,
  className = '',
}) => {
  // Find first non-disabled tab for default
  const defaultTab = defaultActiveTab || tabs.find(tab => !tab.disabled)?.id || tabs[0]?.id;
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [focusedTab, setFocusedTab] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const currentTab = controlledActiveTab !== undefined ? controlledActiveTab : activeTab;
  
  // Track rendered tabs for lazy loading
  const [renderedTabs, setRenderedTabs] = useState<Set<string>>(new Set([currentTab]));

  useEffect(() => {
    if (currentTab && !renderedTabs.has(currentTab)) {
      setRenderedTabs(prev => new Set([...Array.from(prev), currentTab]));
    }
  }, [currentTab]);

  const handleTabClick = (tabId: string) => {
    if (!tabs.find(tab => tab.id === tabId)?.disabled) {
      if (controlledActiveTab === undefined) {
        setActiveTab(tabId);
      }
      onChange?.(tabId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabIds = tabs.map(tab => tab.id);
    const currentIndex = tabIds.indexOf(focusedTab || currentTab);
    
    let newIndex: number | null = null;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabIds.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedTab) {
          handleTabClick(focusedTab);
        }
        break;
    }
    
    if (newIndex !== null) {
      // Skip disabled tabs
      while (tabs[newIndex]?.disabled && newIndex !== currentIndex) {
        newIndex = newIndex < currentIndex ? newIndex - 1 : newIndex + 1;
        if (newIndex < 0) newIndex = tabIds.length - 1;
        if (newIndex >= tabIds.length) newIndex = 0;
      }
      
      const newTabId = tabIds[newIndex];
      setFocusedTab(newTabId);
      tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${newTabId}"]`)?.focus();
    }
  };

  const tabListClasses = `
    flex border-b border-gray-200
    ${variant === 'enclosed' ? 'bg-gray-50 rounded-t-lg p-1' : ''}
    ${variant.includes('rounded') ? 'gap-1 p-1' : ''}
    ${className}
  `;

  const getTabButtonClasses = (tab: TabProps) => {
    const isActive = tab.id === currentTab;
    const isFocused = tab.id === focusedTab;
    
    const baseClasses = `
      ${isFitted ? 'flex-1' : ''}
      inline-flex items-center justify-center
      ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2'}
      ${tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      ${isFocused ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
    `;
    
    switch (variant) {
      case 'enclosed':
        return `
          ${baseClasses}
          ${isActive 
            ? 'bg-white border-t border-l border-r border-gray-200 rounded-t-lg -mb-px' 
            : 'hover:bg-gray-100'}
        `;
      case 'soft-rounded':
        return `
          ${baseClasses}
          rounded-full
          ${isActive 
            ? 'bg-gray-100 text-gray-900' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
        `;
      case 'solid-rounded':
        return `
          ${baseClasses}
          rounded-full
          ${isActive 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
        `;
      default: // line
        return `
          ${baseClasses}
          border-b-2
          ${isActive 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
        `;
    }
  };

  return (
    <div className="w-full">
      <div
        ref={tabsRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={tabListClasses}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            data-tab-id={tab.id}
            aria-selected={tab.id === currentTab}
            aria-controls={`panel-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={tab.id === currentTab ? 0 : -1}
            onClick={() => handleTabClick(tab.id)}
            onFocus={() => setFocusedTab(tab.id)}
            onBlur={() => setFocusedTab(null)}
            className={getTabButtonClasses(tab)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {tabs.map(tab => {
          const isActive = tab.id === currentTab;
          const shouldRender = !lazy || renderedTabs.has(tab.id);
          
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              className={`${tab.className || ''} ${isActive ? '' : 'hidden'}`}
            >
              {shouldRender && tab.children}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs; 