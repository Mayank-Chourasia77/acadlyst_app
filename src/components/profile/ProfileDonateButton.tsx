
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileDonateButtonProps {
  upiLink: string;
  userName: string;
}

export const ProfileDonateButton = ({ upiLink, userName }: ProfileDonateButtonProps) => {
  const { toast } = useToast();

  const handleDonate = () => {
    console.log('Opening UPI link for user:', userName, 'UPI:', upiLink);
    
    try {
      // Parse the UPI ID from the upiLink if it's already a full UPI URL
      let upiId = upiLink;
      if (upiLink.startsWith('upi://')) {
        const urlParams = new URLSearchParams(upiLink.split('?')[1]);
        upiId = urlParams.get('pa') || upiLink;
      }
      
      // Create proper UPI deep link with all required parameters (same logic as /support-us page)
      const payeeName = encodeURIComponent(userName);
      const note = encodeURIComponent(`Support ${userName} on Acadlyst`);
      
      // Construct UPI URL with proper encoding for maximum compatibility
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${payeeName}&tn=${note}`;
      
      console.log('Constructed UPI URL:', upiUrl);
      
      // Open the UPI app
      window.location.href = upiUrl;
      
      toast({
        title: 'Opening UPI App',
        description: `Opening your UPI app to support ${userName}`,
      });
    } catch (error) {
      console.error('Error opening UPI app:', error);
      toast({
        title: 'Error',
        description: 'Could not open UPI app. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 rounded-lg opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
      <Button
        onClick={handleDonate}
        variant="outline"
        size="sm"
        className="relative flex items-center space-x-2 bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800 hover:text-white hover:scale-105 transition-all duration-300"
      >
        <Heart className="h-4 w-4 text-red-500 fill-red-500 group-hover:animate-pulse" />
        <span>Support/Donate</span>
      </Button>
    </div>
  );
};
