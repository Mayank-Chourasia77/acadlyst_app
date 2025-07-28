
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { FloatingAiChat } from '@/components/FloatingAiChat';

const AiChat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page since AI chat is now available as floating widget
    navigate('/');
  }, [navigate]);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Assistant</h1>
          <p className="text-gray-600">
            The AI assistant is now available as a floating chat widget on all pages.
            Look for the blue chat icon in the bottom-right corner!
          </p>
        </div>
      </div>
      <Footer />
      <FloatingAiChat />
    </>
  );
};

export default AiChat;
