import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown, BarChart3 } from "lucide-react";
import { format } from "date-fns";

export default function OptimizationChart({ data, result }) {
  const chartData = data?.slice(0, 24).reverse().map(item => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    original: item.usage_kwh,
    optimized: item.optimized_usage_kwh || item.usage_kwh * 0.8,
    savings: item.usage_kwh - (item.optimized_usage_kwh || item.usage_kwh * 0.8)
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-xl border-0 shadow-xl">
          <p className="font-medium text-gray-900 mb-2">Time: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)} kWh
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-card border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              Before vs After Optimization
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
              <TrendingDown className="w-4 h-4" />
              {result?.energy_saved_percentage?.toFixed(1)}% Reduction
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="original"
                  fill="#ef4444"
                  name="Original Usage"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="optimized"
                  fill="#3b82f6"
                  name="Optimized Usage"
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Energy Saved"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">Original Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">Optimized Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Energy Saved</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}