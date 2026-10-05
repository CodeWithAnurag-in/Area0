import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button";
import { Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";

export default function DemoOne() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-8 shadow-2xl bg-[#08080c]">
      {/* Unsplash background asset providing rich contrast for the SVG liquid glass displacement filter */}
      <div className="absolute inset-0 -z-20 opacity-35 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1400&auto=format&fit=crop"
          alt="Deep Space Network Lattice"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="mb-6 flex flex-col gap-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono tracking-widest text-neutral-300 uppercase">
          <Sparkles className="size-3.5 text-neutral-300" />
          <span>Interactive Component Showcase</span>
        </div>
        <h3 className="text-xl font-semibold text-white tracking-tight">
          Liquid Glass & Metal Precision UI
        </h3>
        <p className="text-sm text-zinc-400 max-w-xl">
          Dynamic SVG turbulence refraction displacement filter combined with tactile physical physics.
        </p>
      </div>

      {/* Button Grid Showcase */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 py-4">
        {/* Default Liquid Glass Button */}
        <LiquidButton size="lg" className="text-white hover:text-white/80">
          <Layers className="size-4 text-white" />
          <span>Liquid Glass</span>
        </LiquidButton>

        {/* Destructive Liquid Glass Button */}
        <LiquidButton variant="destructive" size="lg">
          <ShieldCheck className="size-4" />
          <span>Secure Enclave</span>
        </LiquidButton>

        {/* Metal Precision Variant */}
        <MetalButton variant="primary">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-white" />
            <span>Metal Titanium</span>
          </div>
        </MetalButton>

        <MetalButton variant="gold">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-yellow-300" />
            <span>Mastery Gold</span>
          </div>
        </MetalButton>
      </div>
    </div>
  );
}
