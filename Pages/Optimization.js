
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { EnergyData, OptimizationResult } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lightbulb,
  Zap,
  TrendingDown,
  Leaf,
  DollarSign,
  ArrowLeft,
  Brain,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import OptimizationChart from "../components/optimization/OptimizationChart";
import RecommendationCards from "../components/optimization/RecommendationCards";

export default function OptimizationPage() {
  const [user, setUser] = useState(null);
  const [energyData, setEnergyData] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEnergyData = useCallback(async () => {
    try {
      const data = await EnergyData.list("-timestamp", 100);
      setEnergyData(data);
    } catch (error) {
      console.error("Error loading energy data:", error);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        await loadEnergyData();
      } catch (e) {
        console.error("Error fetching user or initializing app:", e);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, [loadEnergyData]);

  const runOptimization = async () => {
    if (energyData.length === 0) {
      alert("No energy data available. Please upload some data first.");
      return;
    }

    setIsOptimizing(true);
    setProgress(0);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 500);

      // Prepare data for AI analysis
      const dataForAnalysis = energyData.slice(0, 50).map(item => ({
        timestamp: item.timestamp,
        usage_kwh: item.usage_kwh,
        device_type: item.device_type,
        is_peak_hour: item.is_peak_hour
      }));

      // Use AI to analyze and optimize
      const aiResponse = await InvokeLLM({
        prompt: `You are an energy optimization expert. Analyze the following energy consumption data and provide optimization recommendations:

${JSON.stringify(dataForAnalysis, null, 2)}

Please provide:
1. Optimized energy usage schedule (reduce consumption by 15-30%)
2. Calculate total energy savings in kWh and percentage
3. Estimate CO2 reduction (0.5 kg CO2 per kWh saved)
4. Calculate cost savings ($0.12 per kWh)
5. Provide 5 specific actionable recommendations
6. Assign a green score (0-100) based on potential savings

Be specific and practical with recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            optimized_data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "string" },
                  original_usage: { type: "number" },
                  optimized_usage: { type: "number" }
                }
              }
            },
            total_usage_before: { type: "number" },
            total_usage_after: { type: "number" },
            energy_saved_kwh: { type: "number" },
            energy_saved_percentage: { type: "number" },
            co2_reduced_kg: { type: "number" },
            cost_saved_usd: { type: "number" },
            green_score: { type: "number" },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  savings_potential: { type: "string" },
                  difficulty: { type: "string" }
                }
              }
            }
          }
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Calculate trees equivalent (22kg CO2 per tree per year)
      const treesEquivalent = Math.floor((aiResponse.co2_reduced_kg || 0) / 22);

      // Save optimization result
      const optimizationData = {
        total_usage_before: aiResponse.total_usage_before || 0,
        total_usage_after: aiResponse.total_usage_after || 0,
        energy_saved_kwh: aiResponse.energy_saved_kwh || 0,
        energy_saved_percentage: aiResponse.energy_saved_percentage || 0,
        co2_reduced_kg: aiResponse.co2_reduced_kg || 0,
        trees_equivalent: treesEquivalent,
        green_score: aiResponse.green_score || 0,
        cost_saved_usd: aiResponse.cost_saved_usd || 0,
        optimization_date: new Date().toISOString()
      };

      const savedResult = await OptimizationResult.create(optimizationData);
      setOptimizationResult(savedResult);
      setRecommendations(aiResponse.recommendations || []);

      // Update energy data with optimized values
      if (aiResponse.optimized_data && aiResponse.optimized_data.length > 0) {
        for (let i = 0; i < Math.min(aiResponse.optimized_data.length, energyData.length); i++) {
          const optimizedItem = aiResponse.optimized_data[i];
          const originalItem = energyData[i];

          await EnergyData.update(originalItem.id, {
            optimized_usage_kwh: optimizedItem.optimized_usage
          });
        }
      }

    } catch (error) {
      console.error("Optimization error:", error);
      alert("Failed to run optimization. Please try again.");
    }

    setIsOptimizing(false);
  };

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <div className="glass-card p-8 rounded-3xl shadow-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Please Log In</h2>
          <p className="text-gray-600 mb-6 max-w-sm">Log in to unlock the power of AI and optimize your energy consumption.</p>
          <Button onClick={() => User.login()} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-6 py-3">Login to Optimize</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Energy Optimization</h1>
            <p className="text-gray-600 mt-1">Let AI analyze and optimize your energy consumption</p>
          </div>
        </div>

        {/* Optimization Control */}
        <Card className="glass-card border-0 shadow-xl rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              AI-Powered Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {!isOptimizing && !optimizationResult && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Optimize Your Energy Usage?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI will analyze {energyData.length} data points and provide personalized optimization recommendations.
                  </p>
                  <Button
                    onClick={runOptimization}
                    disabled={energyData.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 text-lg rounded-xl green-glow"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Start AI Optimization
                  </Button>
                </div>
              </div>
            )}

            {isOptimizing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI is Analyzing Your Data...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Please wait while we optimize your energy consumption patterns
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              </motion.div>
            )}

            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto green-glow">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Optimization completed successfully! Your personalized recommendations are ready.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {optimizationResult && (
          <>
            {/* Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Energy Saved",
                  value: `${optimizationResult.energy_saved_kwh.toFixed(1)} kWh`,
                  percentage: `${optimizationResult.energy_saved_percentage.toFixed(1)}%`,
                  icon: Zap,
                  color: "from-blue-500 to-cyan-600"
                },
                {
                  title: "CO₂ Reduced",
                  value: `${optimizationResult.co2_reduced_kg.toFixed(1)} kg`,
                  percentage: "Less emissions",
                  icon: TrendingDown,
                  color: "from-emerald-500 to-teal-600"
                },
                {
                  title: "Trees Equivalent",
                  value: `${optimizationResult.trees_equivalent}`,
                  percentage: "Trees planted",
                  icon: Leaf,
                  color: "from-green-500 to-emerald-600"
                },
                {
                  title: "Cost Savings",
                  value: `$${optimizationResult.cost_saved_usd.toFixed(2)}`,
                  percentage: "Per month",
                  icon: DollarSign,
                  color: "from-yellow-500 to-orange-600"
                }
              ].map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center`}>
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-sm text-emerald-600 font-medium">{metric.percentage}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Optimization Chart */}
            <OptimizationChart
              data={energyData.slice(0, 24)}
              result={optimizationResult}
            />

            {/* AI Recommendations */}
            <RecommendationCards
              recommendations={recommendations}
              greenScore={optimizationResult.green_score}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
