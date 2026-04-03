'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Zap, Shield, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-20%] w-[600px] h-[500px] bg-fuchsia-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            TaskFlow<span className="text-primary">Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
            <Zap size={14} />
            <span>TaskFlow Pro 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
            Manage work beautifully. <br className="hidden md:block" />
            Ship products faster.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A modern, lightning-fast task management platform designed for high-performing engineering and design teams. No clutter, just flow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/5">
                Explore features
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 w-full max-w-6xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-4 overflow-hidden shadow-2xl glass-panel">
            <div className="w-full rounded-xl overflow-hidden border border-white/5 bg-[#0a0a0f] aspect-[16/9] flex items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
               <div className="grid grid-cols-4 gap-4 p-8 w-full h-full">
                  {/* Mockup columns */}
                  {[1, 2, 3, 4].map((col) => (
                    <div key={col} className="bg-white/5 rounded-lg border border-white/5 p-4 h-full flex flex-col gap-3">
                      <div className="h-4 w-24 bg-white/10 rounded" />
                      {[...Array(col === 1 ? 3 : col === 2 ? 4 : 2)].map((_, i) => (
                        <div key={i} className="h-24 bg-white/5 rounded border border-white/5" />
                      ))}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
