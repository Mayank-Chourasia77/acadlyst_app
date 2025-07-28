
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { PasswordInput } from '@/components/ui/password-input';

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "PASSWORD_RECOVERY") {
        setIsVerifying(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setIsVerifying(false);
      } else {
        setTimeout(() => setIsVerifying(false), 2000);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
        toast({
            title: 'Error',
            description: 'Password should be at least 6 characters.',
            variant: 'destructive',
        });
        return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Your password has been updated successfully.',
      });
      navigate('/notes');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
           <Card className="w-full max-w-md text-center">
                <CardHeader>
                   <CardTitle>Verifying</CardTitle>
               </CardHeader>
               <CardContent>
                   <p>Verifying your password reset request...</p>
               </CardContent>
           </Card>
       </div>
    )
  }

  if (!session) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md text-center">
                 <CardHeader>
                    <CardTitle>Invalid or Expired Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This password recovery link is invalid or has expired. Please request a new one.</p>
                </CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Update Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <PasswordInput
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
