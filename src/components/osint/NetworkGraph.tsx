import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Download
} from "lucide-react";

export const NetworkGraph = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Entity Relationship Graph</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize connections between domains, IPs, and infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-primary/50">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-primary/50">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-primary/50">
            <Maximize className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-primary/50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border shadow-glow">
        <div className="p-6">
          {/* Graph visualization placeholder */}
          <div className="relative w-full h-[600px] bg-background/50 rounded-lg border border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Network className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">Network Graph Visualization</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive entity relationship mapping powered by D3.js
                </p>
                <div className="flex gap-2 justify-center">
                  <Badge variant="outline" className="border-primary/30">50 Nodes</Badge>
                  <Badge variant="outline" className="border-primary/30">120 Connections</Badge>
                  <Badge variant="outline" className="border-primary/30">8 Clusters</Badge>
                </div>
              </div>
            </div>

            {/* Simulated graph elements */}
            <svg className="w-full h-full opacity-20">
              <defs>
                <radialGradient id="nodeGradient">
                  <stop offset="0%" stopColor="hsl(190 95% 55%)" />
                  <stop offset="100%" stopColor="hsl(270 70% 60%)" />
                </radialGradient>
              </defs>
              
              {/* Connection lines */}
              <line x1="200" y1="150" x2="400" y2="200" stroke="hsl(190 95% 55%)" strokeWidth="2" opacity="0.3" />
              <line x1="400" y1="200" x2="600" y2="150" stroke="hsl(190 95% 55%)" strokeWidth="2" opacity="0.3" />
              <line x1="200" y1="150" x2="300" y2="400" stroke="hsl(190 95% 55%)" strokeWidth="2" opacity="0.3" />
              <line x1="600" y1="150" x2="700" y2="350" stroke="hsl(190 95% 55%)" strokeWidth="2" opacity="0.3" />
              
              {/* Nodes */}
              <circle cx="200" cy="150" r="20" fill="url(#nodeGradient)" />
              <circle cx="400" cy="200" r="25" fill="url(#nodeGradient)" />
              <circle cx="600" cy="150" r="20" fill="url(#nodeGradient)" />
              <circle cx="300" cy="400" r="15" fill="url(#nodeGradient)" />
              <circle cx="700" cy="350" r="18" fill="url(#nodeGradient)" />
            </svg>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="bg-card border-border">
        <div className="p-4">
          <p className="text-sm font-semibold mb-3">Legend</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Domain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-warning"></div>
              <span className="text-sm text-muted-foreground">IP Address</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive"></div>
              <span className="text-sm text-muted-foreground">Threat Actor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">Verified Safe</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
