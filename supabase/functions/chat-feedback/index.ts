
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL');
const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');

async function checkRateLimit(userId: string, type: string): Promise<boolean> {
  if (!redisUrl || !redisToken) return true; // Allow if Redis unavailable
  
  try {
    const key = `rate_limit:${type}:${userId}`;
    const response = await fetch(`${redisUrl}/get/${key}`, {
      headers: { Authorization: `Bearer ${redisToken}` }
    });
    const data = await response.json();
    
    if (data.result && parseInt(data.result) >= 10) { // 10 feedback per hour
      return false;
    }
    
    // Increment counter
    await fetch(`${redisUrl}/incr/${key}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${redisToken}` }
    });
    
    // Set expiry if this is the first increment
    if (!data.result) {
      await fetch(`${redisUrl}/expire/${key}/3600`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${redisToken}` }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chatId, feedback, userId } = await req.json();

    if (!chatId || !feedback || !userId) {
      return new Response(
        JSON.stringify({ error: 'Chat ID, feedback, and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const allowed = await checkRateLimit(userId, 'chat_feedback');
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store feedback
    const { error } = await supabase.from('chat_feedback').insert({
      chat_id: chatId,
      user_id: userId,
      feedback: feedback,
      created_at: new Date().toISOString()
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat feedback error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
