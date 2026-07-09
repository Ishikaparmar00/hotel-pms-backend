import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Activity, BarChart2, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

export const HousekeepingAnalytics: React.FC = () => {
  // Mock Data for charts
  const hourlyData = [
    { time: "08:00", cleaned: 5, expected: 4 },
    { time: "09:00", cleaned: 12, expected: 10 },
    { time: "10:00", cleaned: 18, expected: 15 },
    { time: "11:00", cleaned: 25, expected: 25 },
    { time: "12:00", cleaned: 15, expected: 20 },
    { time: "13:00", cleaned: 8, expected: 10 },
    { time: "14:00", cleaned: 12, expected: 15 },
    { time: "15:00", cleaned: 22, expected: 20 },
  ];

  const staffProductivity = [
    { name: "Maria", completed: 14, avgTime: 22 },
    { name: "James", completed: 12, avgTime: 25 },
    { name: "Sarah", completed: 16, avgTime: 18 },
    { name: "David", completed: 10, avgTime: 28 },
    { name: "Elena", completed: 15, avgTime: 20 },
  ];

  const statusDistribution = [
    { name: "Clean", value: 65, color: "#10B981" },
    { name: "Dirty", value: 20, color: "#F59E0B" },
    { name: "Cleaning", value: 10, color: "#3B82F6" },
    { name: "Inspection", value: 5, color: "#8B5CF6" },
  ];

  const floorPerformance = [
    { floor: "Floor 1", avgTime: 22, score: 95 },
    { floor: "Floor 2", avgTime: 25, score: 88 },
    { floor: "Floor 3", avgTime: 18, score: 98 },
    { floor: "Floor 4", avgTime: 28, score: 82 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cleaning Trend (Line/Area) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp size={16}/> Rooms Cleaned Per Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCleaned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#003B95" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#003B95" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ background: "#1E293B", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }}/>
                  <Area type="monotone" dataKey="cleaned" name="Actual Cleaned" stroke="#003B95" strokeWidth={3} fillOpacity={1} fill="url(#colorCleaned)" />
                  <Area type="monotone" dataKey="expected" name="Expected" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Staff Productivity (Bar) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><BarChart2 size={16}/> Staff Productivity & Avg Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffProductivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis yAxisId="left" orientation="left" stroke="#94A3B8" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ background: "#1E293B", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }}/>
                  <Bar yAxisId="left" dataKey="completed" name="Rooms Completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="avgTime" name="Avg Time (mins)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><PieChartIcon size={16}/> Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Share"]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">100%</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Total</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusDistribution.map((entry, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: entry.color }}></span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Floor Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Activity size={16}/> Floor-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={floorPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="floor" stroke="#94A3B8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ background: "#1E293B", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }}/>
                  <Line yAxisId="left" type="monotone" dataKey="score" name="Quality Score" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="avgTime" name="Avg Time (mins)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
