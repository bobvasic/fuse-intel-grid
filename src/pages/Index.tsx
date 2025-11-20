import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Search, 
  Globe, 
  Database, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  Activity,
  Network,
  Lock,
  Eye,
  Zap
} from "lucide-react";
import { InvestigationPanel } from "@/components/osint/InvestigationPanel";
import { ThreatFeed } from "@/components/osint/ThreatFeed";
import { NetworkGraph } from "@/components/osint/NetworkGraph";
import { EntityLookup } from "@/components/osint/EntityLookup";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 blur-md bg-primary/30"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                  OSINT Intelligence Hub
                </h1>
                <p className="text-xs text-muted-foreground">Advanced Open Source Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-primary/50 text-primary">
                <Activity className="w-3 h-3 mr-1" />
                Live Monitoring
              </Badge>
              <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                <Lock className="w-4 h-4 mr-2" />
                Upgrade Pro
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Search */}
        <Card className="mb-8 bg-card border-border shadow-glow">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Universal Entity Search</h2>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter IP, domain, email, username, wallet address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-background border-border focus:border-primary font-mono"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-cyber">
                <Zap className="w-4 h-4 mr-2" />
                Investigate
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Badge variant="secondary" className="text-xs">IP Address</Badge>
              <Badge variant="secondary" className="text-xs">Domain</Badge>
              <Badge variant="secondary" className="text-xs">Email</Badge>
              <Badge variant="secondary" className="text-xs">Username</Badge>
              <Badge variant="secondary" className="text-xs">Crypto Wallet</Badge>
            </div>
          </div>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="bg-card border-border shadow-glow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Sources</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-success opacity-50" />
              </div>
              <div className="text-xs text-muted-foreground">
                Connected to major OSINT APIs
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border shadow-glow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Threats Detected</p>
                    <p className="text-2xl font-bold">17</p>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-warning opacity-50" />
              </div>
              <div className="text-xs text-muted-foreground">
                Last 24 hours
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border shadow-glow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Queries Today</p>
                    <p className="text-2xl font-bold">142</p>
                  </div>
                </div>
                <Eye className="w-8 h-8 text-success opacity-50" />
              </div>
              <div className="text-xs text-muted-foreground">
                89% increase from yesterday
              </div>
            </div>
          </Card>
        </div>

        {/* Main Intelligence Interface */}
        <Tabs defaultValue="investigation" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="investigation" className="data-[state=active]:bg-primary/20">
              <Search className="w-4 h-4 mr-2" />
              Investigation
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-primary/20">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Threat Feed
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-primary/20">
              <Network className="w-4 h-4 mr-2" />
              Network Graph
            </TabsTrigger>
            <TabsTrigger value="lookup" className="data-[state=active]:bg-primary/20">
              <Globe className="w-4 h-4 mr-2" />
              Entity Lookup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investigation">
            <InvestigationPanel />
          </TabsContent>

          <TabsContent value="threats">
            <ThreatFeed />
          </TabsContent>

          <TabsContent value="network">
            <NetworkGraph />
          </TabsContent>

          <TabsContent value="lookup">
            <EntityLookup />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>© 2025 OSINT Intelligence Hub - Advanced Open Source Intelligence Platform</p>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline" className="border-primary/30">
                API Ready
              </Badge>
              <Badge variant="outline" className="border-success/30">
                24/7 Monitoring
              </Badge>
              <Badge variant="outline" className="border-warning/30">
                Enterprise Grade
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
