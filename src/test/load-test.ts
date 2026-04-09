import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || ''
const CONCURRENT_CONNECTIONS = 100 // Scale to 10,000 in a real environment

async function simulateConnections() {
  console.log(`Starting load test with ${CONCURRENT_CONNECTIONS} connections...`)
  
  const clients = []
  
  for (let i = 0; i < CONCURRENT_CONNECTIONS; i++) {
    const client = createClient(SUPABASE_URL, SUPABASE_KEY)
    
    // Subscribe to a random driver channel
    const channel = client
      .channel(`load_test_${i}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_locations' }, (payload) => {
        // console.log(`Client ${i} received message`)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // console.log(`Client ${i} connected`)
        }
      })
    
    clients.push({ client, channel })
    
    if (i % 10 === 0) {
      console.log(`Created ${i} connections...`)
    }
    
    // Small delay to prevent local machine overflow
    await new Response(new ReadableStream({ start(c) { setTimeout(() => c.close(), 50) } }))
  }

  console.log('All connections established. Monitoring for 60 seconds...')
  
  await new Promise(resolve => setTimeout(resolve, 60000))
  
  console.log('Cleaning up...')
  for (const { channel } of clients) {
    channel.unsubscribe()
  }
  
  console.log('Load test completed.')
}

simulateConnections().catch(console.error)
