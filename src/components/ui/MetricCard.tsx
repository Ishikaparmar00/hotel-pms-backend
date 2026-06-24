import React from "react";
import { Card } from "./Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  progress?: number; // 0 to 100 for a progress bar
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection,
  progress,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="animate-pulse-soft">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-2/3">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-700"></div>
        </div>
        <div className="mt-4 h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
      </Card>
    );
  }

  return (
    <Card hoverable className="relative overflow-hidden group">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full transition-all duration-300 group-hover:scale-110"></div>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-customText-mutedLight dark:text-customText-mutedDark tracking-wide uppercase">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-customText-light dark:text-customText-dark font-sans">
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-3 bg-primary/5 group-hover:bg-primary/10 text-primary dark:text-secondary dark:bg-secondary/5 dark:group-hover:bg-secondary/10 rounded-xl transition-all duration-300 transform group-hover:scale-105">
            {icon}
          </div>
        )}
      </div>

      {(trend || progress !== undefined) && (
        <div className="mt-4 flex flex-col space-y-2">
          {progress !== undefined && (
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          {trend && (
            <div className="flex items-center text-xs font-semibold">
              {trendDirection === "up" && (
                <span className="flex items-center text-emerald-600 dark:text-emerald-500 mr-1.5 p-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  {trend}
                </span>
              )}
              {trendDirection === "down" && (
                <span className="flex items-center text-rose-600 dark:text-rose-500 mr-1.5 p-0.5 bg-rose-50 dark:bg-rose-500/10 rounded">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  {trend}
                </span>
              )}
              {trendDirection === "neutral" && (
                <span className="text-gray-500 dark:text-slate-400 mr-1.5 px-1 bg-gray-100 dark:bg-slate-700 rounded">
                  {trend}
                </span>
              )}
              <span className="text-customText-mutedLight dark:text-customText-mutedDark">vs previous period</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
