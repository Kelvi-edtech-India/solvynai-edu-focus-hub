
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Initialize the Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

type AIService = 'doubt-solver' | 'answer-analyzer' | 'question-generator';

type AIResponse = {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export function useAI() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (
    prompt: string,
    service: AIService,
    context: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = []
  ): Promise<AIResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await supabase.functions.invoke('deepseek-ai', {
        body: {
          prompt,
          service,
          context
        }
      });
      
      if (apiError) {
        throw new Error(apiError.message || 'Failed to call AI service');
      }
      
      return data as AIResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(`AI Error: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    callAI,
    loading,
    error
  };
}
