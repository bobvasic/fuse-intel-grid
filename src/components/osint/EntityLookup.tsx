import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOsintLookup, LookupType, LookupResult } from "@/hooks/useOsintLookup";
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
  Copy,
  Loader2,
  Shield,
  AlertTriangle
} from "lucide-react";

export const EntityLookup = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<LookupType>("domain");
  const { lookup, result, isLoading, error } = useOsintLookup();

  const handleLookup = () => {
    if (!query.trim()) return;
    lookup(activeTab, query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LookupType)} className="space-y-4">
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
              <TabsTrigger value="hash" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all">
                <Hash className="w-4 h-4 mr-2" />
                File Hash
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <Input
                placeholder={getPlaceholder(activeTab)}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-steel-900/50 border-steel-600/30 focus:border-primary/60 font-mono backdrop-blur-sm"
              />
              <Button 
                onClick={handleLookup}
                disabled={isLoading || !query.trim()}
                className="bg-gradient-cyber text-primary-foreground hover:shadow-glow transition-all shine-effect"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Searching...' : 'Lookup'}
              </Button>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-card border-l-4 border-l-destructive">
          <div className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Threat/Risk Score Banner */}
          <div className="glass-card border-l-4 border-l-primary">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{result.query}</p>
                  <p className="text-xs text-muted-foreground">
                    Queried {Object.keys(result.sources).length} sources • {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              {(result.threatScore !== undefined || result.riskScore !== undefined) && (
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${
                    (result.threatScore || result.riskScore || 0) > 50 
                      ? 'border-destructive/50 text-destructive bg-destructive/10' 
                      : (result.threatScore || result.riskScore || 0) > 20
                      ? 'border-warning/50 text-warning bg-warning/10'
                      : 'border-success/50 text-success bg-success/10'
                  }`}
                >
                  Risk: {result.threatScore || result.riskScore || 0}/100
                </Badge>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.type === 'ip' && <IPResults result={result} onCopy={copyToClipboard} />}
            {result.type === 'domain' && <DomainResults result={result} onCopy={copyToClipboard} />}
            {result.type === 'email' && <EmailResults result={result} onCopy={copyToClipboard} />}
            {result.type === 'hash' && <HashResults result={result} onCopy={copyToClipboard} />}
          </div>

          {/* Raw Sources */}
          <div className="glass-card">
            <div className="p-6">
              <h4 className="font-semibold mb-4 text-foreground">Data Sources Queried</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.keys(result.sources).map((source) => (
                  <Badge 
                    key={source} 
                    variant="outline" 
                    className="justify-center py-2 border-success/50 bg-success/10 text-success backdrop-blur-sm"
                  >
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="glass-card">
          <div className="p-6">
            <h4 className="font-semibold mb-4 text-foreground">Active OSINT Sources</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                "IPInfo.io", "IP-API", "CRT.sh", "URLScan.io", 
                "Google DNS", "AbuseIPDB", "Malware Bazaar", "VirusTotal",
                "GitHub", "SpamHaus", "PhishTank", "Feodo Tracker"
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
      )}
    </div>
  );
};

function getPlaceholder(type: LookupType): string {
  switch (type) {
    case 'ip': return 'Enter IP address (e.g., 8.8.8.8)';
    case 'domain': return 'Enter domain (e.g., example.com)';
    case 'email': return 'Enter email address';
    case 'hash': return 'Enter MD5, SHA1, or SHA256 hash';
    default: return 'Enter entity to investigate...';
  }
}

interface ResultProps {
  result: LookupResult;
  onCopy: (text: string) => void;
}

const IPResults = ({ result, onCopy }: ResultProps) => (
  <>
    <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-info/10 rounded-lg backdrop-blur-sm border border-info/20">
            <MapPin className="w-5 h-5 text-info" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Geolocation</h4>
            <p className="text-xs text-muted-foreground">IP Location Data</p>
          </div>
        </div>
        <div className="space-y-3">
          {result.geolocation && (
            <>
              <DataRow label="City" value={result.geolocation.city || 'Unknown'} />
              <DataRow label="Region" value={result.geolocation.region || 'Unknown'} />
              <DataRow label="Country" value={result.geolocation.country || 'Unknown'} />
              <DataRow label="Coordinates" value={result.geolocation.coordinates || 'Unknown'} />
            </>
          )}
          {result.organization && <DataRow label="Organization" value={result.organization} />}
          {result.isp && <DataRow label="ISP" value={result.isp} />}
          {result.asn && <DataRow label="ASN" value={result.asn} />}
        </div>
      </div>
    </div>

    <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-warning/10 rounded-lg backdrop-blur-sm border border-warning/20">
            <Shield className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Threat Indicators</h4>
            <p className="text-xs text-muted-foreground">Security Analysis</p>
          </div>
        </div>
        <div className="space-y-3">
          <DataRow label="Threat Score" value={`${result.threatScore || 0}/100`} />
          {result.isProxy !== undefined && (
            <DataRow label="Proxy/VPN" value={result.isProxy ? 'Yes' : 'No'} />
          )}
          {result.isHosting !== undefined && (
            <DataRow label="Hosting Provider" value={result.isHosting ? 'Yes' : 'No'} />
          )}
          {result.abuseScore !== undefined && (
            <DataRow label="Abuse Score" value={`${result.abuseScore}%`} />
          )}
          {result.totalReports !== undefined && (
            <DataRow label="Total Reports" value={String(result.totalReports)} />
          )}
          {result.reverseDns && <DataRow label="Reverse DNS" value={result.reverseDns} />}
        </div>
      </div>
    </div>
  </>
);

const DomainResults = ({ result, onCopy }: ResultProps) => (
  <>
    <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">DNS Records</h4>
            <p className="text-xs text-muted-foreground">Domain Resolution</p>
          </div>
        </div>
        <div className="space-y-3">
          <DataRow label="Certificates Found" value={String(result.certificates || 0)} />
          <DataRow label="URLScan Results" value={String(result.urlscanTotal || 0)} />
          {result.resolvedIPs && result.resolvedIPs.length > 0 && (
            <div className="py-2 border-b border-steel-600/30">
              <span className="text-sm text-muted-foreground block mb-2">Resolved IPs</span>
              <div className="flex flex-wrap gap-1">
                {result.resolvedIPs.slice(0, 5).map((ip, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono bg-steel-700/50">
                    {ip}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {result.mxRecords && result.mxRecords.length > 0 && (
            <div className="py-2 border-b border-steel-600/30">
              <span className="text-sm text-muted-foreground block mb-2">MX Records</span>
              <div className="flex flex-wrap gap-1">
                {result.mxRecords.slice(0, 3).map((mx, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono bg-steel-700/50">
                    {mx}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {result.subdomains && result.subdomains.length > 0 && (
      <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-info/10 rounded-lg backdrop-blur-sm border border-info/20">
              <Server className="w-5 h-5 text-info" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Subdomains ({result.subdomains.length})</h4>
              <p className="text-xs text-muted-foreground">Certificate Transparency</p>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {result.subdomains.slice(0, 20).map((sub, i) => (
              <div key={i} className="font-mono text-xs text-muted-foreground py-1 border-b border-steel-700/30">
                {sub}
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </>
);

const EmailResults = ({ result, onCopy }: ResultProps) => (
  <>
    <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Email Intelligence</h4>
            <p className="text-xs text-muted-foreground">Associated Accounts</p>
          </div>
        </div>
        <div className="space-y-3">
          {result.githubProfiles !== undefined && (
            <DataRow label="GitHub Profiles" value={String(result.githubProfiles)} />
          )}
          {result.domainInfo?.mxRecords && (
            <DataRow label="Domain MX" value={result.domainInfo.mxRecords[0] || 'None'} />
          )}
        </div>
      </div>
    </div>
  </>
);

const HashResults = ({ result, onCopy }: ResultProps) => (
  <>
    <div className="glass-card shine-effect hover:shadow-glow transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg backdrop-blur-sm border ${result.malicious ? 'bg-destructive/10 border-destructive/20' : 'bg-success/10 border-success/20'}`}>
            <Hash className={`w-5 h-5 ${result.malicious ? 'text-destructive' : 'text-success'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">File Hash Analysis</h4>
            <p className="text-xs text-muted-foreground">{result.hashType} Hash</p>
          </div>
        </div>
        <div className="space-y-3">
          <DataRow label="Hash Type" value={result.hashType || 'Unknown'} />
          {result.malicious !== undefined && (
            <div className="flex justify-between items-center py-2 border-b border-steel-600/30">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={result.malicious ? 'destructive' : 'outline'} className={!result.malicious ? 'border-success/50 text-success bg-success/10' : ''}>
                {result.malicious ? 'MALICIOUS' : 'Clean'}
              </Badge>
            </div>
          )}
          {result.malwareFamily && (
            <DataRow label="Malware Family" value={result.malwareFamily} />
          )}
          {result.vtDetections !== undefined && (
            <DataRow label="VT Detections" value={`${result.vtDetections} engines`} />
          )}
        </div>
      </div>
    </div>
  </>
);

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
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary transition-all"
          onClick={() => navigator.clipboard.writeText(value)}
        >
          <Copy className="w-3 h-3" />
        </Button>
      )}
    </span>
  </div>
);
