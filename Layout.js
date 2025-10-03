
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Zap, BarChart3, Upload, Lightbulb, Leaf, Loader2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Zap,
  },
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Upload Data",
    url: createPageUrl("Upload"),
    icon: Upload,
  },
  {
    title: "Optimization",
    url: createPageUrl("Optimization"),
    icon: Lightbulb,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isAppReady, setIsAppReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    User.me()
      .then(currentUser => {
        setUser(currentUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsAppReady(true);
      });
  }, []);

  if (!isAppReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center green-glow">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Initializing EcoOptimize...</h2>
            <p className="text-gray-600">Getting things ready for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <style>{`
        :root {
          --primary: 34 197 94;
          --primary-foreground: 255 255 255;
          --secondary: 20 184 166;
          --accent: 59 130 246;
          --muted: 241 245 249;
          --card: 255 255 255;
          --border: 226 232 240;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .green-glow {
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.3);
        }
      `}</style>
      
      {currentPageName === "Home" ? (
        // Full-screen layout for landing page
        <div className="w-full">
          {children}
        </div>
      ) : (
        // Dashboard layout with sidebar
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <Sidebar className="border-r border-white/20 bg-white/10 backdrop-blur-lg">
              <SidebarHeader className="border-b border-white/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center green-glow">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">EcoOptimize</h2>
                    <p className="text-xs text-gray-600">AI Energy Optimizer</p>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="p-2">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                    Navigation
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 rounded-xl mb-1 ${
                              location.pathname === item.url ? 'bg-emerald-100 text-emerald-800 green-glow' : ''
                            }`}
                          >
                            <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                    Impact
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="px-3 py-2 space-y-3">
                      <div className="glass-card p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-sm">
                          <Leaf className="w-4 h-4 text-emerald-500" />
                          <span className="text-gray-600">Trees Planted</span>
                        </div>
                        <span className="text-xl font-bold text-emerald-600">🌱 12</span>
                      </div>
                      <div className="glass-card p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">Energy Saved</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">⚡ 2.4kWh</span>
                      </div>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t border-white/20 p-4">
                <div className="glass-card p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user ? user.full_name.charAt(0).toUpperCase() : 'U'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{user ? user.full_name : 'Eco Warrior'}</p>
                      <p className="text-xs text-gray-500 truncate">Saving the planet ⚡</p>
                    </div>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 flex flex-col">
              <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 md:hidden">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-white/20 p-2 rounded-lg transition-colors duration-200" />
                  <h1 className="text-xl font-bold text-gray-900">EcoOptimize AI</h1>
                </div>
              </header>

              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      )}
    </div>
  );
}
