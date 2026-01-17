# Manual Supabase Edge Function Deployment

Since the CLI installation is having issues, let's deploy the function manually through the dashboard.

## Method 1: Deploy via Supabase Dashboard (Recommended)

1. **Go to your Supabase project:**
   https://behebhohabohiiparyie.supabase.co

2. **Navigate to Edge Functions:**
   - In the left sidebar, click on "Edge Functions"
   - Click "New Function"

3. **Create the function:**
   - **Function name**: `openrouter`
   - **Verify URL**: `https://behebhohabohiiparyie.supabase.co/functions/v1/openrouter`

4. **Copy the function code:**
   - Open the file: `supabase/functions/openrouter/index.ts`
   - Copy all the content
   - Paste it into the Supabase editor

5. **Set Environment Variables:**
   - Go to **Settings** > **Edge Functions**
   - Click **Add Environment Variable**
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: Your actual OpenRouter API key

6. **Deploy:**
   - Click **Deploy** in the Edge Function editor
   - Wait for deployment to complete

## Method 2: Install CLI via npm (alternative)

If you want to try the CLI later, you can use:

```bash
# Install via npm (newer method)
npm install -g @supabase/supabase-js

# Or install via scoop (Windows package manager)
scoop install supabase

# Or download directly from GitHub releases
# https://github.com/supabase/cli/releases
```

## Test the Function

Once deployed, test it with this curl command:

```bash
curl -X POST "https://behebhohabohiiparyie.supabase.co/functions/v1/openrouter" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello! Please respond with a simple greeting.",
    "model": "anthropic/claude-3.5-sonnet"
  }'
```

## Update Your AITextEnhancer Component

I noticed your AITextEnhancer is calling OpenRouter directly. Let's update it to use our Supabase Edge Function:

```typescript
// Replace the direct OpenRouter API call with:
const response = await fetch(
  'https://behebhohabohiiparyie.supabase.co/functions/v1/openrouter',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}` // Your anon key
    },
    body: JSON.stringify({
      prompt: option.prompt + selectedText,
      model: 'anthropic/claude-3.5-sonnet'
    })
  }
);
```

## Benefits of Using Edge Function

✅ **Security**: API key is stored server-side
✅ **CORS**: Already handled in the function
✅ **Rate Limiting**: Can be controlled server-side
✅ **Logging**: Better error tracking
✅ **Future-proof**: Easy to add more AI providers

## Next Steps

1. Deploy the function manually via dashboard
2. Set your OpenRouter API key in Supabase
3. Test with the curl command
4. Update your AITextEnhancer to use the Edge Function
5. Deploy your app to Vercel
