import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThreatFeed } from "@/hooks/useThreatFeed";
import { 
  AlertTriangle, 
  Shield, 
  Activity,
  ExternalLink,
  RefreshCw,
  Loader2
} from "lucide-react";

export const ThreatFeed = () => {
  const { threats, summary, isLoading, refetch } = useThreatFeed();

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-chrome">Real-Time Threat Intelligence</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Live feed from global threat intelligence sources
          </p>
        </div>
        <Button 
          onClick={() => refetch('all', 50)}
          disabled={isLoading}
          className="chrome-button text-foreground hover:glow-primary transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Loading...' : 'Refresh Feed'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card border-l-4 border-l-destructive">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-3xl font-bold text-destructive">{summary?.critical || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive opacity-40" />
            </div>
          </div>
        </div>

        <div className="glass-card border-l-4 border-l-warning">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="text-3xl font-bold text-warning">{summary?.high || 0}</p>
              </div>
              <Shield className="w-8 h-8 text-warning opacity-40" />
            </div>
          </div>
        </div>

        <div className="glass-card border-l-4 border-l-info">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Threats</p>
                <p className="text-3xl font-bold text-info">{summary?.total || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-info opacity-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <ScrollArea className="h-[600px]">
          <div className="p-6 space-y-4">
            {isLoading && threats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading threat intelligence...</p>
              </div>
            ) : threats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Shield className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No threats found. Click refresh to load.</p>
              </div>
            ) : (
              threats.map((threat) => (
                <div 
                  key={threat.id} 
                  className={`
                    glass-card p-4 border-l-4 shine-effect hover:shadow-glow transition-all duration-300
                    ${threat.severity === "critical" ? "border-l-destructive" : ""}
                    ${threat.severity === "high" ? "border-l-warning" : ""}
                    ${threat.severity === "medium" ? "border-l-info" : ""}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline"
                          className={`backdrop-blur-sm
                            ${threat.severity === "critical" 
                              ? "border-destructive/50 text-destructive bg-destructive/10" 
                              : threat.severity === "high"
                              ? "border-warning/50 text-warning bg-warning/10"
                              : "border-info/50 text-info bg-info/10"}
                          `}
                        >
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="bg-steel-700/50 border border-steel-500/20 backdrop-blur-sm">
                          {threat.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(threat.timestamp)}</span>
                      </div>

                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground mb-1">Source: {threat.source}</p>
                        <p className="font-mono text-sm text-foreground break-all">
                          {threat.url || threat.hash?.slice(0, 32) + '...' || threat.ip || threat.fileName || ''}
                        </p>
                        {threat.signature && (
                          <p className="text-xs text-destructive mt-1">Signature: {threat.signature}</p>
                        )}
                        {threat.malware && (
                          <p className="text-xs text-warning mt-1">Malware: {threat.malware}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {threat.indicators.slice(0, 5).map((indicator, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-steel-500/30 bg-steel-800/30 backdrop-blur-sm">
                            {indicator}
                          </Badge>
                        ))}
                        {threat.tags?.slice(0, 3).map((tag, idx) => (
                          <Badge key={`tag-${idx}`} variant="outline" className="text-xs border-primary/30 bg-primary/10 text-primary backdrop-blur-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
