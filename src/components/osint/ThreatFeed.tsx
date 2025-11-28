import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Shield, 
  Activity,
  ExternalLink,
  Filter
} from "lucide-react";

export const ThreatFeed = () => {
  const threats = [
    {
      id: 1,
      type: "Phishing",
      severity: "critical",
      source: "PhishTank",
      url: "https://suspicious-banking[.]xyz",
      timestamp: "3 minutes ago",
      indicators: ["Fake SSL", "Typosquatting", "Credential Harvesting"]
    },
    {
      id: 2,
      type: "Malware",
      severity: "high",
      source: "Malware Bazaar",
      hash: "4d8a7b2c3e1f9a0b5c6d7e8f1a2b3c4d",
      timestamp: "12 minutes ago",
      indicators: ["Trojan", "C2 Communication", "Data Exfiltration"]
    },
    {
      id: 3,
      type: "Botnet",
      severity: "high",
      source: "AbuseIPDB",
      ip: "185.220.102.8",
      timestamp: "28 minutes ago",
      indicators: ["DDoS Attack", "Port Scanning", "Brute Force"]
    },
    {
      id: 4,
      type: "Spam",
      severity: "medium",
      source: "SpamHaus",
      domain: "cheap-pills[.]biz",
      timestamp: "45 minutes ago",
      indicators: ["Mass Mailing", "Reputation Loss"]
    },
    {
      id: 5,
      type: "Data Breach",
      severity: "critical",
      source: "HaveIBeenPwned",
      count: "2.1M accounts",
      timestamp: "1 hour ago",
      indicators: ["Password Leak", "Email Exposure", "PII Exposure"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-chrome">Real-Time Threat Intelligence</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Live feed from 15+ global threat intelligence sources
          </p>
        </div>
        <Button className="chrome-button text-foreground hover:glow-primary transition-all">
          <Filter className="w-4 h-4 mr-2" />
          Filter Threats
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card border-l-4 border-l-destructive">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-3xl font-bold text-destructive">12</p>
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
                <p className="text-3xl font-bold text-warning">28</p>
              </div>
              <Shield className="w-8 h-8 text-warning opacity-40" />
            </div>
          </div>
        </div>

        <div className="glass-card border-l-4 border-l-info">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium</p>
                <p className="text-3xl font-bold text-info">54</p>
              </div>
              <Activity className="w-8 h-8 text-info opacity-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <ScrollArea className="h-[600px]">
          <div className="p-6 space-y-4">
            {threats.map((threat) => (
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
                      <span className="text-xs text-muted-foreground">{threat.timestamp}</span>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground mb-1">Source: {threat.source}</p>
                      <p className="font-mono text-sm text-foreground">
                        {"url" in threat && threat.url}
                        {"hash" in threat && threat.hash}
                        {"ip" in threat && threat.ip}
                        {"domain" in threat && threat.domain}
                        {"count" in threat && threat.count}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {threat.indicators.map((indicator, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-steel-500/30 bg-steel-800/30 backdrop-blur-sm">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
