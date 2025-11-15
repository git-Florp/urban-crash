import { useState } from "react";
import { FileText, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const PdfReader = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const handleLoadPdf = () => {
    if (pdfUrl.trim()) {
      setEmbedUrl(pdfUrl);
      toast.success("PDF loaded");
    } else {
      toast.error("Please enter a valid PDF URL");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background p-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter PDF URL..."
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLoadPdf()}
          className="flex-1"
        />
        <Button onClick={handleLoadPdf}>
          <FileText className="w-4 h-4 mr-2" />
          Load PDF
        </Button>
      </div>
      
      {embedUrl ? (
        <div className="flex-1 bg-muted rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            title="PDF Viewer"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-mono">No PDF loaded</p>
            <p className="text-xs mt-2">Enter a PDF URL to view documents</p>
          </div>
        </div>
      )}
    </div>
  );
};
