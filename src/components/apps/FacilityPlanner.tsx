import { useState, useEffect, useRef } from "react";
import { Grid3x3, Plus, Trash2, Move, Save, FolderOpen, Settings, Route, Pen, Eraser, Square, ZoomIn, ZoomOut, Maximize2, Link } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";
import { RoomEditor } from "./RoomEditor";
import { HallwayTool } from "./HallwayTool";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PlannerRoom {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sections: any[];
  doors: any[];
  connections: string[];
}

interface HallwayPoint {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface HallwaySettings {
  autoGenerate: boolean;
  hallwayWidth: number;
}

export const FacilityPlanner = () => {
  const [rooms, setRooms] = useState<PlannerRoom[]>(() => loadState('facility_planner_rooms', []));
  const [editingRoom, setEditingRoom] = useState<PlannerRoom | null>(null);
  const [hallwayMode, setHallwayMode] = useState(false);
  const [hallwayPoints, setHallwayPoints] = useState<HallwayPoint[]>([]);
  const [clickCount, setClickCount] = useState<{ [key: string]: number }>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [drawColor, setDrawColor] = useState("#00d9ff");
  const [drawWidth, setDrawWidth] = useState(3);
  const [eraserMode, setEraserMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(() => loadState('facility_planner_snap', true));
  const [showConnections, setShowConnections] = useState(() => loadState('facility_planner_connections', true));
  const [selectedRoomForConnect, setSelectedRoomForConnect] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveState('facility_planner_rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    saveState('facility_planner_snap', snapToGrid);
  }, [snapToGrid]);

  useEffect(() => {
    saveState('facility_planner_connections', showConnections);
  }, [showConnections]);

  const snapValue = (val: number) => snapToGrid ? Math.round(val / 20) * 20 : val;

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
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

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const toggleConnection = (roomId: string) => {
    if (!selectedRoomForConnect) {
      setSelectedRoomForConnect(roomId);
      toast.info("Select another room to connect");
    } else {
      if (selectedRoomForConnect === roomId) {
        setSelectedRoomForConnect(null);
        return;
      }
      setRooms(rooms.map(r => {
        if (r.id === selectedRoomForConnect && !r.connections.includes(roomId)) {
          return { ...r, connections: [...r.connections, roomId] };
        }
        if (r.id === roomId && !r.connections.includes(selectedRoomForConnect)) {
          return { ...r, connections: [...r.connections, selectedRoomForConnect] };
        }
        return r;
      }));
      setSelectedRoomForConnect(null);
      toast.success("Rooms connected");
    }
  };

  const handleRoomClick = (room: PlannerRoom) => {
    const key = room.id;
    const count = (clickCount[key] || 0) + 1;
    setClickCount({ ...clickCount, [key]: count });
    if (count === 2) {
      setEditingRoom(room);
      setClickCount({});
    }
    setTimeout(() => setClickCount(prev => ({ ...prev, [key]: 0 })), 500);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hallwayMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = snapValue((e.clientX - rect.left - pan.x) / zoom);
    const y = snapValue((e.clientY - rect.top - pan.y) / zoom);
    setHallwayPoints([...hallwayPoints, { x, y }]);
  };

  const completeHallway = () => {
    if (hallwayPoints.length < 2) return toast.error("Need at least 2 points");
    for (let i = 0; i < hallwayPoints.length - 1; i++) {
      const [p1, p2] = [hallwayPoints[i], hallwayPoints[i + 1]];
      setRooms(prev => [...prev, {
        id: `hallway-${Date.now()}-${i}`, name: "Hallway", type: "corridor",
        x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y),
        width: Math.abs(p2.x - p1.x) || 40, height: Math.abs(p2.y - p1.y) || 40,
        sections: [], doors: [], connections: []
      }]);
    }
    setHallwayPoints([]);
    setHallwayMode(false);
    toast.success("Hallway created");
  };

