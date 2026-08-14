import React, { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  error,
  options = [], // [{ value, label }]
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-sp-6 font-sans w-full">
      {label && (
        <label className="text-meta font-medium text-text-secondary">
          {label}
          {required && <span className="text-status-error ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          required={required}
          className={`w-full bg-bg-surface border border-border rounded-input text-body px-sp-12 py-sp-8 h-sp-input-h transition-all duration-150 text-text-primary appearance-none cursor-pointer ${
            error ? 'border-status-error focus:border-status-error focus:shadow-[0_0_0_3px_var(--color-status-error-surface)]' : 'focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-surface)]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Native Arrow overlay */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-sp-12 text-text-muted">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-meta font-medium text-status-error">{error}</span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
