# Supabase Setup Instructions

## 1. Get Your Supabase Keys

1. Go to your Supabase project dashboard: https://behebhohabohiiparyie.supabase.co
2. Navigate to **Settings** > **API**
3. Copy the following keys:
   - **Project URL** (already configured): `https://behebhohabohiiparyie.supabase.co`
   - **anon public** key
   - **service_role** key (keep this secret!)

## 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://behebhohabohiiparyie.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

**Important**: Replace the placeholder keys with your actual Supabase keys.

## 3. Usage Examples

### Using the Supabase Client Directly

```typescript
import { supabase } from './src/lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert({ name: 'John', email: 'john@example.com' })
```

### Using the Utility Functions

```typescript
import { auth, db, storage } from './src/lib/supabase-utils'

// Authentication
const { data, error } = await auth.signIn('user@example.com', 'password')

// Database operations
const { data, error } = await db.select('users')
const { data, error } = await db.insert('posts', { title: 'Hello', content: 'World' })

// Storage operations
const { data, error } = await storage.upload('avatars', 'user1.jpg', file)
```

### Using the React Hook

```typescript
import { useSupabase } from './src/hooks/useSupabase'

function MyComponent() {
  const { user, loading, signIn, signOut } = useSupabase()

  const handleLogin = async () => {
    const { error } = await signIn('user@example.com', 'password')
    if (error) console.error('Login failed:', error.message)
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
    </div>
  )
}
```

## 4. Database Schema

Make sure to create your tables in the Supabase dashboard. Here's an example:

```sql
-- Example users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);
```

## 5. TypeScript Types

Generate TypeScript types for your database:

```bash
# Install Supabase CLI first
npm install -g supabase

# Generate types
supabase gen types typescript --project-id behebhohabohiiparyie > src/types/database.ts
```

Then update your `supabase.ts` file to use the generated types.

## 6. Next Steps

- Set up Row Level Security (RLS) policies in your Supabase dashboard
- Configure authentication providers (Google, GitHub, etc.)
- Set up storage buckets for file uploads
- Create database functions and triggers as needed

## Troubleshooting

If you encounter CORS issues, make sure your site URL is added to the allowed origins in Supabase settings:

1. Go to **Settings** > **API**
2. Add your development URL (e.g., `http://localhost:5173`) to **Additional Redirect URLs**
3. Add your production URL when deployed
