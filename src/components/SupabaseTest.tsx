import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { openrouter } from '../lib/openrouter'

export function SupabaseTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const testSupabaseConnection = async () => {
    setStatus('testing')
    setMessage('Testing Supabase connection...')
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('_test_connection').select('*').limit(1)
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected
        throw error
      }
      
      setStatus('success')
      setMessage('✅ Supabase connection successful!')
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Supabase connection failed: ${error.message}`)
    }
  }

  const testOpenRouter = async () => {
    setStatus('testing')
    setMessage('Testing OpenRouter integration...')
    
    try {
      const response = await openrouter.generateText('Hello! Please respond with a simple greeting.')
      setStatus('success')
      setMessage(`✅ OpenRouter response: ${response.substring(0, 100)}...`)
    } catch (error) {
      setStatus('error')
      setMessage(`❌ OpenRouter test failed: ${error.message}`)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Supabase & OpenRouter Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testSupabaseConnection}
          disabled={status === 'testing'}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Supabase Connection
        </button>
        
        <button
          onClick={testOpenRouter}
          disabled={status === 'testing'}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test OpenRouter Integration
        </button>
        
        {message && (
          <div className={`p-3 rounded ${
            status === 'success' ? 'bg-green-100 text-green-800' :
            status === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
