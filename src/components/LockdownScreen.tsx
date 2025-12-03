import { useState, useEffect } from "react";
import { Lock, Shield, KeyRound, AlertTriangle, Scan, Radio, Terminal, Waves, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LockdownScreenProps {
  onAuthorized: () => void;
  protocolName: string;
}

export const LockdownScreen = ({ onAuthorized, protocolName }: LockdownScreenProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanLines, setScanLines] = useState<number[]>([]);
  const [threatLevel, setThreatLevel] = useState(85);
  const [systemMessages, setSystemMessages] = useState<string[]>([]);

  useEffect(() => {
    // Generate random scan lines
    const lines: number[] = [];
    for (let i = 0; i < 8; i++) {
      lines.push(Math.random() * 100);
    }
    setScanLines(lines);

    // Add system messages over time
    const messages = [
      "CONTAINMENT BREACH DETECTED",
      "SECURITY PERIMETER COMPROMISED",
      "LOCKDOWN PROTOCOL ACTIVATED",
      "AWAITING AUTHORIZATION...",
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => {
        setSystemMessages(prev => [...prev, msg]);
      }, i * 800);
    });

    // Fluctuate threat level
    const threatInterval = setInterval(() => {
      setThreatLevel(prev => Math.min(99, Math.max(70, prev + (Math.random() - 0.5) * 10)));
    }, 2000);

    return () => clearInterval(threatInterval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!password) {
      setError("Authorization code required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const adminData = localStorage.getItem("urbanshade_admin");
      
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (!admin.password || password === admin.password) {
          onAuthorized();
        } else {
          setError("AUTHORIZATION DENIED - Invalid credentials");
          setLoading(false);
        }
      } else {
        // No password set - allow access
        onAuthorized();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, hsl(0 50% 5%), hsl(0 40% 8%), hsl(0 50% 5%))
          `
        }}
      />

      {/* Scan Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {scanLines.map((pos, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-red-500"
            style={{
              top: `${pos}%`,
              animation: `scanline ${3 + i * 0.5}s linear infinite`,
              opacity: 0.5 + Math.random() * 0.5
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(239, 68, 68, 0.3) 25%, rgba(239, 68, 68, 0.3) 26%, transparent 27%, transparent 74%, rgba(239, 68, 68, 0.3) 75%, rgba(239, 68, 68, 0.3) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(239, 68, 68, 0.3) 25%, rgba(239, 68, 68, 0.3) 26%, transparent 27%, transparent 74%, rgba(239, 68, 68, 0.3) 75%, rgba(239, 68, 68, 0.3) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        {/* Header Warning Bar */}
        <div className="absolute top-0 left-0 right-0 bg-red-900/80 border-b-2 border-red-500 py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="font-bold text-red-400 tracking-wider text-sm">SECURITY LOCKDOWN ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-red-400">EMERGENCY BROADCAST</span>
            </div>
            <div className="text-red-500">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Central Panel */}
        <div className="w-full max-w-2xl">
          {/* Protocol Badge */}
          <div className="flex justify-center mb-6">
            <div className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
              <span className="text-red-400 font-mono text-sm tracking-wider">
                PROTOCOL: {protocolName}
              </span>
            </div>
          </div>

          {/* Shield Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative p-8 rounded-full border-2 border-red-500/50 bg-gradient-to-br from-red-900/50 to-red-950/80">
                <Shield className="w-20 h-20 text-red-500" />
              </div>
              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                <Lock className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-red-400" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <Eye className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 text-red-400" />
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 text-center">
              <Scan className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-xs text-red-400/70 mb-1">THREAT LEVEL</div>
              <div className="text-2xl font-bold text-red-500">{threatLevel.toFixed(0)}%</div>
            </div>
            <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 text-center">
              <Waves className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-xs text-red-400/70 mb-1">PRESSURE</div>
              <div className="text-2xl font-bold text-red-500">8,247</div>
              <div className="text-xs text-red-400/50">PSI</div>
            </div>
            <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500 animate-pulse" />
              <div className="text-xs text-red-400/70 mb-1">POWER</div>
              <div className="text-2xl font-bold text-yellow-500">BACKUP</div>
            </div>
          </div>

          {/* Terminal Messages */}
          <div className="bg-black/60 border border-red-500/30 rounded-lg p-4 mb-6 font-mono text-xs max-h-32 overflow-y-auto">
            {systemMessages.map((msg, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <span className="text-red-600">[{String(i).padStart(2, '0')}]</span>
                <Terminal className="w-3 h-3 text-red-500" />
                <span className={i === systemMessages.length - 1 ? "text-red-400 animate-pulse" : "text-red-500/70"}>
                  {msg}
                </span>
              </div>
            ))}
            <span className="text-red-500 animate-pulse">█</span>
          </div>

          {/* Authorization Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-black/60 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <KeyRound className="w-5 h-5 text-red-500" />
                <span className="font-bold text-red-400">ADMINISTRATOR OVERRIDE REQUIRED</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-red-400/70 mb-2 font-mono">
                    ENTER AUTHORIZATION CODE
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/60 border-red-500/30 text-red-100 placeholder:text-red-500/30 focus:border-red-500 font-mono tracking-wider"
                    placeholder="••••••••••••"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 rounded bg-red-500/20 border border-red-500/40 text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white border border-red-500 font-bold tracking-wider"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      VERIFYING...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      DEACTIVATE LOCKDOWN
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-red-500/50 font-mono">
            <div>URBANSHADE SECURITY SYSTEM v3.2.1</div>
            <div className="mt-1">ALL ACCESS ATTEMPTS LOGGED AND MONITORED</div>
          </div>
        </div>

        {/* Bottom Warning Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-red-900/60 border-t border-red-500/50 py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-red-400 text-xs font-mono">
            ⚠️ SECURITY LOCKDOWN IN EFFECT — ALL PERSONNEL REPORT TO DESIGNATED SAFE ZONES — 
            CONTAINMENT BREACH PROTOCOL ACTIVE — AWAIT FURTHER INSTRUCTIONS — 
            ⚠️ SECURITY LOCKDOWN IN EFFECT — ALL PERSONNEL REPORT TO DESIGNATED SAFE ZONES — 
            CONTAINMENT BREACH PROTOCOL ACTIVE — AWAIT FURTHER INSTRUCTIONS —
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
