import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fruitName } = await req.json()
    
    const API_ENDPOINT = "wss://ws-api.runware.ai/v1"
    const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY')

    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWARE_API_KEY is not set')
    }

    const ws = new WebSocket(API_ENDPOINT)
    
    const imagePromise = new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log("WebSocket connected")
        
        // Authenticate
        const authMessage = [{
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY,
        }]
        
        ws.send(JSON.stringify(authMessage))
      }

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data)
        console.log("Received message:", response)

        if (response.error || response.errors) {
          reject(new Error(response.errorMessage || response.errors?.[0]?.message || "An error occurred"))
          return
        }

        if (response.data) {
          response.data.forEach((item: any) => {
            if (item.taskType === "authentication") {
              console.log("Authentication successful")
              
              // Generate image after authentication
              const taskUUID = crypto.randomUUID()
              const message = [{
                taskType: "imageInference",
                taskUUID,
                model: "runware:100@1",
                positivePrompt: `A simple, cute, emoji-style illustration of a ${fruitName} on a white background. Minimalist, clean design, similar to Apple emoji style.`,
                width: 512,
                height: 512,
                numberResults: 1,
                outputFormat: "WEBP",
                CFGScale: 1,
                scheduler: "FlowMatchEulerDiscreteScheduler",
                strength: 0.8,
              }]
              
              ws.send(JSON.stringify(message))
            } else if (item.taskType === "imageInference") {
              resolve(item)
              ws.close()
            }
          })
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        reject(error)
      }
    })

    const result = await imagePromise
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})