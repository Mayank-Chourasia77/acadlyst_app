
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Gift, Lock, Unlock, DollarSign } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Switch } from '@/components/ui/switch';

interface UpiUnlockProps {
  totalUploads: number;
  totalVotes: number;
  currentUpiLink?: string | null;
  currentIsUpiPublic?: boolean;
}

export const UpiUnlock = ({ totalUploads, totalVotes, currentUpiLink, currentIsUpiPublic }: UpiUnlockProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [upiLink, setUpiLink] = useState(currentUpiLink || '');
  const [isPublic, setIsPublic] = useState(!!currentIsUpiPublic);
  const { isAdmin } = useAdmin();

  const requiredUploads = 10;
  const requiredVotes = 100;
  const isEligibleByUser = totalUploads >= requiredUploads && totalVotes >= requiredVotes;
  const isEligible = isEligibleByUser || isAdmin;
  const hasUpiLink = !!currentUpiLink;

  const updateUpiMutation = useMutation({
    mutationFn: async (newData: { upi_link: string, is_upi_public: boolean }) => {
      const { error } = await supabase
        .from('users')
        .update({ upi_link: newData.upi_link, is_upi_public: newData.is_upi_public })
        .eq('id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: 'UPI Details Updated',
        description: 'Your UPI donation details have been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update UPI details.',
        variant: 'destructive',
      });
    },
  });

  const handleSaveUpi = () => {
    if (!upiLink.trim()) {
      toast({
        title: 'Invalid UPI Link',
        description: 'Please enter a valid UPI link.',
        variant: 'destructive',
      });
      return;
    }
    updateUpiMutation.mutate({ upi_link: upiLink, is_upi_public: isPublic });
  };

  const uploadProgress = Math.min((totalUploads / requiredUploads) * 100, 100);
  const voteProgress = Math.min((totalVotes / requiredVotes) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gift className="h-5 w-5" />
          <span>UPI Donation Unlock</span>
          {isEligible ? (
            <Unlock className="h-5 w-5 text-green-500" />
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">
            {isEligible 
              ? (isAdmin && !isEligibleByUser)
                ? 'Admin access grants UPI feature!'
                : '🎉 Congratulations! You can now add your UPI donation link!'
              : 'Unlock UPI donations by reaching the requirements below:'
            }
          </p>
          <p className="text-sm text-gray-600">
            Share your UPI link so the community can support your work with donations!
          </p>
        </div>

        {/* Progress Requirements */}
        {(!isAdmin || isEligibleByUser) && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Uploads Required</Label>
                <span className="text-sm font-medium">
                  {totalUploads}/{requiredUploads}
                </span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">
                {totalUploads >= requiredUploads 
                  ? '✅ Requirement met!' 
                  : `${requiredUploads - totalUploads} more uploads needed`
                }
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Total Votes Required</Label>
                <span className="text-sm font-medium">
                  {totalVotes}/{requiredVotes}
                </span>
              </div>
              <Progress value={voteProgress} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">
                {totalVotes >= requiredVotes 
                  ? '✅ Requirement met!' 
                  : `${requiredVotes - totalVotes} more votes needed`
                }
              </p>
            </div>
          </div>
        )}

        {/* UPI Link Input */}
        {isEligible && (
          <div className="space-y-4 border-t pt-6">
            <div>
              <Label htmlFor="upi-link">UPI Payment Link</Label>
              <Input
                id="upi-link"
                type="url"
                value={upiLink}
                onChange={(e) => setUpiLink(e.target.value)}
                placeholder="upi://pay?pa=yourname@paytm&pn=Your%20Name"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your UPI payment link (e.g., from PhonePe, Paytm, GPay)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="upi-public" className="font-medium">
                  Show on Public Profile
                </Label>
                <Switch
                  id="upi-public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  disabled={!upiLink.trim()}
                />
              </div>
              <p className="text-xs text-gray-500">
                If enabled, your UPI link will be visible to everyone on your profile.
              </p>
            </div>

            <Button 
              onClick={handleSaveUpi}
              disabled={updateUpiMutation.isPending}
              className="w-full"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {hasUpiLink ? 'Update UPI Details' : 'Save UPI Details'}
            </Button>

            {hasUpiLink && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✅ Your UPI donation link is active! {isPublic ? 'It is currently public.' : 'It is currently private.'}
                </p>
              </div>
            )}
          </div>
        )}

        {!isEligible && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Keep contributing to unlock the UPI donation feature!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
