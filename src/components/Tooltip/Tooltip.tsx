import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
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
  
  /**
   * Offset from the trigger element in pixels
   * @default 8
   */
  offset?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  showDelay = 200,
  hideDelay = 0,
  arrow = true,
  className = '',
  offset = 8,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top?: number; left?: number }>({});
  const [actualPlacement, setActualPlacement] = useState<TooltipPlacement>(placement);
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

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) {
      return { 
        newPosition: { top: 0, left: 0 }, 
        newActualPlacement: placement 
      };
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Initial positions based on placement
    const positions = {
      top: {
        top: triggerRect.top - tooltipRect.height - offset + scrollY,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollX,
      },
      bottom: {
        top: triggerRect.bottom + offset + scrollY,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollX,
      },
      left: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollY,
        left: triggerRect.left - tooltipRect.width - offset + scrollX,
      },
      right: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollY,
        left: triggerRect.right + offset + scrollX,
      },
    };

    // Get the base position from the requested placement
    let newPosition = { ...positions[placement] };
    let newActualPlacement = placement;

    // Check horizontal boundaries
    if (newPosition.left < scrollX) {
      // Too far left, try to adjust
      if (placement === 'left') {
        // Flip to right
        newPosition = positions.right;
        newActualPlacement = 'right';
      } else {
        // Otherwise just clamp to left edge
        newPosition.left = scrollX + offset;
      }
    } else if (newPosition.left + tooltipRect.width > scrollX + viewportWidth) {
      // Too far right, try to adjust
      if (placement === 'right') {
        // Flip to left
        newPosition = positions.left;
        newActualPlacement = 'left';
      } else {
        // Otherwise clamp to right edge
        newPosition.left = scrollX + viewportWidth - tooltipRect.width - offset;
      }
    }

    // Check vertical boundaries
    if (newPosition.top < scrollY) {
      // Too far up, try to adjust
      if (placement === 'top') {
        // Flip to bottom
        newPosition = positions.bottom;
        newActualPlacement = 'bottom';
      } else {
        // Otherwise clamp to top edge
        newPosition.top = scrollY + offset;
      }
    } else if (newPosition.top + tooltipRect.height > scrollY + viewportHeight) {
      // Too far down, try to adjust
      if (placement === 'bottom') {
        // Flip to top
        newPosition = positions.top;
        newActualPlacement = 'top';
      } else {
        // Otherwise clamp to bottom edge
        newPosition.top = scrollY + viewportHeight - tooltipRect.height - offset;
      }
    }

    return { newPosition, newActualPlacement };
  };

  // Get initial centered position to avoid flickering in Storybook
  const getCenteredPosition = () => {
    if (!triggerRef.current) return { top: -1000, left: -1000 };
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    return {
      top: triggerRect.top + triggerRect.height / 2 + scrollY,
      left: triggerRect.left + triggerRect.width / 2 + scrollX
    };
  };

  // Use useLayoutEffect to calculate position after DOM updates but before browser paint
  useLayoutEffect(() => {
    if (isVisible && tooltipRef.current) {
      // Initial position close to the trigger to reduce flicker
      const initialPosition = getCenteredPosition();
      setPosition(initialPosition);
      
      // Immediately calculate position to avoid flickering in Storybook
      // Use a tick to ensure DOM has updated
      setTimeout(() => {
        if (triggerRef.current && tooltipRef.current) {
          const { newPosition, newActualPlacement } = calculatePosition();
          setPosition(newPosition);
          setActualPlacement(newActualPlacement);
        }
      }, 0);
    }
  }, [isVisible, placement, offset]);

  const getArrowPosition = () => {
    switch (actualPlacement) {
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
            data-placement={actualPlacement}
            className={`
              absolute z-50 px-2 py-1
              bg-gray-700 text-white
              text-sm rounded shadow-lg
              ${className}
            `}
            style={position}
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