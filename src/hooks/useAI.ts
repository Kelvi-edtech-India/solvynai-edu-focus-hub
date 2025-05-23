
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
    
    console.log('Calling AI service:', service, 'with prompt length:', prompt.length);
    
    try {
      const { data, error: apiError } = await supabase.functions.invoke('deepseek-ai', {
        body: {
          prompt,
          service,
          context
        }
      });
      
      console.log('AI response received:', data ? 'success' : 'no data', apiError ? `error: ${apiError.message}` : 'no error');
      
      if (apiError) {
        throw new Error(apiError.message || 'Failed to call AI service');
      }
      
      if (!data) {
        throw new Error('No response received from AI service');
      }
      
      return data as AIResponse;
    } catch (err) {
      console.error('AI service error:', err);
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
