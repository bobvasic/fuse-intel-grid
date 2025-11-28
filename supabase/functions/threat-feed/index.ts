import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThreatFeedRequest {
  feedType?: 'all' | 'phishing' | 'malware' | 'botnet' | 'recent';
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedType = 'all', limit = 50 }: ThreatFeedRequest = await req.json().catch(() => ({}));
    console.log(`Fetching threat feed: ${feedType}, limit: ${limit}`);

    const threats: any[] = [];

    // Fetch from multiple sources in parallel
    const [phishtankData, malwareBazaarData, feodoData] = await Promise.allSettled([
      fetchPhishTank(),
      fetchMalwareBazaar(limit),
      fetchFeodoTracker(),
    ]);

    // Process PhishTank results
    if (phishtankData.status === 'fulfilled' && phishtankData.value) {
      threats.push(...phishtankData.value.map((item: any) => ({
        id: `phish-${item.phish_id}`,
        type: 'Phishing',
        severity: 'critical',
        source: 'PhishTank',
        url: item.url,
        target: item.target,
        timestamp: item.verification_time || item.submission_time,
        indicators: ['Credential Harvesting', 'Fake Site'],
        verified: item.verified === 'yes',
      })));
    }

    // Process Malware Bazaar results
    if (malwareBazaarData.status === 'fulfilled' && malwareBazaarData.value) {
      threats.push(...malwareBazaarData.value.map((item: any) => ({
        id: `malware-${item.sha256_hash?.slice(0, 12)}`,
        type: 'Malware',
        severity: item.signature ? 'critical' : 'high',
        source: 'Malware Bazaar',
        hash: item.sha256_hash,
        fileName: item.file_name,
        fileType: item.file_type_mime,
        signature: item.signature,
        timestamp: item.first_seen,
        indicators: [item.file_type, item.signature].filter(Boolean),
        tags: item.tags || [],
      })));
    }

    // Process Feodo Tracker results (C2 botnet)
    if (feodoData.status === 'fulfilled' && feodoData.value) {
      threats.push(...feodoData.value.map((item: any) => ({
        id: `botnet-${item.ip_address?.replace(/\./g, '-')}`,
        type: 'Botnet',
        severity: 'high',
        source: 'Feodo Tracker',
        ip: item.ip_address,
        port: item.port,
        malware: item.malware,
        timestamp: item.first_seen,
        country: item.country,
        indicators: ['C2 Server', item.malware, `Port ${item.port}`].filter(Boolean),
        asName: item.as_name,
      })));
    }

    // Sort by timestamp (most recent first)
    threats.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });

    // Filter by type if requested
    let filteredThreats = threats;
    if (feedType !== 'all' && feedType !== 'recent') {
      filteredThreats = threats.filter(t => t.type.toLowerCase() === feedType.toLowerCase());
    }

    // Calculate summary stats
    const summary = {
      total: filteredThreats.length,
      critical: filteredThreats.filter(t => t.severity === 'critical').length,
      high: filteredThreats.filter(t => t.severity === 'high').length,
      medium: filteredThreats.filter(t => t.severity === 'medium').length,
      byType: {
        phishing: filteredThreats.filter(t => t.type === 'Phishing').length,
        malware: filteredThreats.filter(t => t.type === 'Malware').length,
        botnet: filteredThreats.filter(t => t.type === 'Botnet').length,
      },
      lastUpdated: new Date().toISOString(),
    };

    return new Response(JSON.stringify({
      threats: filteredThreats.slice(0, limit),
      summary,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Threat feed error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchPhishTank(): Promise<any[]> {
  try {
    // PhishTank provides a JSON feed (requires registration for full access)
    // Using their verified online database
    const res = await fetch('https://data.phishtank.com/data/online-valid.json', {
      headers: {
        'User-Agent': 'OSINT-Dashboard/1.0',
      },
    });
    
    if (!res.ok) {
      console.log('PhishTank fetch failed, using fallback');
      return [];
    }
    
    const data = await res.json();
    return data.slice(0, 20); // Limit to recent entries
  } catch (e) {
    console.error('PhishTank error:', e);
    return [];
  }
}

async function fetchMalwareBazaar(limit: number): Promise<any[]> {
  try {
    const formData = new FormData();
    formData.append('query', 'get_recent');
    formData.append('selector', '100');
    
    const res = await fetch('https://mb-api.abuse.ch/api/v1/', {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      console.log('Malware Bazaar fetch failed');
      return [];
    }
    
    const data = await res.json();
    return data.data?.slice(0, limit) || [];
  } catch (e) {
    console.error('Malware Bazaar error:', e);
    return [];
  }
}

async function fetchFeodoTracker(): Promise<any[]> {
  try {
    // Feodo Tracker provides C2 botnet intelligence
    const res = await fetch('https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json');
    
    if (!res.ok) {
      console.log('Feodo Tracker fetch failed');
      return [];
    }
    
    const data = await res.json();
    return data.slice(0, 30);
  } catch (e) {
    console.error('Feodo Tracker error:', e);
    return [];
  }
}
