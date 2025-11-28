import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type LookupType = 'ip' | 'domain' | 'email' | 'hash';

export interface LookupResult {
  query: string;
  type: LookupType;
  timestamp: string;
  sources: Record<string, any>;
  threatScore?: number;
  riskScore?: number;
  geolocation?: {
    city: string;
    region: string;
    country: string;
    coordinates: string;
  };
  organization?: string;
  isp?: string;
  asn?: string;
  isProxy?: boolean;
  isHosting?: boolean;
  reverseDns?: string;
  abuseScore?: number;
  totalReports?: number;
  certificates?: number;
  subdomains?: string[];
  resolvedIPs?: string[];
  mxRecords?: string[];
  urlscanTotal?: number;
  domainInfo?: any;
  githubProfiles?: number;
  hashType?: string;
  malwareFamily?: string;
  malicious?: boolean;
  vtDetections?: number;
}

export function useOsintLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const lookup = async (type: LookupType, query: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('osint-lookup', {
        body: { type, query },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: 'Lookup Complete',
        description: `Found intelligence for ${query}`,
      });
    } catch (err: any) {
      const message = err.message || 'Lookup failed';
      setError(message);
      toast({
        title: 'Lookup Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { lookup, result, isLoading, error };
}
