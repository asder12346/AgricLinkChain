"use client"

import type React from "react"
import { Warp } from "@paper-design/shaders-react"
import { 
  Globe, 
  ShieldCheck, 
  BarChart3, 
  Leaf, 
  Bell, 
  Link as LinkIcon, 
  ArrowRight,
  Sprout
} from "lucide-react"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

const features: Feature[] = [
  {
    title: "Global Marketplace",
    description:
      "Connect directly with verified buyers in 40+ countries. Skip the middlemen and maximize your farm's profit margins.",
    icon: <Globe className="w-6 h-6 text-lime-400" />,
  },
  {
    title: "Safe Escrow Payments",
    description: "Multi-sig escrow ensures you get paid as soon as delivery is confirmed. Transparent, secure, and instant transactions.",
    icon: <ShieldCheck className="w-6 h-6 text-lime-400" />,
  },
  {
    title: "Predictive AI Insights",
    description: "Advanced data models forecast market demand and price fluctuations, helping you decide exactly what and when to plant.",
    icon: <BarChart3 className="w-6 h-6 text-lime-400" />,
  },
  {
    title: "Supply Chain Traceability",
    description: "End-to-end blockchain tracking from soil to store. Build ultimate trust with consumers through verified proof of origin.",
    icon: <LinkIcon className="w-6 h-6 text-lime-400" />,
  },
  {
    title: "Real-time Market Alerts",
    description: "Stay ahead with live notifications on commodity prices, weather patterns, and shifting global demand in your sector.",
    icon: <Bell className="w-6 h-6 text-lime-400" />,
  },
  {
    title: "Regenerative Growth",
    description: "Access specialized tools and carbon credit markets for sustainable farming practices that protect your land's future.",
    icon: <Sprout className="w-6 h-6 text-lime-400" />,
  },
]

export default function FeaturesCards() {
  const getShaderConfig = (index: number) => {
    const configs = [
      { // Lime / Emerald
        proportion: 0.3,
        softness: 0.8,
        distortion: 0.15,
        swirl: 0.6,
        swirlIterations: 8,
        shape: "checks" as const,
        shapeScale: 0.08,
        colors: ["hsl(84, 92%, 15%)", "hsl(84, 92%, 40%)", "hsl(160, 80%, 20%)", "hsl(84, 92%, 60%)"],
      },
      { // Deep Forest
        proportion: 0.4,
        softness: 1.2,
        distortion: 0.2,
        swirl: 0.9,
        swirlIterations: 12,
        shape: "dots" as const,
        shapeScale: 0.12,
        colors: ["hsl(160, 80%, 10%)", "hsl(145, 70%, 25%)", "hsl(160, 60%, 35%)", "hsl(84, 90%, 50%)"],
      },
      { // Earthy / Sage
        proportion: 0.35,
        softness: 0.9,
        distortion: 0.18,
        swirl: 0.7,
        swirlIterations: 10,
        shape: "checks" as const,
        shapeScale: 0.1,
        colors: ["hsl(40, 30%, 10%)", "hsl(70, 40%, 25%)", "hsl(84, 50%, 35%)", "hsl(84, 92%, 55%)"],
      },
      { // Sunlight / Crop
        proportion: 0.45,
        softness: 1.1,
        distortion: 0.22,
        swirl: 0.8,
        swirlIterations: 15,
        shape: "dots" as const,
        shapeScale: 0.09,
        colors: ["hsl(84, 92%, 10%)", "hsl(60, 80%, 30%)", "hsl(84, 92%, 45%)", "hsl(45, 90%, 65%)"],
      },
      { // Mint / Teal
        proportion: 0.38,
        softness: 0.95,
        distortion: 0.16,
        swirl: 0.85,
        swirlIterations: 11,
        shape: "checks" as const,
        shapeScale: 0.11,
        colors: ["hsl(170, 70%, 10%)", "hsl(160, 60%, 25%)", "hsl(84, 70%, 40%)", "hsl(175, 80%, 60%)"],
      },
      { // Vibrant Lime Focus
        proportion: 0.42,
        softness: 1.0,
        distortion: 0.19,
        swirl: 0.75,
        swirlIterations: 9,
        shape: "dots" as const,
        shapeScale: 0.13,
        colors: ["hsl(84, 92%, 5%)", "hsl(84, 92%, 25%)", "hsl(84, 92%, 50%)", "hsl(84, 92%, 75%)"],
      },
    ]
    return configs[index % configs.length]
  }

  return (
    <section className="relative min-h-screen py-24 px-6 bg-[#071210] overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
             <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
             <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Digital Agriculture</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
            Empowering the <br />
            <span className="text-gradient-lime">Global Supply Chain</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
            Eliminating barriers for farmers and buyers through advanced technology, 
            fair transparency, and sustainable growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const shaderConfig = getShaderConfig(index)
            return (
              <div key={index} className="relative h-[360px] rounded-[32px] p-[1.5px] overflow-hidden">
                {/* Static Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-50" />
                
                <div className="relative h-full w-full rounded-[30px] overflow-hidden bg-[#0A1D11]">
                  {/* Shader Background - Static Opacity */}
                  <div className="absolute inset-0 opacity-50">
                    <Warp
                      style={{ height: "100%", width: "100%" }}
                      proportion={shaderConfig.proportion}
                      softness={shaderConfig.softness}
                      distortion={shaderConfig.distortion}
                      swirl={shaderConfig.swirl}
                      swirlIterations={shaderConfig.swirlIterations}
                      shape={shaderConfig.shape}
                      shapeScale={shaderConfig.shapeScale}
                      scale={1.2}
                      rotation={0}
                      speed={0.4}
                      colors={shaderConfig.colors}
                    />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                    {/* Icon with Glass background - No Scale/Rotate */}
                    <div className="absolute top-8 left-8 p-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl">
                      <div className="text-lime-400">
                        {feature.icon}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-white">
                      {feature.title}
                    </h3>

                    <p className="leading-relaxed text-white/50 font-medium text-sm line-clamp-2">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center text-xs font-bold text-lime-400 cursor-pointer">
                        <span className="mr-2">Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      
                      {/* Decorative dot - Non-animated */}
                      <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                         <div className="w-1.5 h-1.5 rounded-full bg-lime-400/50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Bottom Metrics */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-10 md:gap-20 text-center">
           <div>
              <div className="text-3xl font-black text-white">40+</div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-white/40 mt-1">Markets Reached</div>
           </div>
           <div>
              <div className="text-3xl font-black text-white">$250M+</div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-white/40 mt-1">Transaction Volume</div>
           </div>
           <div>
              <div className="text-3xl font-black text-white">99.9%</div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-white/40 mt-1">Payment Success</div>
           </div>
        </div>
      </div>
    </section>
  )
}
