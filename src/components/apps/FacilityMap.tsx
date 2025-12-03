import { useState, useEffect, useRef } from "react";
import { MapPin, AlertTriangle, CheckCircle, XCircle, Users, Activity, ZoomIn, ZoomOut, RotateCcw, Move, Eye, Radio, Thermometer, Droplets, Wind, Shield, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  type: "control" | "research" | "containment" | "storage" | "medical" | "engineering" | "corridor";
  status: "operational" | "warning" | "critical" | "offline";
  personnel: number;
  x: number;
  y: number;
  width: number;
  height: number;
  connections: string[];
  temperature?: number;
  humidity?: number;
  pressure?: number;
}

export const FacilityMap = () => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const importedData = localStorage.getItem('facility_map_import');
    if (importedData) {
      localStorage.removeItem('facility_map_import');
      toast.success("Design imported from Facility Planner!");
      return JSON.parse(importedData);
    }
    return [
      { id: "control", name: "Control Room", type: "control", status: "operational", personnel: 3, x: 300, y: 40, width: 140, height: 90, connections: ["corridor-1", "server"], temperature: 22, humidity: 45, pressure: 8247 },
      { id: "server", name: "Server Bay", type: "storage", status: "operational", personnel: 0, x: 500, y: 40, width: 120, height: 90, connections: ["control", "corridor-2"], temperature: 18, humidity: 30, pressure: 8247 },
      { id: "corridor-1", name: "Corridor A", type: "corridor", status: "operational", personnel: 0, x: 200, y: 150, width: 320, height: 50, connections: ["control", "corridor-3", "research-a"] },
      { id: "corridor-2", name: "Corridor B", type: "corridor", status: "operational", personnel: 0, x: 520, y: 150, width: 160, height: 50, connections: ["server", "medical", "corridor-3"] },
      { id: "corridor-3", name: "Main Corridor", type: "corridor", status: "operational", personnel: 1, x: 80, y: 250, width: 600, height: 50, connections: ["corridor-1", "corridor-2", "research-a", "research-b", "containment", "engineering"] },
      { id: "research-a", name: "Research Lab A", type: "research", status: "operational", personnel: 2, x: 80, y: 350, width: 160, height: 110, connections: ["corridor-1", "corridor-3", "corridor-4"], temperature: 21, humidity: 50, pressure: 8247 },
      { id: "research-b", name: "Research Lab B", type: "research", status: "warning", personnel: 1, x: 280, y: 350, width: 160, height: 110, connections: ["corridor-3", "containment", "corridor-4"], temperature: 23, humidity: 55, pressure: 8250 },
      { id: "containment", name: "Containment Zone", type: "containment", status: "critical", personnel: 4, x: 480, y: 350, width: 200, height: 110, connections: ["corridor-3", "research-b", "storage"], temperature: 19, humidity: 40, pressure: 8260 },
      { id: "corridor-4", name: "Corridor C", type: "corridor", status: "operational", personnel: 0, x: 80, y: 500, width: 400, height: 50, connections: ["research-a", "research-b", "medical", "engineering"] },
      { id: "medical", name: "Medical Bay", type: "medical", status: "operational", personnel: 1, x: 520, y: 500, width: 160, height: 90, connections: ["corridor-2", "corridor-4"], temperature: 22, humidity: 45, pressure: 8247 },
      { id: "engineering", name: "Engineering", type: "engineering", status: "operational", personnel: 3, x: 80, y: 600, width: 180, height: 110, connections: ["corridor-3", "corridor-4", "storage"], temperature: 25, humidity: 35, pressure: 8245 },
      { id: "storage", name: "Storage Facility", type: "storage", status: "offline", personnel: 0, x: 320, y: 600, width: 360, height: 110, connections: ["containment", "engineering"], temperature: 15, humidity: 25, pressure: 8247 },
    ];
  });

  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [entityEscaped, setEntityEscaped] = useState(false);
  const [entityPosition, setEntityPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState<"none" | "heat" | "personnel" | "status">("none");
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkForEscape = () => {
      if (Math.random() < 0.01) {
        setEntityEscaped(true);
        setEntityPosition({
          x: 530 + Math.random() * 100,
          y: 380 + Math.random() * 50
        });
        setRooms(prev => prev.map(r => 
          r.id === "containment" ? { ...r, status: "critical" } : r
        ));
        toast.error("🚨 CONTAINMENT BREACH DETECTED!", { duration: 10000 });
      }
    };
    const interval = setInterval(checkForEscape, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handlePanEnd = () => setIsPanning(false);

  const getStatusColor = (status: string, forOverlay = false) => {
    const colors = {
      operational: forOverlay ? "rgba(0, 217, 255, 0.4)" : "bg-primary/30 border-primary",
      warning: forOverlay ? "rgba(234, 179, 8, 0.4)" : "bg-yellow-500/30 border-yellow-500",
      critical: forOverlay ? "rgba(239, 68, 68, 0.5)" : "bg-destructive/30 border-destructive",
      offline: forOverlay ? "rgba(100, 100, 100, 0.3)" : "bg-muted/30 border-muted-foreground",
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="w-4 h-4 text-primary" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "critical": return <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />;
      case "offline": return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getHeatColor = (temp?: number) => {
    if (!temp) return "rgba(100, 100, 100, 0.3)";
    if (temp < 18) return "rgba(59, 130, 246, 0.5)";
    if (temp < 22) return "rgba(34, 197, 94, 0.4)";
    if (temp < 25) return "rgba(234, 179, 8, 0.4)";
    return "rgba(239, 68, 68, 0.5)";
  };

  const getPersonnelColor = (count: number) => {
    if (count === 0) return "rgba(100, 100, 100, 0.2)";
    if (count < 2) return "rgba(0, 217, 255, 0.3)";
    if (count < 4) return "rgba(34, 197, 94, 0.4)";
    return "rgba(234, 179, 8, 0.5)";
  };

  const getRoomOverlayColor = (room: Room) => {
    switch (showOverlay) {
      case "heat": return getHeatColor(room.temperature);
      case "personnel": return getPersonnelColor(room.personnel);
      case "status": return getStatusColor(room.status, true);
      default: return undefined;
    }
  };

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    const processed = new Set<string>();

    rooms.forEach(room => {
      room.connections.forEach(connId => {
        const connRoom = rooms.find(r => r.id === connId);
        if (connRoom) {
          const key = [room.id, connRoom.id].sort().join("-");
          if (!processed.has(key)) {
            processed.add(key);
            connections.push(
              <line
                key={key}
                x1={room.x + room.width / 2}
                y1={room.y + room.height / 2}
                x2={connRoom.x + connRoom.width / 2}
                y2={connRoom.y + connRoom.height / 2}
                stroke="rgba(0, 217, 255, 0.15)"
                strokeWidth="2"
                strokeDasharray="8,4"
              />
            );
          }
        }
      });
    });
    return connections;
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(rooms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facility-map-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Map exported!");
  };

  const totalPersonnel = rooms.reduce((sum, r) => sum + r.personnel, 0);
  const criticalRooms = rooms.filter(r => r.status === "critical").length;
  const warningRooms = rooms.filter(r => r.status === "warning").length;

  return (
    <div className="flex h-full bg-background">
      {/* Map View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border bg-muted/30 p-3 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-bold">FACILITY SCHEMATIC</h2>
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={showOverlay === "none" ? "default" : "outline"}
              onClick={() => setShowOverlay("none")}
            >
              <Eye className="w-4 h-4 mr-1" />
              Default
            </Button>
            <Button
              size="sm"
              variant={showOverlay === "heat" ? "default" : "outline"}
              onClick={() => setShowOverlay("heat")}
            >
              <Thermometer className="w-4 h-4 mr-1" />
              Thermal
            </Button>
            <Button
              size="sm"
              variant={showOverlay === "personnel" ? "default" : "outline"}
              onClick={() => setShowOverlay("personnel")}
            >
              <Users className="w-4 h-4 mr-1" />
              Personnel
            </Button>
            <Button
              size="sm"
              variant={showOverlay === "status" ? "default" : "outline"}
              onClick={() => setShowOverlay("status")}
            >
              <Shield className="w-4 h-4 mr-1" />
              Status
            </Button>
          </div>

          <div className="flex gap-1 ml-auto">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleZoom(0.1)}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleZoom(-0.1)}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-b border-border bg-black/40 px-4 py-2 flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Personnel:</span>
            <span className="font-bold text-primary">{totalPersonnel}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-muted-foreground">Critical:</span>
            <span className="font-bold text-destructive">{criticalRooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">Warnings:</span>
            <span className="font-bold text-yellow-500">{warningRooms}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-primary font-mono">DEPTH: 8,247m</span>
          </div>
        </div>

        {/* Map Canvas */}
        <div 
          ref={mapRef}
          className="flex-1 overflow-hidden relative bg-black/60"
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* Grid */}
            <div 
              className="absolute opacity-10 pointer-events-none"
              style={{
                width: '900px',
                height: '800px',
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.2) 25%, rgba(0, 217, 255, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.2) 75%, rgba(0, 217, 255, 0.2) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.2) 25%, rgba(0, 217, 255, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.2) 75%, rgba(0, 217, 255, 0.2) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '50px 50px'
              }}
            />

            {/* Connections */}
            <svg className="absolute pointer-events-none" style={{ width: '900px', height: '800px' }}>
              {renderConnections()}
            </svg>

            {/* Rooms */}
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`absolute cursor-pointer transition-all rounded-lg border-2 ${
                  showOverlay === "none" ? getStatusColor(room.status) : "border-white/20"
                } ${selectedRoom.id === room.id ? "ring-2 ring-white shadow-lg shadow-primary/30" : ""} 
                hover:brightness-125`}
                style={{
                  left: `${room.x}px`,
                  top: `${room.y}px`,
                  width: `${room.width}px`,
                  height: `${room.height}px`,
                  backgroundColor: getRoomOverlayColor(room) || undefined,
                }}
              >
                <div className="flex flex-col h-full justify-between p-2">
                  <div className="flex items-start justify-between gap-1">
                    {getStatusIcon(room.status)}
                    {room.personnel > 0 && (
                      <div className="flex items-center gap-1 text-xs bg-black/40 rounded px-1">
                        <Users className="w-3 h-3" />
                        <span>{room.personnel}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-bold leading-tight bg-black/40 rounded px-1 py-0.5 text-center">
                    {room.name}
                  </div>
                </div>
              </div>
            ))}

            {/* Entity */}
            {entityEscaped && (
              <div
                className="absolute w-10 h-10 bg-destructive rounded-full animate-pulse flex items-center justify-center text-2xl z-50"
                style={{
                  left: `${entityPosition.x}px`,
                  top: `${entityPosition.y}px`,
                  filter: "drop-shadow(0 0 15px rgba(239, 68, 68, 0.9))"
                }}
              >
                👁️
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-panel p-3 text-xs space-y-2 z-10">
            <div className="font-bold mb-2">LEGEND</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/30 border border-primary rounded" />
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-500 rounded" />
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive/30 border border-destructive rounded" />
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted/30 border border-muted-foreground rounded" />
              <span>Offline</span>
            </div>
          </div>

          {/* Controls hint */}
          <div className="absolute bottom-4 right-4 glass-panel px-3 py-2 text-xs text-muted-foreground z-10">
            <Move className="w-3 h-3 inline mr-1" />
            Shift+Drag to pan
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <div className="w-80 border-l border-border flex flex-col bg-black/20">
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(selectedRoom.status)}
            <h3 className="font-bold text-lg">{selectedRoom.name}</h3>
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            {selectedRoom.type.replace("-", " ")}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Status */}
            <div className="glass-panel p-3">
              <div className="text-xs text-muted-foreground mb-2">STATUS</div>
              <div className={`font-bold uppercase text-lg ${
                selectedRoom.status === "operational" ? "text-primary" :
                selectedRoom.status === "warning" ? "text-yellow-500" :
                selectedRoom.status === "critical" ? "text-destructive" :
                "text-muted-foreground"
              }`}>
                {selectedRoom.status}
              </div>
            </div>

            {/* Environmental */}
            {selectedRoom.temperature && (
              <div className="glass-panel p-3 space-y-3">
                <div className="text-xs text-muted-foreground">ENVIRONMENTAL</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <Thermometer className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-bold">{selectedRoom.temperature}°C</div>
                    <div className="text-xs text-muted-foreground">Temp</div>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <div className="text-sm font-bold">{selectedRoom.humidity}%</div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                  <div className="text-center">
                    <Wind className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <div className="text-sm font-bold">{selectedRoom.pressure}</div>
                    <div className="text-xs text-muted-foreground">PSI</div>
                  </div>
                </div>
              </div>
            )}

            {/* Personnel */}
            <div className="glass-panel p-3">
              <div className="text-xs text-muted-foreground mb-2">PERSONNEL</div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">{selectedRoom.personnel}</span>
                <span className="text-muted-foreground">active</span>
              </div>
            </div>

            {/* Connections */}
            <div className="glass-panel p-3">
              <div className="text-xs text-muted-foreground mb-2">CONNECTED AREAS</div>
              <div className="space-y-1">
                {selectedRoom.connections.map(connId => {
                  const connRoom = rooms.find(r => r.id === connId);
                  return connRoom ? (
                    <div 
                      key={connId}
                      onClick={() => setSelectedRoom(connRoom)}
                      className="text-xs p-2 bg-white/5 rounded hover:bg-primary/20 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span>{connRoom.name}</span>
                      {getStatusIcon(connRoom.status)}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Alerts */}
            {selectedRoom.status === "critical" && (
              <div className="glass-panel p-3 border-destructive/30 bg-destructive/10">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 animate-pulse" />
                  <div>
                    <div className="font-bold text-destructive mb-1">CRITICAL ALERT</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedRoom.type === "containment" 
                        ? "Containment breach detected. Z-13 specimen showing unusual behavior."
                        : "System malfunction. Immediate maintenance required."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedRoom.status === "warning" && (
              <div className="glass-panel p-3 border-yellow-500/30 bg-yellow-500/10">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-yellow-500 mb-1">WARNING</div>
                    <div className="text-xs text-muted-foreground">
                      Minor anomalies detected. Monitoring situation.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {entityEscaped && (
              <div className="glass-panel p-3 border-destructive/50 bg-destructive/20 animate-pulse">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <div className="font-bold text-destructive mb-1">🚨 ENTITY BREACH</div>
                    <div className="text-xs text-destructive/80">
                      Z-13 has escaped containment! Activate CODE-BLACK lockdown immediately!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
