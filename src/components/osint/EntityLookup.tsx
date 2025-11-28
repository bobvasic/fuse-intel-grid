import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Search, 
  MapPin, 
  Server,
  Hash,
  Mail,
  User,
  Wallet,
  ExternalLink,
  Copy
} from "lucide-react";

export const EntityLookup = () => {
  const [query, setQuery] = useState("");

  const mockData = {
    domain: {
      name: "example.com",
      registrar: "GoDaddy",
      created: "1995-08-14",
      updated: "2023-11-15",
      expires: "2025-08-13",
      nameservers: ["ns1.example.com", "ns2.example.com"],
      status: "Active",
      risk_score: 12
    },
    ip: {
      address: "93.184.216.34",
      location: "United States, California",
      asn: "AS15133",
      org: "Edgecast Inc.",
      ports: ["80", "443"],
      reputation: "Good",
      threats: 0
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-chrome">Multi-Source Entity Lookup</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Query 20+ OSINT sources simultaneously for comprehensive intelligence
        </p>
      </div>

      {/* Search Interface */}
      <div className="glass-card shadow-glow">
        <div className="p-6">
          <Tabs defaultValue="domain" className="space-y-4">
            <TabsList className="bg-steel-800/50 border border-steel-600/30 backdrop-blur-sm">
              <TabsTrigger value="domain" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                <Globe className="w-4 h-4 mr-2" />
                Domain
              </TabsTrigger>
              <TabsTrigger value="ip" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                <Server className="w-4 h-4 mr-2" />
                IP Address
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="username" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                <User className="w-4 h-4 mr-2" />
                Username
              </TabsTrigger>
              <TabsTrigger value="wallet" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                <Wallet className="w-4 h-4 mr-2" />
                Crypto Wallet
              </TabsTrigger>
              <TabsTrigger value="hash" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                <Hash className="w-4 h-4 mr-2" />
                File Hash
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <Input
                placeholder="Enter entity to investigate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-steel-900/50 border-steel-600/30 focus:border-primary/60 font-mono backdrop-blur-sm"
              />
              <Button className="bg-gradient-cyber text-primary-foreground hover:shadow-glow transition-all shine-effect">
                <Search className="w-4 h-4 mr-2" />
                Lookup
              </Button>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Information */}
        <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Domain Intelligence</h4>
                  <p className="text-xs text-muted-foreground">WHOIS & DNS Analysis</p>
                </div>
              </div>
              <Badge variant="outline" className="border-success/50 text-success bg-success/10 backdrop-blur-sm">
                Risk: {mockData.domain.risk_score}/100
              </Badge>
            </div>

            <div className="space-y-3">
              <DataRow label="Domain" value={mockData.domain.name} copyable />
              <DataRow label="Registrar" value={mockData.domain.registrar} />
              <DataRow label="Created" value={mockData.domain.created} />
              <DataRow label="Expires" value={mockData.domain.expires} />
              <div className="flex justify-between items-center py-2 border-b border-steel-600/30">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className="border-success/50 text-success bg-success/10 text-xs backdrop-blur-sm">
                  {mockData.domain.status}
                </Badge>
              </div>
            </div>

            <Button className="w-full mt-4 chrome-button text-foreground hover:glow-primary transition-all">
              <ExternalLink className="w-4 h-4 mr-2" />
              Full WHOIS Report
            </Button>
          </div>
        </div>

        {/* IP Information */}
        <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg backdrop-blur-sm border border-info/20">
                  <Server className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">IP Intelligence</h4>
                  <p className="text-xs text-muted-foreground">Geolocation & Reputation</p>
                </div>
              </div>
              <Badge variant="outline" className="border-success/50 text-success bg-success/10 backdrop-blur-sm">
                {mockData.ip.reputation}
              </Badge>
            </div>

            <div className="space-y-3">
              <DataRow label="IP Address" value={mockData.ip.address} copyable />
              <div className="flex justify-between items-center py-2 border-b border-steel-600/30">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm flex items-center gap-1 text-foreground">
                  <MapPin className="w-3 h-3" />
                  {mockData.ip.location}
                </span>
              </div>
              <DataRow label="ASN" value={mockData.ip.asn} />
              <DataRow label="Organization" value={mockData.ip.org} />
              <div className="flex justify-between items-center py-2 border-b border-steel-600/30">
                <span className="text-sm text-muted-foreground">Open Ports</span>
                <div className="flex gap-1">
                  {mockData.ip.ports.map(port => (
                    <Badge key={port} variant="secondary" className="text-xs bg-steel-700/50 border border-steel-500/20 backdrop-blur-sm">
                      {port}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full mt-4 chrome-button text-foreground hover:glow-primary transition-all">
              <ExternalLink className="w-4 h-4 mr-2" />
              Shodan Full Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="glass-card">
        <div className="p-6">
          <h4 className="font-semibold mb-4 text-foreground">Active OSINT Sources</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "Shodan", "VirusTotal", "URLScan", "AbuseIPDB", 
              "OTX AlienVault", "PhishTank", "CRT.sh", "SecurityTrails",
              "IPinfo", "Censys", "SpamHaus", "Blockchain.info"
            ].map((source) => (
              <Badge 
                key={source} 
                variant="outline" 
                className="justify-center py-2 border-steel-500/30 bg-steel-800/30 hover:bg-primary/10 hover:border-primary/30 transition-all backdrop-blur-sm"
              >
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Row Component
interface DataRowProps {
  label: string;
  value: string;
  copyable?: boolean;
}

const DataRow = ({ label, value, copyable }: DataRowProps) => (
  <div className="flex justify-between items-center py-2 border-b border-steel-600/30">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-mono text-sm flex items-center gap-2 text-foreground">
      {value}
      {copyable && (
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary transition-all">
          <Copy className="w-3 h-3" />
        </Button>
      )}
    </span>
  </div>
);
