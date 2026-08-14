import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'error' | 'accent' | 'neutral'
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center px-sp-8 py-[2px] rounded-badge text-xs font-medium border select-none w-max";

  const variants = {
    default: "bg-bg-secondary border-border text-text-secondary",
    neutral: "bg-bg-surface border-border text-text-primary",
    success: "bg-status-success-surface border-status-success/20 text-status-success",
    warning: "bg-status-warning-surface border-status-warning/20 text-status-warning",
    error: "bg-status-error-surface border-status-error/20 text-status-error",
    accent: "bg-accent-surface border-accent/20 text-accent-text"
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
