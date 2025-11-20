import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <h3 className="text-2xl font-bold">Multi-Source Entity Lookup</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Query 20+ OSINT sources simultaneously for comprehensive intelligence
        </p>
      </div>

      {/* Search Interface */}
      <Card className="bg-card border-border shadow-glow">
        <div className="p-6">
          <Tabs defaultValue="domain" className="space-y-4">
            <TabsList className="bg-background">
              <TabsTrigger value="domain">
                <Globe className="w-4 h-4 mr-2" />
                Domain
              </TabsTrigger>
              <TabsTrigger value="ip">
                <Server className="w-4 h-4 mr-2" />
                IP Address
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="username">
                <User className="w-4 h-4 mr-2" />
                Username
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Crypto Wallet
              </TabsTrigger>
              <TabsTrigger value="hash">
                <Hash className="w-4 h-4 mr-2" />
                File Hash
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <Input
                placeholder="Enter entity to investigate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-background border-border font-mono"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Lookup
              </Button>
            </div>
          </Tabs>
        </div>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Information */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Domain Intelligence</h4>
                  <p className="text-xs text-muted-foreground">WHOIS & DNS Analysis</p>
                </div>
              </div>
              <Badge variant="outline" className="border-success/50 text-success">
                Risk: {mockData.domain.risk_score}/100
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Domain</span>
                <span className="font-mono text-sm flex items-center gap-2">
                  {mockData.domain.name}
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Registrar</span>
                <span className="text-sm">{mockData.domain.registrar}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">{mockData.domain.created}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="text-sm">{mockData.domain.expires}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className="border-success/50 text-success text-xs">
                  {mockData.domain.status}
                </Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 border-primary/50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Full WHOIS Report
            </Button>
          </div>
        </Card>

        {/* IP Information */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Server className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h4 className="font-semibold">IP Intelligence</h4>
                  <p className="text-xs text-muted-foreground">Geolocation & Reputation</p>
                </div>
              </div>
              <Badge variant="outline" className="border-success/50 text-success">
                {mockData.ip.reputation}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">IP Address</span>
                <span className="font-mono text-sm flex items-center gap-2">
                  {mockData.ip.address}
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {mockData.ip.location}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">ASN</span>
                <span className="text-sm">{mockData.ip.asn}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Organization</span>
                <span className="text-sm">{mockData.ip.org}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Open Ports</span>
                <div className="flex gap-1">
                  {mockData.ip.ports.map(port => (
                    <Badge key={port} variant="secondary" className="text-xs">{port}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 border-primary/50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Shodan Full Scan
            </Button>
          </div>
        </Card>
      </div>

      {/* Data Sources */}
      <Card className="bg-card border-border">
        <div className="p-6">
          <h4 className="font-semibold mb-4">Active OSINT Sources</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "Shodan", "VirusTotal", "URLScan", "AbuseIPDB", 
              "OTX AlienVault", "PhishTank", "CRT.sh", "SecurityTrails",
              "IPinfo", "Censys", "SpamHaus", "Blockchain.info"
            ].map((source) => (
              <Badge key={source} variant="outline" className="justify-center py-2">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
