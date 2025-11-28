import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LookupRequest {
  type: 'ip' | 'domain' | 'email' | 'hash';
  query: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, query }: LookupRequest = await req.json();
    console.log(`OSINT lookup: ${type} - ${query}`);

    let result: any = { query, type, timestamp: new Date().toISOString() };

    switch (type) {
      case 'ip':
        result = await lookupIP(query);
        break;
      case 'domain':
        result = await lookupDomain(query);
        break;
      case 'email':
        result = await lookupEmail(query);
        break;
      case 'hash':
        result = await lookupHash(query);
        break;
      default:
        throw new Error(`Unknown lookup type: ${type}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('OSINT lookup error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function lookupIP(ip: string) {
  const results: any = {
    query: ip,
    type: 'ip',
    timestamp: new Date().toISOString(),
    sources: {},
  };

  // IPInfo.io lookup (free tier - 50k/month)
  try {
    const ipinfoRes = await fetch(`https://ipinfo.io/${ip}/json`);
    if (ipinfoRes.ok) {
      const data = await ipinfoRes.json();
      results.sources.ipinfo = {
        city: data.city,
        region: data.region,
        country: data.country,
        loc: data.loc,
        org: data.org,
        timezone: data.timezone,
        postal: data.postal,
      };
      results.geolocation = {
        city: data.city,
        region: data.region,
        country: data.country,
        coordinates: data.loc,
      };
      results.organization = data.org;
    }
  } catch (e) {
    console.error('IPInfo error:', e);
  }

  // AbuseIPDB check (requires API key, but we'll check if available)
  const abuseipdbKey = Deno.env.get('ABUSEIPDB_API_KEY');
  if (abuseipdbKey) {
    try {
      const abuseRes = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
        headers: {
          'Key': abuseipdbKey,
          'Accept': 'application/json',
        },
      });
      if (abuseRes.ok) {
        const data = await abuseRes.json();
        results.sources.abuseipdb = data.data;
        results.abuseScore = data.data?.abuseConfidenceScore || 0;
        results.totalReports = data.data?.totalReports || 0;
      }
    } catch (e) {
      console.error('AbuseIPDB error:', e);
    }
  }

  // IP-API (free, no key required)
  try {
    const ipApiRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,reverse,mobile,proxy,hosting,query`);
    if (ipApiRes.ok) {
      const data = await ipApiRes.json();
      if (data.status === 'success') {
        results.sources.ipapi = data;
        results.isp = data.isp;
        results.asn = data.as;
        results.isProxy = data.proxy;
        results.isHosting = data.hosting;
        results.reverseDns = data.reverse;
      }
    }
  } catch (e) {
    console.error('IP-API error:', e);
  }

  // Calculate threat score based on available data
  results.threatScore = calculateIPThreatScore(results);

  return results;
}

async function lookupDomain(domain: string) {
  const results: any = {
    query: domain,
    type: 'domain',
    timestamp: new Date().toISOString(),
    sources: {},
  };

  // CRT.sh Certificate Transparency
  try {
    const crtRes = await fetch(`https://crt.sh/?q=${domain}&output=json`);
    if (crtRes.ok) {
      const data = await crtRes.json();
      results.sources.crtsh = data.slice(0, 20); // Limit to 20 certificates
      results.certificates = data.length;
      results.subdomains = [...new Set(data.map((cert: any) => cert.name_value).flat())].slice(0, 50);
    }
  } catch (e) {
    console.error('CRT.sh error:', e);
  }

  // URLScan.io search (free tier)
  try {
    const urlscanRes = await fetch(`https://urlscan.io/api/v1/search/?q=domain:${domain}&size=10`);
    if (urlscanRes.ok) {
      const data = await urlscanRes.json();
      results.sources.urlscan = data.results?.slice(0, 10);
      results.urlscanTotal = data.total;
    }
  } catch (e) {
    console.error('URLScan error:', e);
  }

  // DNS lookup via public DNS-over-HTTPS
  try {
    const dnsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    if (dnsRes.ok) {
      const data = await dnsRes.json();
      results.sources.dns = data;
      results.resolvedIPs = data.Answer?.filter((r: any) => r.type === 1).map((r: any) => r.data) || [];
    }
  } catch (e) {
    console.error('DNS lookup error:', e);
  }

  // MX records
  try {
    const mxRes = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    if (mxRes.ok) {
      const data = await mxRes.json();
      results.mxRecords = data.Answer?.filter((r: any) => r.type === 15).map((r: any) => r.data) || [];
    }
  } catch (e) {
    console.error('MX lookup error:', e);
  }

  // Calculate domain risk score
  results.riskScore = calculateDomainRiskScore(results);

  return results;
}

