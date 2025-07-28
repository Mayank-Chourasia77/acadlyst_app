
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { Heart, Twitter, Linkedin, Instagram } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const SupportUs = () => {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleDonateClick = () => {
    // Create proper UPI deep link with all required parameters
    const upiId = '9967431900@yapl';
    const payeeName = 'Acadlyst';
    const amount = ''; // Optional - let user decide
    const note = 'Support Acadlyst Platform';
    
    // Construct UPI URL with proper encoding
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&tn=${encodeURIComponent(note)}${amount ? `&am=${amount}` : ''}`;
    
    console.log('Opening UPI URL:', upiUrl);
    
    // Try to open UPI app
    window.location.href = upiUrl;
    
    // Show thank you dialog after a short delay
    setTimeout(() => {
      setShowThankYou(true);
    }, 1000);
  };

  const shareMessage = "I just supported Acadlyst! Join me in making a difference. https://acadlystapp.vercel.app/";

  const handleShare = (platform: 'twitter' | 'linkedin' | 'instagram') => {
    let url = '';
    const encodedMessage = encodeURIComponent(shareMessage);

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://acadlystapp.vercel.app/')}&summary=${encodedMessage}`;
    } else if (platform === 'instagram') {
      // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
      navigator.clipboard.writeText(shareMessage).then(() => {
        alert('Message copied to clipboard! You can now paste it on Instagram.');
      }).catch(() => {
        alert('Please copy this message to share on Instagram: ' + shareMessage);
      });
      return;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white text-center mb-12 shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold">Join Us in Empowering Education!</h1>
          </div>

          {/* Mission Explanation */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">
              At Acadlyst, we believe that education should be accessible to everyone. Your support helps us maintain and improve the platform, keep resources free, and expand features for learners and contributors worldwide. Together, we can make a difference in education for everyone.
            </p>
          </div>

          {/* Donation Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Support Us Directly</h2>
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 grid md:grid-cols-2 gap-8 items-center">
              {/* QR Code */}
              <div className="text-center flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Scan to Pay with UPI</h3>
                <img 
                  src="/acadylst-uploads/d33d5030-a547-447c-a4f5-417d00e06876.png" 
                  alt="UPI QR Code for Acadlyst Donation" 
                  className="w-48 h-48 mx-auto rounded-lg border p-1"
                />
              </div>

              {/* UPI ID and Button */}
              <div className="text-center md:text-left flex flex-col items-center md:items-start">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Or use our UPI ID</h3>
                <p className="text-lg text-gray-800 font-mono bg-gray-200 p-2 rounded-md inline-block mb-6">9967431900@yapl</p>
                
                <Button
                  size="lg"
                  onClick={handleDonateClick}
                  className="w-full max-w-xs md:w-auto bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
                <p className="text-sm text-gray-500 mt-2">Clicking will open your UPI app with details pre-filled.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center font-bold">Thank You!</DialogTitle>
            <DialogDescription className="text-center text-md text-gray-600 pt-4">
              "Thank you for your generous contribution! Your support helps us keep Acadlyst running and free for everyone. Together, we're making education more accessible and empowering learners across the globe."
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 pt-4">
            <p className="text-sm font-semibold text-gray-700">Share your support!</p>
            <div className="flex space-x-2">
              <Button aria-label="Share on Twitter" variant="outline" size="icon" onClick={() => handleShare('twitter')}>
                <Twitter className="h-5 w-5" />
              </Button>
              <Button aria-label="Share on LinkedIn" variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button aria-label="Share on Instagram" variant="outline" size="icon" onClick={() => handleShare('instagram')}>
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <DialogFooter className="sm:justify-center pt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportUs;
