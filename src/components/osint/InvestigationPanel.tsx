import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  User, 
  MapPin, 
  Shield,
  ExternalLink,
  Download
} from "lucide-react";

export const InvestigationPanel = () => {
  const cases = [
    {
      id: "INV-2024-001",
      title: "Suspicious Domain Investigation",
      entity: "malicious-site[.]com",
      status: "active",
      severity: "high",
      created: "2 hours ago",
      sources: ["Shodan", "VirusTotal", "URLScan"],
      findings: 12
    },
    {
      id: "INV-2024-002", 
      title: "Crypto Wallet Analysis",
      entity: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      status: "completed",
      severity: "medium",
      created: "5 hours ago",
      sources: ["Etherscan", "Blockchain.info"],
      findings: 8
    },
    {
      id: "INV-2024-003",
      title: "IP Reputation Check",
      entity: "185.220.101.45",
      status: "active",
      severity: "critical",
      created: "1 hour ago",
      sources: ["AbuseIPDB", "SpamHaus", "OTX"],
      findings: 23
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Active Investigations</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your intelligence gathering operations
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" />
          New Investigation
        </Button>
      </div>

      <div className="grid gap-4">
        {cases.map((case_) => (
          <Card key={case_.id} className="bg-card border-border hover:border-primary/50 transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {case_.id}
                    </Badge>
                    <Badge 
                      variant={case_.status === "active" ? "default" : "secondary"}
                      className={case_.status === "active" ? "bg-primary/20 text-primary" : ""}
                    >
                      {case_.status}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={
                        case_.severity === "critical" 
                          ? "border-destructive/50 text-destructive" 
                          : case_.severity === "high"
                          ? "border-warning/50 text-warning"
                          : "border-info/50 text-info"
                      }
                    >
                      {case_.severity}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-semibold mb-1">{case_.title}</h4>
                  <p className="text-sm text-muted-foreground font-mono mb-3">
                    Target: {case_.entity}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {case_.sources.map((source) => (
                      <Badge key={source} variant="secondary" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {case_.created}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {case_.findings} findings
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-primary/50 hover:bg-primary/10">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-primary/50 hover:bg-primary/10">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
