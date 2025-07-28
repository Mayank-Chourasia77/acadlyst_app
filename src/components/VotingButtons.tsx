import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Flag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface VotingButtonsProps {
  uploadId: string;
  initialVotes: number;
  onVoteChange?: (newVotes: number) => void;
}

export const VotingButtons = ({ uploadId, initialVotes, onVoteChange }: VotingButtonsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [userFlagged, setUserFlagged] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserVote();
      fetchUserFlag();
    }
  }, [user, uploadId]);

  const fetchUserVote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('votes')
        .select('value')
        .eq('user_id', user.id)
        .eq('upload_id', uploadId)
        .maybeSingle();

      if (error) throw error;
      setUserVote(data?.value || null);
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const fetchUserFlag = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('flags')
        .select('id')
        .eq('user_id', user.id)
        .eq('upload_id', uploadId)
        .maybeSingle();

      if (error) throw error;
      setUserFlagged(!!data);
    } catch (error) {
      console.error('Error fetching user flag:', error);
    }
  };

  const handleVote = async (value: number) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to vote on resources.',
        variant: 'destructive',
      });
      return;
    }

    setIsVoting(true);

    try {
      if (userVote === value) {
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('upload_id', uploadId);

        if (error) throw error;

        setUserVote(null);
        const newVotes = votes - value;
        setVotes(newVotes);
        onVoteChange?.(newVotes);
      } else {
        const { error } = await supabase
          .from('votes')
          .upsert({
            user_id: user.id,
            upload_id: uploadId,
            value: value,
          });

        if (error) throw error;

        const voteDifference = userVote ? value - userVote : value;
        setUserVote(value);
        const newVotes = votes + voteDifference;
        setVotes(newVotes);
        onVoteChange?.(newVotes);
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: 'Vote Failed',
        description: error.message || 'Failed to record vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleFlag = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to report content.',
        variant: 'destructive',
      });
      return;
    }

    if (userFlagged) {
      toast({
        title: 'Already Reported',
        description: 'You have already reported this content.',
      });
      return;
    }

    setIsFlagging(true);

    try {
      const { error } = await supabase.from('flags').insert({
        user_id: user.id,
        upload_id: uploadId,
        reason: 'User reported content',
      });

      if (error) throw error;

      setUserFlagged(true);
      toast({
        title: 'Content Reported',
        description: 'Thank you for reporting. We will review this content.',
      });
    } catch (error: any) {
      console.error('Error flagging:', error);
      toast({
        title: 'Action Failed',
        description: error.message || 'Failed to report content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFlagging(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={userVote === 1 ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className="flex items-center space-x-1"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{votes}</span>
      </Button>

      <Button
        variant={userFlagged ? 'destructive' : 'outline'}
        size="sm"
        onClick={handleFlag}
        disabled={isFlagging || userFlagged}
        className={!userFlagged ? 'text-red-600 hover:text-red-700' : ''}
      >
        <Flag className="h-4 w-4" />
      </Button>
    </div>
  );
};
