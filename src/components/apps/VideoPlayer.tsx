import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const handleLoadVideo = () => {
    // Extract video ID from various YouTube URL formats
    let videoId = "";
    
    try {
      if (videoUrl.includes("youtube.com/watch?v=")) {
        videoId = videoUrl.split("v=")[1].split("&")[0];
      } else if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
      } else if (videoUrl.includes("youtube.com/embed/")) {
        videoId = videoUrl.split("embed/")[1].split("?")[0];
      } else {
        toast.error("Invalid YouTube URL");
        return;
      }
      
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      toast.success("Video loaded");
    } catch (e) {
      toast.error("Failed to load video");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background p-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Paste YouTube URL here..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLoadVideo()}
          className="flex-1"
        />
        <Button onClick={handleLoadVideo}>
          <Play className="w-4 h-4 mr-2" />
          Load
        </Button>
      </div>
      
      {embedUrl ? (
        <div className="flex-1 bg-black rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center text-muted-foreground">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-mono">No video loaded</p>
            <p className="text-xs mt-2">Paste a YouTube URL and click Load</p>
          </div>
        </div>
      )}
    </div>
  );
};
