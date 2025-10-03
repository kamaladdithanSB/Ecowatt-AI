import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb,
  Star,
  Zap,
  Shield,
  Gauge,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

const difficultyIcons = {
  easy: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  medium: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  hard: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" }
};

export default function RecommendationCards({ recommendations, greenScore }) {
  return (
    <div className="space-y-8">
      {/* Green Score Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card border-0 shadow-xl rounded-3xl overflow-hidden green-glow">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              Your Optimization Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="text-6xl font-bold text-emerald-600"
              >
                {greenScore}
                <span className="text-2xl text-gray-500">/100</span>
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="max-w-md mx-auto"
              >
                <Progress 
                  value={greenScore} 
                  className="h-4 bg-gray-200"
                />
              </motion.div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
                <Gauge className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-medium">
                  {greenScore >= 80 ? "Excellent Optimization!" : 
                   greenScore >= 60 ? "Good Progress!" : 
                   greenScore >= 40 ? "Keep Improving!" : 
                   "Getting Started"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-card border-0 shadow-xl rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              AI-Powered Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {recommendations?.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 rounded-2xl border hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rec.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {rec.difficulty && (
                            <Badge 
                              variant="secondary"
                              className={`${difficultyIcons[rec.difficulty.toLowerCase()]?.bg} ${difficultyIcons[rec.difficulty.toLowerCase()]?.color} border-0`}
                            >
                              {(() => {
                                const DifficultyIcon = difficultyIcons[rec.difficulty.toLowerCase()]?.icon;
                                return DifficultyIcon ? <DifficultyIcon className="w-3 h-3 mr-1" /> : null;
                              })()}
                              {rec.difficulty}
                            </Badge>
                          )}
                          {rec.savings_potential && (
                            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                              <Gauge className="w-3 h-3 mr-1" />
                              {rec.savings_potential}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )) || (
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recommendations available yet.</p>
                  <p className="text-sm text-gray-400">Run an optimization to get personalized suggestions.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}