'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Remove direct import of supabase client
// import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link'; // Import Link

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useAuth(); // Get supabase client from context

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // You might want to add options for email confirmation redirection
      // options: {
      //   emailRedirectTo: `${window.location.origin}/`,
      // },
    });

    if (error) {
      setError(error.message);
    } else if (data.user && data.user.identities?.length === 0) {
      // Handle case where user already exists but is unconfirmed
       setMessage('User already exists. Please check your email to confirm your account or try logging in.');
       setError(null); // Clear specific signup error
    } else if (data.user) {
       setMessage('Signup successful! Please check your email to confirm your account.');
       // Optionally redirect or clear form
       // setEmail('');
       // setPassword('');
       // setConfirmPassword('');
       // setTimeout(() => router.push('/login'), 5000); // Redirect after a delay
    } else {
        setError('An unexpected error occurred during signup.');
    }


    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
