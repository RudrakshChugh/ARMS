import React from 'react';

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default', // 'default' | 'elevated' | 'secondary'
  ...props
}) => {
  const baseStyle = "border border-border rounded-none bg-bg-surface font-sans transition-all duration-300 overflow-hidden";
  
  const variants = {
    default: "bg-bg-surface",
    elevated: "bg-bg-surface", // Removed elevation logic per aesthetic
    secondary: "bg-bg-secondary border-border"
  };

  const hoverStyle = hoverable 
    ? "hover:border-accent cursor-pointer" 
    : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-sp-24 py-sp-16 border-b border-border-subtle flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`px-sp-24 py-sp-24 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-sp-24 py-sp-16 border-t border-border-subtle bg-bg-secondary flex items-center justify-end ${className}`} {...props}>
    {children}
  </div>
);