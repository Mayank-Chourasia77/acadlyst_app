
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL');
const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');
const groqApiKey = Deno.env.get('GROQ_API_KEY');

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Redis helper functions
async function redisGet(key: string) {
  if (!redisUrl || !redisToken) return null;
  
  try {
    const response = await fetch(`${redisUrl}/get/${key}`, {
      headers: { Authorization: `Bearer ${redisToken}` }
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

async function redisSet(key: string, value: string, ttl: number = 86400) {
  if (!redisUrl || !redisToken) return false;
  
  try {
    const response = await fetch(`${redisUrl}/setex/${key}/${ttl}`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${redisToken}`,
      },
      body: value
    });
    return response.ok;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
}

async function queryGroq(query: string) {
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY is not set.');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful study and placement assistant. Answer questions about academics, career guidance, interview preparation, and study strategies. Keep responses concise and helpful.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid response from Groq:', data);
      throw new Error('Invalid response from Groq, "content" field is missing.');
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let query: string | undefined;
  let userId: string | undefined;

  try {
    const body = await req.json();
    query = body.query;
    userId = body.userId;

    if (!query || !userId) {
      return new Response(
        JSON.stringify({ error: 'Query and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const cacheKey = `faq:${query.toLowerCase().trim()}`;
    let response = await redisGet(cacheKey);

    if (!response) {
      console.log('Cache miss, querying Groq...');
      response = await queryGroq(query);
      
      // Cache the successful response
      await redisSet(cacheKey, response, 86400); // 24 hour TTL
    } else {
      console.log('Cache hit!');
    }

    // Store the query and response in database
    const { data, error: dbInsertError } = await supabase.from('chat_history').insert({
      user_id: userId,
      query: query,
      response: response,
      created_at: new Date().toISOString()
    }).select('id').single();

    if (dbInsertError) {
      console.error('Error inserting chat history:', dbInsertError);
      // We will still return the response to the user even if DB insert fails
    }
    
    // Pass the new chat_history id back to the frontend
    const responsePayload = {
        response,
        chatId: data?.id || null,
    };

    return new Response(
      JSON.stringify(responsePayload),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Chat error:', error);

    // If an error occurred, we still might want to log the failed attempt
    if (userId && query) {
      try {
        await supabase.from('chat_history').insert({
          user_id: userId,
          query: query,
          response: `Error: ${error.message || 'Failed to get response from AI.'}`,
          created_at: new Date().toISOString()
        });
      } catch (dbError) {
        console.error('Failed to log chat history error:', dbError);
      }
    }
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
