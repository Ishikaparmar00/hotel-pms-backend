import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = "", ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-customBorder-dark rounded-xl p-5 shadow-premium transition-all duration-300 ${
        hoverable ? "hover:shadow-premium-hover hover:-translate-y-0.5 cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return (
    <div className={`flex items-center justify-between border-b border-customBorder-light dark:border-customBorder-dark pb-3 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`font-semibold text-lg text-customText-light dark:text-customText-dark tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return <div className={className} {...props}>{children}</div>;
};
