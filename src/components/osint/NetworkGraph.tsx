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
          <h3 className="text-2xl font-bold text-chrome">Entity Relationship Graph</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize connections between domains, IPs, and infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="chrome-button text-foreground hover:glow-primary transition-all">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" className="chrome-button text-foreground hover:glow-primary transition-all">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" className="chrome-button text-foreground hover:glow-primary transition-all">
            <Maximize className="w-4 h-4" />
          </Button>
          <Button size="sm" className="chrome-button text-foreground hover:glow-primary transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="glass-card shadow-glow">
        <div className="p-6">
          {/* Graph visualization placeholder */}
          <div className="relative w-full h-[600px] bg-steel-900/50 rounded-lg border border-steel-600/30 overflow-hidden backdrop-blur-sm">
            {/* Grid background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Network className="w-16 h-16 text-primary mx-auto" />
                  <div className="absolute inset-0 blur-xl bg-primary/30 animate-glow-pulse"></div>
                </div>
                <p className="text-foreground mb-2 font-semibold">Network Graph Visualization</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive entity relationship mapping powered by D3.js
                </p>
                <div className="flex gap-2 justify-center">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 backdrop-blur-sm">50 Nodes</Badge>
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 backdrop-blur-sm">120 Connections</Badge>
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 backdrop-blur-sm">8 Clusters</Badge>
                </div>
              </div>
            </div>

            {/* Simulated graph elements */}
            <svg className="w-full h-full opacity-30">
              <defs>
                <radialGradient id="nodeGradient">
                  <stop offset="0%" stopColor="hsl(195 85% 60%)" />
                  <stop offset="100%" stopColor="hsl(210 70% 55%)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Connection lines */}
              <line x1="200" y1="150" x2="400" y2="200" stroke="hsl(195 85% 60%)" strokeWidth="2" opacity="0.5" />
              <line x1="400" y1="200" x2="600" y2="150" stroke="hsl(195 85% 60%)" strokeWidth="2" opacity="0.5" />
              <line x1="200" y1="150" x2="300" y2="400" stroke="hsl(195 85% 60%)" strokeWidth="2" opacity="0.5" />
              <line x1="600" y1="150" x2="700" y2="350" stroke="hsl(195 85% 60%)" strokeWidth="2" opacity="0.5" />
              <line x1="400" y1="200" x2="500" y2="380" stroke="hsl(195 85% 60%)" strokeWidth="2" opacity="0.5" />
              
              {/* Nodes with glow effect */}
              <circle cx="200" cy="150" r="20" fill="url(#nodeGradient)" filter="url(#glow)" />
              <circle cx="400" cy="200" r="25" fill="url(#nodeGradient)" filter="url(#glow)" />
              <circle cx="600" cy="150" r="20" fill="url(#nodeGradient)" filter="url(#glow)" />
              <circle cx="300" cy="400" r="15" fill="url(#nodeGradient)" filter="url(#glow)" />
              <circle cx="700" cy="350" r="18" fill="url(#nodeGradient)" filter="url(#glow)" />
              <circle cx="500" cy="380" r="16" fill="url(#nodeGradient)" filter="url(#glow)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card">
        <div className="p-4">
          <p className="text-sm font-semibold mb-3 text-foreground">Legend</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary shadow-glow"></div>
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
      </div>
    </div>
  );
};
