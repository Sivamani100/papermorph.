# Vercel Deployment Guide for PaperMorph

## ✅ Pre-Configuration Complete

Your Supabase keys have been configured in the codebase:
- **URL**: `https://behebhohabohiiparyie.supabase.co`
- **Anon Key**: Already integrated in `src/lib/supabase.ts`

## 🚀 Deploy to Vercel

### Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel CLI
```bash
vercel
```

### Step 3: Deploy via Vercel Web Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import the project
4. Vercel will automatically detect the Vite configuration

## 🔧 Environment Variables in Vercel

The Supabase keys are already configured in `vercel.json`, but you can also add them manually:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add these variables:
   ```
   VITE_SUPABASE_URL=https://behebhohabohiiparyie.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlaGViaG9oYWJvaGlpcGFyeWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDQyMDksImV4cCI6MjA4NDIyMDIwOX0.3p0iFtzKq0FCaTARslaKatEMd5JvGclfYeLBFNdioyc
   ```

## 🔑 Setting Up OpenRouter API Key in Supabase

### Method 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://behebhohabohiiparyie.supabase.co
2. Navigate to **Settings** > **Edge Functions**
3. Click **Add Environment Variable**
4. Add:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `your-actual-openrouter-api-key`

### Method 2: Via Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref behebhohabohiiparyie

# Set the secret
supabase secrets set OPENROUTER_API_KEY=your-actual-openrouter-api-key
```

## 📦 Deploy Supabase Edge Functions

### Option 1: Using Supabase CLI
```bash
# Deploy the OpenRouter function
supabase functions deploy openrouter
```

### Option 2: Via Supabase Dashboard
1. Go to **Edge Functions** in your Supabase dashboard
2. Click **New Function**
3. Name it `openrouter`
4. Copy the content from `supabase/functions/openrouter/index.ts`
5. Click **Deploy**

## 🧪 Test Your Deployment

### Test Supabase Connection
```typescript
import { supabase } from './src/lib/supabase'

// Test connection
const { data, error } = await supabase.from('_test_connection').select('*')
console.log('Supabase connected:', !error)
```

### Test OpenRouter Function
```typescript
import { openrouter } from './src/lib/openrouter'

// Test OpenRouter integration
const response = await openrouter.generateText('Hello, world!')
console.log('OpenRouter response:', response)
```

## 🔍 CORS Configuration

Your Supabase Edge Function already includes CORS headers. If you need to add your Vercel domain specifically:

1. Go to Supabase **Settings** > **API**
2. Add your Vercel URL to **Additional Redirect URLs**
3. Example: `https://your-app.vercel.app`

## 🚨 Important Notes

1. **Environment Variables**: Make sure your OpenRouter API key is set in Supabase, not Vercel
2. **CORS**: The Edge Function handles CORS, but your domain should be whitelisted in Supabase
3. **Service Role Key**: Keep your service role key secret - never expose it in client-side code
4. **Function URL**: Once deployed, your function will be available at:
   `https://behebhohabohiiparyie.supabase.co/functions/v1/openrouter`

## 🎯 Next Steps

1. Deploy your app to Vercel
2. Deploy the OpenRouter Edge Function to Supabase
3. Set your OpenRouter API key in Supabase secrets
4. Test the integration
5. Your PaperMorph app is ready for production!

## 🐛 Troubleshooting

### Common Issues:
- **CORS errors**: Add your Vercel domain to Supabase redirect URLs
- **Function not found**: Make sure the Edge Function is deployed correctly
- **API key errors**: Verify the OpenRouter API key is set in Supabase secrets
- **Build errors**: Check that all environment variables are properly configured

### Debug Commands:
```bash
# Check function logs
supabase functions logs openrouter

# Test function locally
supabase functions serve openrouter
```
