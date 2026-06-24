import React from "react";

interface AvatarItem {
  avatarUrl?: string;
  name: string;
}

interface AvatarGroupProps {
  items: AvatarItem[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  items,
  max = 4,
  size = "md",
}) => {
  const visibleItems = items.slice(0, max);
  const remainingCount = Math.max(0, items.length - max);

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const ringStyles = "ring-2 ring-white dark:ring-slate-800";

  return (
    <div className="flex -space-x-2.5 overflow-hidden items-center">
      {visibleItems.map((item, idx) => {
        const initials = item.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div
            key={idx}
            className={`relative inline-flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-semibold select-none ${sizeClasses[size]} ${ringStyles}`}
            title={item.name}
          >
            {item.avatarUrl ? (
              <img
                className="w-full h-full rounded-full object-cover"
                src={item.avatarUrl}
                alt={item.name}
                onError={(e) => {
                  // Fallback to initials on image load error
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        );
      })}
      
      {remainingCount > 0 && (
        <div
          className={`flex items-center justify-center rounded-full bg-primary text-white font-bold select-none ${sizeClasses[size]} ${ringStyles}`}
          title={`${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
