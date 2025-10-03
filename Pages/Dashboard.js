import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnergyData, OptimizationResult } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Zap,
  TrendingDown,
  Leaf,
  DollarSign,
  PlayCircle,
  PauseCircle,
  BarChart3,
  ArrowUp,
  Loader2
} from "lucide-react";

import EnergyChart from "../components/dashboard/EnergyChart";
import GreenScoreCard from "../components/dashboard/GreenScoreCard";
import ImpactCards from "../components/dashboard/ImpactCards";
import RealtimeSimulation from "../components/dashboard/RealtimeSimulation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [energyData, setEnergyData] = useState([]);
  const [optimizationResults, setOptimizationResults] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize loadData to ensure it's stable and doesn't trigger useEffect unnecessarily.
  // It takes 'currentUser' as an argument, so it doesn't need to depend on the 'user' state.
  const loadData = useCallback(async (currentUser) => {
    setIsLoading(true);
    try {
      if (currentUser) { // Only attempt to fetch data if a user is present
        const [energy, results] = await Promise.all([
          EnergyData.list("-timestamp", 50),
          OptimizationResult.list("-optimization_date", 10)
        ]);
        setEnergyData(energy);
        setOptimizationResults(results);
      } else {
        // If no user (e.g., not logged in), clear existing data and show empty state
        setEnergyData([]);
        setOptimizationResults([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Even if data loading fails, ensure we set empty states
      setEnergyData([]);
      setOptimizationResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array because all dynamic values (setters) are stable or passed as arguments.

  useEffect(() => {
    async function initialize() {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        // Pass the fetched user directly to loadData.
        // loadData is a stable function due to useCallback, so it can be a dependency.
        await loadData(currentUser);
      } catch (e) {
        // User not logged in, or error fetching user.
        console.error("Error fetching user or initializing data:", e);
        setUser(null);
        setIsLoading(false); // Ensure loading state is cleared if user check fails
        // Call loadData with null to ensure data states are cleared in UI
        await loadData(null);
      }
    }
    initialize();
  }, [loadData]); // Dependency array now includes loadData, which is stable.

  const latestResult = optimizationResults[0];

  // Conditional rendering for loading state
  if (isLoading) {
      return (
          <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
      );
  }

  // Conditional rendering for login state (after loading check)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <div className="glass-card p-8 rounded-3xl shadow-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to EcoOptimize</h2>
          <p className="text-gray-600 mb-6 max-w-sm">Please log in to view your personalized energy dashboard and start optimizing.</p>
          <Button onClick={() => User.login()} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl px-6 py-3">Login to Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Energy Dashboard</h1>
            <p className="text-gray-600">Monitor your consumption and track optimization results</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={isSimulating ? "destructive" : "default"}
              onClick={() => setIsSimulating(!isSimulating)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl"
            >
              {isSimulating ? (
                <>
                  <PauseCircle className="w-4 h-4 mr-2" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Simulation
                </>
              )}
            </Button>
            <Link to={createPageUrl("Optimization")}>
              <Button variant="outline" className="rounded-xl">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Optimization
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <ImpactCards
          results={optimizationResults}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Energy Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <EnergyChart
                data={energyData}
                isLoading={isLoading}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Green Score */}
            <GreenScoreCard
              score={latestResult?.green_score || 0}
              isLoading={isLoading}
            />

            {/* Real-time Simulation */}
            <AnimatePresence>
              {isSimulating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RealtimeSimulation
                    onDataUpdate={(newData) => {
                      setEnergyData(prev => [newData, ...prev.slice(0, 49)]);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>


            {/* Quick Actions */}
            <Card className="glass-card border-0 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={createPageUrl("Upload")} className="block">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    Upload Energy Data
                    <ArrowUp className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Optimization")} className="block">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    View Detailed Analysis
                    <BarChart3 className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
