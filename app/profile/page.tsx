'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  status: string;
  avatar_url?: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, supabase } = useAuth();
  const [profile, setProfile] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch profile from team_members table based on auth user's email
        const { data, error: dbError } = await supabase
          .from('team_members')
          .select('*')
          .eq('email', user.email)
          .single(); // Assuming email is unique

        if (dbError) {
          console.error('Error fetching profile:', dbError);
          throw new Error('Could not load profile data.');
        }

        if (data) {
          setProfile(data as TeamMember);
        } else {
          // Handle case where user exists in auth but not in team_members
          // You might want to create a default profile or show a specific message
          console.warn('User authenticated but no profile found in team_members table.');
          setError('Profile details not found. Please contact an administrator.');
          // Optionally, create a basic profile object from auth data
          // setProfile({ email: user.email, name: 'User', role: 'Unknown', status: 'Active', id: user.id, created_at: user.created_at || new Date().toISOString() });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  return (
    <div>
      <PageHeader title="User Profile" description="View and manage your profile information." />
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && profile && (
              <div className="space-y-4">
                 <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
                      <AvatarFallback>{profile.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                <div><strong>Role:</strong> {profile.role}</div>
                <div><strong>Phone:</strong> {profile.phone || 'N/A'}</div>
                <div><strong>Status:</strong> {profile.status}</div>
                <div><strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}</div>
                {/* Add more fields or edit functionality as needed */}
              </div>
            )}
             {!loading && !error && !profile && (
                <p>No profile information available.</p> // Fallback if profile is null after loading without error
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
