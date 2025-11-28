import { useState } from "react";
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
      {/* Navigation Header - Steel Glassmorphic */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/40 animate-glow-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-steel-gradient">
                  OSINT Intelligence Hub
                </h1>
                <p className="text-xs text-muted-foreground">Advanced Open Source Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 backdrop-blur-sm">
                <Activity className="w-3 h-3 mr-1 animate-glow-pulse" />
                Live Monitoring
              </Badge>
              <Button className="chrome-button text-foreground hover:glow-primary transition-all">
                <Lock className="w-4 h-4 mr-2" />
                Upgrade Pro
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Search - Steel Glass Card */}
        <div className="glass-card mb-8 shine-effect">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-chrome">Universal Entity Search</h2>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter IP, domain, email, username, wallet address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-steel-900/50 border-steel-600/30 focus:border-primary/60 font-mono backdrop-blur-sm"
              />
              <Button className="bg-gradient-cyber text-primary-foreground hover:shadow-glow transition-all shine-effect">
                <Zap className="w-4 h-4 mr-2" />
                Investigate
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              {["IP Address", "Domain", "Email", "Username", "Crypto Wallet"].map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-steel-700/50 border border-steel-500/20 backdrop-blur-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Steel Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<Database className="w-5 h-5 text-primary" />}
            iconBg="bg-primary/10"
            label="Active Sources"
            value="24"
            subtext="Connected to major OSINT APIs"
            accentIcon={<TrendingUp className="w-8 h-8 text-success opacity-40" />}
          />
          <StatsCard
            icon={<AlertTriangle className="w-5 h-5 text-warning" />}
            iconBg="bg-warning/10"
            label="Threats Detected"
            value="17"
            subtext="Last 24 hours"
            accentIcon={<Activity className="w-8 h-8 text-warning opacity-40" />}
          />
          <StatsCard
            icon={<CheckCircle2 className="w-5 h-5 text-success" />}
            iconBg="bg-success/10"
            label="Queries Today"
            value="142"
            subtext="89% increase from yesterday"
            accentIcon={<Eye className="w-8 h-8 text-success opacity-40" />}
          />
        </div>

        {/* Main Intelligence Interface - Steel Tabs */}
        <Tabs defaultValue="investigation" className="space-y-6">
          <TabsList className="glass-card p-1 border border-steel-600/30">
            <TabsTrigger value="investigation" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow transition-all">
              <Search className="w-4 h-4 mr-2" />
              Investigation
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow transition-all">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Threat Feed
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow transition-all">
              <Network className="w-4 h-4 mr-2" />
              Network Graph
            </TabsTrigger>
            <TabsTrigger value="lookup" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-glow transition-all">
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

      {/* Footer - Steel Panel */}
      <footer className="border-t border-steel-600/30 mt-16 py-8 steel-panel">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>© 2025 OSINT Intelligence Hub - Advanced Open Source Intelligence Platform</p>
            </div>
            <div className="flex gap-4">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 backdrop-blur-sm">
                API Ready
              </Badge>
              <Badge variant="outline" className="border-success/30 bg-success/5 backdrop-blur-sm">
                24/7 Monitoring
              </Badge>
              <Badge variant="outline" className="border-warning/30 bg-warning/5 backdrop-blur-sm">
                Enterprise Grade
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Stats Card Component with Steel Design
interface StatsCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  subtext: string;
  accentIcon: React.ReactNode;
}

const StatsCard = ({ icon, iconBg, label, value, subtext, accentIcon }: StatsCardProps) => (
  <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${iconBg} rounded-lg backdrop-blur-sm border border-current/10`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-chrome">{value}</p>
          </div>
        </div>
        {accentIcon}
      </div>
      <div className="text-xs text-muted-foreground">
        {subtext}
      </div>
    </div>
  </div>
);

export default Index;
