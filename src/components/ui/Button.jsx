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
  const baseStyle = "inline-flex items-center justify-center font-sans font-medium text-meta rounded-button cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none px-sp-16 py-sp-8 border gap-sp-8 h-sp-button-h transition-all duration-150";
  
  const variants = {
    primary: "bg-accent border-accent text-white hover:bg-accent-hover hover:border-accent-hover active:scale-[0.98] shadow-1",
    secondary: "bg-bg-secondary border-border text-text-primary hover:bg-bg-tertiary active:scale-[0.98]",
    outline: "bg-bg-surface border-border text-text-primary hover:bg-bg-secondary active:scale-[0.98]",
    ghost: "bg-transparent border-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary active:scale-[0.98]",
    danger: "bg-status-error-surface border-status-error/30 text-status-error hover:bg-status-error hover:text-white hover:border-status-error active:scale-[0.98]"
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
