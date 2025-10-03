import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { User } from "./entities/User";
import { 
  Zap, 
  TrendingDown, 
  Leaf, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  Globe,
  Shield,
  Lightbulb
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const stats = [
    { value: "2.4M", label: "kWh Saved", icon: Zap },
    { value: "1.8K", label: "Tons CO₂ Reduced", icon: TrendingDown },
    { value: "12K", label: "Trees Planted", icon: Leaf },
    { value: "5K+", label: "Users", icon: Globe }
  ];

  useEffect(() => {
    User.me().then(setUser).catch(() => setUser(null));
    const interval = setInterval(() => {
      setAnimationIndex(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-500/20 to-cyan-600/20" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Energy Optimization
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                Save Energy,{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Save Planet
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Our advanced AI analyzes your energy consumption patterns and provides 
                intelligent recommendations to reduce waste, lower costs, and minimize 
                your carbon footprint.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to={createPageUrl("Dashboard")}>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-2xl green-glow group transition-all duration-300">
                  Start Optimizing
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl("Upload")}>
                <Button variant="outline" className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-2xl transition-all duration-300">
                  Upload Your Data
                </Button>
              </Link>
            </motion.div>

            {/* Animated Energy Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-card p-8 rounded-3xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      animate={{
                        scale: animationIndex === index ? 1.1 : 1,
                        y: animationIndex === index ? -10 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        animationIndex === index 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 green-glow' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        <stat.icon className={`w-8 h-8 ${
                          animationIndex === index ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Intelligent Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by advanced machine learning algorithms to deliver precise energy optimization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "Real-time analysis of your energy consumption patterns with predictive insights",
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: Lightbulb,
                title: "AI Optimization",
                description: "Machine learning algorithms that automatically optimize your energy usage",
                color: "from-emerald-500 to-teal-600"
              },
              {
                icon: Shield,
                title: "Impact Tracking",
                description: "Monitor your environmental impact and track CO₂ savings in real-time",
                color: "from-purple-500 to-pink-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="glass-card border-0 shadow-xl rounded-3xl overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Energy Journey?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already saving energy and reducing their carbon footprint with our AI-powered platform.
            </p>
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-6 text-lg rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300">
                Get Started Now
                <Zap className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

