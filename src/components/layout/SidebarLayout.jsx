import React from 'react';

export const SidebarLayout = ({
  sidebar,
  children,
  className = '',
  sidebarWidthClass = 'lg:w-[22%]',
  contentWidthClass = 'lg:w-[78%]'
}) => {
  return (
    <div className={`flex flex-col lg:flex-row gap-sp-32 lg:gap-sp-48 max-w-[1280px] mx-auto px-sp-16 sm:px-sp-32 lg:px-sp-48 py-sp-48 font-sans ${className}`}>
      {/* Sidebar - Left column */}
      <aside className={`w-full ${sidebarWidthClass} shrink-0 lg:sticky lg:top-[100px] h-fit`}>
        {sidebar}
      </aside>

      {/* Content - Right column */}
      <main className={`w-full ${contentWidthClass} min-w-0`}>
        {children}
      </main>
    </div>
  );
};