  const addRoom = (type: string) => {
    const x = snapValue(100);
    const y = snapValue(100);
    setRooms([...rooms, {
      id: `room-${Date.now()}`, name: `${type} ${rooms.length + 1}`, type,
      x, y, width: 120, height: 80,
      sections: [], doors: [], connections: []
    }]);
    toast.success("Room added - double-click to edit");
  };

  const getRoomCenter = (room: PlannerRoom) => ({
    x: room.x + room.width / 2,
    y: room.y + room.height / 2
  });

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex gap-2 flex-wrap items-center">
        <Button onClick={() => addRoom("control")} size="sm"><Plus className="w-4 h-4 mr-1" />Control</Button>
        <Button onClick={() => addRoom("research")} size="sm"><Plus className="w-4 h-4 mr-1" />Research</Button>
        <Button onClick={() => addRoom("containment")} size="sm"><Plus className="w-4 h-4 mr-1" />Containment</Button>
        <Button onClick={() => { setHallwayMode(true); toast.info("Click points to create hallway"); }} size="sm" variant={hallwayMode ? "default" : "outline"}>
          <Route className="w-4 h-4 mr-1" />Hallway Tool
        </Button>
        <div className="h-6 w-px bg-border mx-2" />
        <Button onClick={() => handleZoom(0.1)} size="sm" variant="outline"><ZoomIn className="w-4 h-4" /></Button>
        <Button onClick={() => handleZoom(-0.1)} size="sm" variant="outline"><ZoomOut className="w-4 h-4" /></Button>
        <Button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} size="sm" variant="outline"><Maximize2 className="w-4 h-4" /></Button>
        <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
        <div className="h-6 w-px bg-border mx-2" />
        <div className="flex items-center gap-2">
          <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} id="snap" />
          <Label htmlFor="snap" className="text-xs cursor-pointer">Snap to Grid</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={showConnections} onCheckedChange={setShowConnections} id="connections" />
          <Label htmlFor="connections" className="text-xs cursor-pointer">Show Connections</Label>
        </div>
      </div>
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-move" 
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, hsl(var(--border)) 19px, hsl(var(--border)) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, hsl(var(--border)) 19px, hsl(var(--border)) 20px)' }} 
        onClick={handleCanvasClick}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
          {showConnections && rooms.map(room => 
            room.connections.map(connId => {
              const targetRoom = rooms.find(r => r.id === connId);
              if (!targetRoom || connId < room.id) return null;
              const c1 = getRoomCenter(room);
              const c2 = getRoomCenter(targetRoom);
              return (
                <svg key={`${room.id}-${connId}`} className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <line x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                </svg>
              );
            })
          )}
          {rooms.map(room => (
            <div 
              key={room.id} 
              className={`absolute border-2 cursor-pointer transition-colors ${selectedRoomForConnect === room.id ? 'border-accent bg-accent/20' : 'border-primary bg-primary/10 hover:bg-primary/20'}`}
              style={{ left: room.x, top: room.y, width: room.width, height: room.height }}
              onClick={(e) => { e.stopPropagation(); handleRoomClick(room); }}
              onContextMenu={(e) => { e.preventDefault(); toggleConnection(room.id); }}
            >
              <div className="p-2 text-xs font-semibold">{room.name}</div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); toggleConnection(room.id); }}
              >
                <Link className="w-3 h-3" />
              </Button>
            </div>
          ))}
          {hallwayPoints.map((point, i) => (
            <div key={i} className="absolute w-3 h-3 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" style={{ left: point.x, top: point.y }} />
          ))}
        </div>
      </div>
      {hallwayMode && <HallwayTool points={hallwayPoints} onAddPoint={() => {}} onComplete={completeHallway} onCancel={() => { setHallwayMode(false); setHallwayPoints([]); }} />}
      <RoomEditor room={editingRoom} open={!!editingRoom} onClose={() => setEditingRoom(null)} onSave={(updated) => setRooms(rooms.map(r => r.id === updated.id ? updated : r))} />
    </div>
  );
};
