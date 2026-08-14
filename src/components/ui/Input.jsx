import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  type = 'text',
  label,
  error,
  className = '',
  icon: Icon = null,
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
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-sp-12 text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          required={required}
          className={`w-full bg-bg-surface border border-border rounded-input text-body px-sp-12 py-sp-8 h-sp-input-h transition-all duration-150 placeholder:text-text-muted text-text-primary ${
            Icon ? 'pl-sp-36' : ''
          } ${
            error ? 'border-status-error focus:border-status-error focus:shadow-[0_0_0_3px_var(--color-status-error-surface)]' : 'focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-surface)]'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-meta font-medium text-status-error">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
