import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode;
  
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;
  
  /**
   * The placement of the tooltip relative to the trigger
   * @default 'top'
   */
  placement?: TooltipPlacement;
  
  /**
   * The delay before showing the tooltip (in milliseconds)
   * @default 200
   */
  showDelay?: number;
  
  /**
   * The delay before hiding the tooltip (in milliseconds)
   * @default 0
   */
  hideDelay?: number;
  
  /**
   * Whether to show an arrow pointing to the trigger
   * @default true
   */
  arrow?: boolean;
  
  /**
   * Custom class name for the tooltip
   */
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  showDelay = 200,
  hideDelay = 0,
  arrow = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const getTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const positions = {
      top: {
        top: triggerRect.top - tooltipRect.height - 8 + scrollY,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollX,
      },
      bottom: {
        top: triggerRect.bottom + 8 + scrollY,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollX,
      },
      left: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollY,
        left: triggerRect.left - tooltipRect.width - 8 + scrollX,
      },
      right: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollY,
        left: triggerRect.right + 8 + scrollX,
      },
    };

    return positions[placement];
  };

  const getArrowPosition = () => {
    switch (placement) {
      case 'top':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-700 border-x-transparent border-b-transparent';
      case 'bottom':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-700 border-x-transparent border-t-transparent';
      case 'left':
        return 'right-0 top-1/2 translate-x-full -translate-y-1/2 border-l-gray-700 border-y-transparent border-r-transparent';
      case 'right':
        return 'left-0 top-1/2 -translate-x-full -translate-y-1/2 border-r-gray-700 border-y-transparent border-l-transparent';
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={`
              absolute z-50 px-2 py-1
              bg-gray-700 text-white
              text-sm rounded shadow-lg
              ${className}
            `}
            style={getTooltipPosition()}
          >
            {content}
            {arrow && (
              <div
                className={`
                  absolute w-0 h-0
                  border-[6px] border-solid
                  ${getArrowPosition()}
                `}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
}; 