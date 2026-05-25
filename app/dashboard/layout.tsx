"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  TrendingUp, 
  LineChart, 
  Users, 
  ShieldAlert, 
  Package, 
  LogOut,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { name: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales Analytics", href: "/dashboard/sales", icon: TrendingUp },
  { name: "AI Forecasting", href: "/dashboard/forecasting", icon: LineChart },
  { name: "Customer Segments", href: "/dashboard/customers", icon: Users },
  { name: "Fraud Detection", href: "/dashboard/fraud", icon: ShieldAlert },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">SmartRetail AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className="block w-full">
                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-indigo-400" : ""}`} />
                  <span className="relative z-10">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 font-medium hover:text-white rounded-lg transition-colors cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-gray-950 to-gray-950 -z-10" />
        
        {/* Header */}
        <header className="h-16 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-md flex items-center px-8 z-10">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-medium text-gray-300">Admin</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
