import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  disabled = false,
  loading = false,
  className = '',
  icon: Icon = null,
  iconPosition = 'left', // 'left' | 'right'
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-sans uppercase tracking-widest text-[11px] font-semibold rounded-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none px-[30px] py-[15px] border-none gap-sp-8 h-[50px] transition-colors duration-300";
  
  const variants = {
    primary: "bg-accent text-bg-primary hover:bg-accent-hover",
    secondary: "bg-bg-secondary text-text-primary hover:bg-bg-tertiary",
    outline: "bg-transparent border border-border text-text-primary hover:bg-bg-secondary",
    ghost: "bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
    danger: "bg-status-error-surface text-status-error hover:bg-status-error hover:text-bg-primary"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4" />
      ) : null}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className="w-4 h-4" />
      ) : null}
    </button>
  );
};