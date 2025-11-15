import { useState } from "react";
import { Upload, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ImageViewer = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        toast.success("Image loaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImageUrl(url);
      toast.success("Image loaded");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex gap-2 p-3 border-b border-border">
        <Button size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button size="sm" onClick={handleUrlInput}>
          <Download className="w-4 h-4 mr-2" />
          From URL
        </Button>
        <div className="flex-1" />
        <Button size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))} disabled={!imageUrl}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground px-2 flex items-center">{zoom}%</span>
        <Button size="sm" onClick={() => setZoom(Math.min(400, zoom + 25))} disabled={!imageUrl}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={() => setRotation((rotation + 90) % 360)} disabled={!imageUrl}>
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Viewer"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.3s ease",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-mono">No image loaded</p>
            <p className="text-xs mt-2">Upload an image or load from URL</p>
          </div>
        )}
      </div>
    </div>
  );
};