async function lookupEmail(email: string) {
  const results: any = {
    query: email,
    type: 'email',
    timestamp: new Date().toISOString(),
    sources: {},
  };

  // HaveIBeenPwned (k-anonymity model, no API key needed for password check)
  const [username, domain] = email.split('@');
  
  // Check domain for email
  if (domain) {
    try {
      const domainResults = await lookupDomain(domain);
      results.domainInfo = {
        mxRecords: domainResults.mxRecords,
        resolvedIPs: domainResults.resolvedIPs,
      };
    } catch (e) {
      console.error('Domain lookup for email error:', e);
    }
  }

  // GitHub public search (if username exists)
  try {
    const githubRes = await fetch(`https://api.github.com/search/users?q=${email}+in:email`);
    if (githubRes.ok) {
      const data = await githubRes.json();
      if (data.total_count > 0) {
        results.sources.github = data.items?.slice(0, 5);
        results.githubProfiles = data.total_count;
      }
    }
  } catch (e) {
    console.error('GitHub search error:', e);
  }

  return results;
}

async function lookupHash(hash: string) {
  const results: any = {
    query: hash,
    type: 'hash',
    timestamp: new Date().toISOString(),
    hashType: detectHashType(hash),
    sources: {},
  };

  // Malware Bazaar lookup
  try {
    const formData = new FormData();
    formData.append('query', 'get_info');
    formData.append('hash', hash);
    
    const bazaarRes = await fetch('https://mb-api.abuse.ch/api/v1/', {
      method: 'POST',
      body: formData,
    });
    if (bazaarRes.ok) {
      const data = await bazaarRes.json();
      if (data.query_status === 'ok') {
        results.sources.malwarebazaar = data.data?.[0];
        results.malwareFamily = data.data?.[0]?.signature;
        results.malicious = true;
      }
    }
  } catch (e) {
    console.error('Malware Bazaar error:', e);
  }

  // VirusTotal (if API key available)
  const vtKey = Deno.env.get('VIRUSTOTAL_API_KEY');
  if (vtKey) {
    try {
      const vtRes = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
        headers: {
          'x-apikey': vtKey,
        },
      });
      if (vtRes.ok) {
        const data = await vtRes.json();
        results.sources.virustotal = {
          stats: data.data?.attributes?.last_analysis_stats,
          names: data.data?.attributes?.names?.slice(0, 10),
          type: data.data?.attributes?.type_description,
        };
        results.vtDetections = data.data?.attributes?.last_analysis_stats?.malicious || 0;
      }
    } catch (e) {
      console.error('VirusTotal error:', e);
    }
  }

  return results;
}

function detectHashType(hash: string): string {
  const length = hash.length;
  if (length === 32) return 'MD5';
  if (length === 40) return 'SHA1';
  if (length === 64) return 'SHA256';
  if (length === 128) return 'SHA512';
  return 'Unknown';
}

function calculateIPThreatScore(results: any): number {
  let score = 0;
  
  if (results.abuseScore) score += results.abuseScore * 0.5;
  if (results.isProxy) score += 20;
  if (results.isHosting) score += 10;
  if (results.totalReports > 10) score += 30;
  
  return Math.min(100, Math.round(score));
}

function calculateDomainRiskScore(results: any): number {
  let score = 0;
  
  // New domains or those with few certificates might be suspicious
  if (results.certificates < 3) score += 20;
  
  // If URLScan found malicious indicators
  if (results.sources.urlscan?.some((s: any) => s.verdicts?.malicious)) {
    score += 50;
  }
  
  return Math.min(100, Math.round(score));
}
