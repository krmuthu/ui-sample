import React from 'react';

export interface TimeOption {
  value: number;
  label: string;
  disabled: boolean;
}

export interface TimeListProps {
  /**
   * The selected hour
   */
  selectedHour: number;
  
  /**
   * The selected minute
   */
  selectedMinute: number;
  
  /**
   * The selected period (AM/PM) for 12h format
   */
  selectedPeriod?: 'AM' | 'PM';
  
  /**
   * Available hour options
   */
  hourOptions: TimeOption[];
  
  /**
   * Available minute options
   */
  minuteOptions: TimeOption[];
  
  /**
   * Time format (12h or 24h)
   */
  displayFormat: '12h' | '24h';
  
  /**
   * Handler for hour selection
   */
  onHourSelect: (hour: number) => void;
  
  /**
   * Handler for minute selection
   */
  onMinuteSelect: (minute: number) => void;
  
  /**
   * Handler for period selection (AM/PM)
   */
  onPeriodSelect?: (period: 'AM' | 'PM') => void;
  
  /**
   * Additional class name for the time list container
   */
  className?: string;
}

export const TimeList: React.FC<TimeListProps> = ({
  selectedHour,
  selectedMinute,
  selectedPeriod = 'AM',
  hourOptions,
  minuteOptions,
  displayFormat,
  onHourSelect,
  onMinuteSelect,
  onPeriodSelect,
  className = ''
}) => {
  // Style classes
  const columnHeaderClasses = [
    'text-xs font-medium text-[var(--btn-secondary-text)] mb-1 text-center'
  ].join(' ');
  
  const optionClasses = (isSelected: boolean, isDisabled: boolean) => [
    'text-left px-3 py-2 rounded text-sm transition-colors duration-150',
    isDisabled 
      ? 'opacity-50 cursor-not-allowed text-[var(--btn-disabled-text)]' 
      : 'hover:bg-[var(--btn-secondary-hover)] cursor-pointer',
    isSelected 
      ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)]' 
      : ''
  ].filter(Boolean).join(' ');
  
  const containerClasses = [
    'grid grid-cols-3 gap-3',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses}>
      {/* Hours Column */}
      <div className="flex flex-col">
        <div className={columnHeaderClasses}>
          Hour
        </div>
        <div className="overflow-y-auto max-h-40 scrollbar-thin scrollbar-thumb-[var(--btn-secondary-border)]">
          {hourOptions.map((option) => (
            <div
              key={`hour-${option.value}`}
              className={optionClasses(selectedHour === option.value, option.disabled)}
              onClick={() => !option.disabled && onHourSelect(option.value)}
              aria-disabled={option.disabled}
              role="option"
              aria-selected={selectedHour === option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
      
      {/* Minutes Column */}
      <div className="flex flex-col">
        <div className={columnHeaderClasses}>
          Minute
        </div>
        <div className="overflow-y-auto max-h-40 scrollbar-thin scrollbar-thumb-[var(--btn-secondary-border)]">
          {minuteOptions.map((option) => (
            <div
              key={`minute-${option.value}`}
              className={optionClasses(selectedMinute === option.value, option.disabled)}
              onClick={() => !option.disabled && onMinuteSelect(option.value)}
              aria-disabled={option.disabled}
              role="option"
              aria-selected={selectedMinute === option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
      
      {/* AM/PM Column (only for 12h format) */}
      {displayFormat === '12h' && onPeriodSelect && (
        <div className="flex flex-col">
          <div className={columnHeaderClasses}>
            Period
          </div>
          <div>
            <div
              className={optionClasses(selectedPeriod === 'AM', false)}
              onClick={() => onPeriodSelect('AM')}
              role="option"
              aria-selected={selectedPeriod === 'AM'}
            >
              AM
            </div>
            <div
              className={optionClasses(selectedPeriod === 'PM', false)}
              onClick={() => onPeriodSelect('PM')}
              role="option"
              aria-selected={selectedPeriod === 'PM'}
            >
              PM
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
