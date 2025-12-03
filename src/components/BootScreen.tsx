import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface BootScreenProps {
  onComplete: () => void;
  onSafeMode?: () => void;
}

export const BootScreen = ({ onComplete, onSafeMode }: BootScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [showSafeModePrompt, setShowSafeModePrompt] = useState(true);
  const [safeModeCountdown, setSafeModeCountdown] = useState(3);
  const [progress, setProgress] = useState(0);

  const bootMessages = [
    { text: "Urbanshade Hadal Blacksite BIOS v3.7.2-HADAL", duration: 200 },
    { text: "Copyright (C) 2024 Urbanshade Corporation. All Rights Reserved.", duration: 100 },
    { text: "", duration: 50 },
    { text: "Initializing Hadal Processing Unit...", duration: 300 },
    { text: "CPU: HPU-8000 Series @ 8 cores [OK]", duration: 200 },
    { text: "RAM: 64GB ECC DDR5 @ 8247m depth - Testing... [OK]", duration: 400 },
    { text: "Cache: L1=512KB L2=16MB L3=64MB [OK]", duration: 150 },
    { text: "", duration: 50 },
    { text: "Detecting hardware...", duration: 250 },
    { text: "Primary storage: 2TB NVMe SSD RAID-10 [OK]", duration: 300 },
    { text: "Secondary storage: 8TB HDD Array (Research Data) [OK]", duration: 350 },
    { text: "Pressure sensors: 24/24 online [OK]", duration: 200 },
    { text: "Hull integrity monitors: Active [OK]", duration: 150 },
    { text: "Biometric scanners: 12/12 operational [OK]", duration: 200 },
    { text: "", duration: 50 },
    { text: "Loading kernel modules:", duration: 200 },
    { text: "  * containment_core.ko", duration: 250 },
    { text: "  * pressure_monitor.ko", duration: 200 },
    { text: "  * specimen_tracking.ko", duration: 300 },
    { text: "  * emergency_protocols.ko", duration: 200 },
    { text: "  * life_support.ko", duration: 250 },
    { text: "", duration: 50 },
    { text: "Mounting filesystems:", duration: 200 },
    { text: "  /dev/sda1 on / type ext4 (rw,relatime) [OK]", duration: 300 },
    { text: "  /dev/sdb1 on /data/research type ext4 (rw,noexec) [OK]", duration: 350 },
    { text: "  /dev/sdc1 on /data/specimens type ext4 (rw,encrypted) [OK]", duration: 400 },
    { text: "  /dev/sdd1 on /data/containment type ext4 (rw,encrypted,classified) [OK]", duration: 350 },
    { text: "", duration: 50 },
    { text: "Starting system services:", duration: 200 },
    { text: "  [ OK ] systemd-udevd.service - Device Manager Daemon", duration: 150 },
    { text: "  [ OK ] network.service - Network Manager", duration: 250 },
    { text: "  [ OK ] postgresql.service - Database Service", duration: 350 },
    { text: "  [ OK ] containment.service - Containment Monitor", duration: 200 },
    { text: "  [ WARN ] pressure-zone4.service - Zone 4 Pressure Monitor (elevated readings)", duration: 300 },
    { text: "  [ OK ] life-support.service - Life Support Systems", duration: 200 },
    { text: "  [ OK ] power-grid.service - Power Distribution", duration: 250 },
    { text: "  [ OK ] auth.service - Authentication Service", duration: 150 },
    { text: "  [ OK ] tracking.service - Personnel Tracking", duration: 200 },
    { text: "  [ WARN ] specimen-z13.service - Z-13 Monitor (increased activity)", duration: 300 },
    { text: "  [ OK ] emergency.service - Emergency Protocols", duration: 200 },
    { text: "  [ OK ] biometric.service - Biometric Access Control", duration: 200 },
    { text: "  [ FAIL ] terminal-t07.service - Terminal T-07 (connection timeout)", duration: 250 },
    { text: "  [ WARN ] camera-c12.service - Security Camera C-12 (no signal)", duration: 300 },
    { text: "", duration: 100 },
    { text: "System checks:", duration: 150 },
    { text: "  Depth: 8,247 meters [NOMINAL]", duration: 150 },
    { text: "  External pressure: 8,247 PSI [STABLE]", duration: 200 },
    { text: "  Hull integrity: 98.7% [ACCEPTABLE]", duration: 200 },
    { text: "  Power grid: STABLE (auxiliary ready)", duration: 200 },
    { text: "  Oxygen levels: 21% [NORMAL]", duration: 150 },
    { text: "  Temperature: 4.1°C [OPTIMAL]", duration: 200 },
    { text: "", duration: 100 },
    { text: "Loading display manager...", duration: 250 },
    { text: "Starting Urbanshade Desktop Environment v2.4", duration: 300 },
    { text: "", duration: 150 },
  ];

  // Safe mode countdown
  useEffect(() => {
    if (!showSafeModePrompt) return;
    
    const interval = setInterval(() => {
      setSafeModeCountdown(prev => {
        if (prev <= 1) {
          setShowSafeModePrompt(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F8' && showSafeModePrompt) {
        setShowSafeModePrompt(false);
        onSafeMode?.();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showSafeModePrompt, onSafeMode]);

  useEffect(() => {
    if (showSafeModePrompt) return;

    let currentIndex = 0;
    
    const showNextMessage = () => {
      if (currentIndex < bootMessages.length) {
        const item = bootMessages[currentIndex];
        if (item) {
          setMessages(prev => [...prev, item.text || ""]);
          setProgress(((currentIndex + 1) / bootMessages.length) * 100);
          const duration = item.duration || 200;
          currentIndex++;
          setTimeout(showNextMessage, duration);
        } else {
          currentIndex++;
          setTimeout(showNextMessage, 50);
        }
      } else {
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    showNextMessage();
  }, [onComplete, showSafeModePrompt]);

  if (showSafeModePrompt) {
    return (
      <div className="fixed inset-0 bg-black text-primary font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold animate-pulse">URBANSHADE OS</div>
          <div className="text-sm">
            Press <kbd className="px-3 py-1 bg-primary/20 rounded text-primary font-bold">F8</kbd> for Safe Mode
          </div>
          <div className="text-xs text-muted-foreground">
            Booting normally in {safeModeCountdown}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-primary font-mono flex flex-col">
      {/* Boot messages area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-0 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg?.includes('WARN') ? 'text-yellow-500' :
                msg?.includes('FAIL') ? 'text-red-500' :
                msg?.includes('OK') ? 'text-primary' :
                'text-muted-foreground'
              }`}
            >
              {msg || ''}
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress bar at bottom */}
      <div className="p-6 border-t border-primary/20 bg-black/50">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Loading Urbanshade OS...</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-primary/20" />
        </div>
      </div>
    </div>
  );
};
