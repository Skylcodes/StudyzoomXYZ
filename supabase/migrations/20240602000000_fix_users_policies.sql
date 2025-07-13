-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can do everything" ON public.users;

-- Create policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = id AND role = 'free');

-- Service role has full access (for admin operations)
DROP POLICY IF EXISTS "Service role has full access" ON public.users;
CREATE POLICY "Service role has full access" 
  ON public.users 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  ); 