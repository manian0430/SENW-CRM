'use client';

'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// Import AuthChangeEvent type along with others
import { Session, User, SupabaseClient, AuthChangeEvent } from '@supabase/supabase-js';
// Correct the import to createBrowserClient
import { useRouter } from 'next/navigation'; // Import useRouter
import { createBrowserClient } from '@supabase/ssr';

interface AuthContextType {
  supabase: SupabaseClient; // Expose the client instance
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize the browser client
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Get router instance

  useEffect(() => {
    const getSession = async () => {
      // Use the client component client instance
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Use the browser client instance for the listener
    // Add explicit types for the callback parameters
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null;
        // Only update state if the user actually changed
        // Remove router.refresh() here as it might conflict with login page logic
        if (JSON.stringify(user) !== JSON.stringify(currentUser)) {
            setSession(session);
            setUser(currentUser);
            // router.refresh(); // Removed refresh from here
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Add supabase client to dependency array

  const signOut = async () => {
    // Use the client component client instance
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    router.refresh(); // Refresh server components on sign out
    router.push('/login'); // Redirect to login after sign out
  };

  const value = {
    supabase, // Provide the client instance through context
    session,
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
