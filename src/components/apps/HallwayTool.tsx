import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HallwayPoint {
  x: number;
  y: number;
}

interface HallwayToolProps {
  points: HallwayPoint[];
  onAddPoint: (point: HallwayPoint) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const HallwayTool = ({ points, onAddPoint, onComplete, onCancel }: HallwayToolProps) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[5000] bg-background/95 backdrop-blur border border-primary/50 rounded-lg p-4 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span className="font-semibold">Hallway Tool Active</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Points: {points.length}</span>
          {points.length > 0 && (
            <span className="text-primary">
              Click to add next point {points.length === 1 && "(straight or 45° diagonal)"}
            </span>
          )}
          {points.length === 0 && (
            <span className="text-muted-foreground">Click to place first point</span>
          )}
        </div>
        
        <div className="flex gap-2">
          {points.length >= 2 && (
            <Button
              size="sm"
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Complete
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {points.length >= 1 && "Hallways can be straight (horizontal/vertical) or diagonal (45°)"}
        {points.length === 0 && "Click anywhere on the canvas to start placing your hallway"}
      </div>
    </div>
  );
};