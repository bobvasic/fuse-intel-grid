import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Threat {
  id: string;
  type: 'Phishing' | 'Malware' | 'Botnet' | 'Spam' | 'Data Breach';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  url?: string;
  hash?: string;
  ip?: string;
  domain?: string;
  fileName?: string;
  signature?: string;
  malware?: string;
  target?: string;
  timestamp: string;
  indicators: string[];
  tags?: string[];
  verified?: boolean;
  country?: string;
  asName?: string;
}

export interface ThreatSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  byType: {
    phishing: number;
    malware: number;
    botnet: number;
  };
  lastUpdated: string;
}

export function useThreatFeed() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [summary, setSummary] = useState<ThreatSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchThreats = useCallback(async (feedType: string = 'all', limit: number = 50) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('threat-feed', {
        body: { feedType, limit },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setThreats(data.threats || []);
      setSummary(data.summary || null);
      
      if (data.threats?.length > 0) {
        toast({
          title: 'Threat Feed Updated',
          description: `Loaded ${data.threats.length} threats from live sources`,
        });
      }
    } catch (err: any) {
      const message = err.message || 'Failed to fetch threat feed';
      setError(message);
      toast({
        title: 'Feed Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchThreats();
  }, []);

  return { threats, summary, isLoading, error, refetch: fetchThreats };
}
