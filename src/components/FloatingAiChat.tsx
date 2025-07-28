import React, { useState, useRef, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Send, ThumbsUp, ThumbsDown, Loader2, X, Minimize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ChatMessage {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  feedback?: 'up' | 'down';
}

const FloatingAiChatContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const query = input.trim();
    setInput('');
    setIsLoading(true);

    const tempId = Date.now().toString();
    const newMessage: ChatMessage = {
      id: tempId,
      query,
      response: '',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { query, userId: user.id }
      });

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, id: data.chatId || tempId, response: data.response }
          : msg
      ));
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
      
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, feedback: 'up' | 'down') => {
    try {
      const { error } = await supabase.functions.invoke('chat-feedback', {
        body: { 
          chatId: messageId, 
          feedback, 
          userId: user?.id 
        }
      });

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback }
          : msg
      ));

      toast({
        title: 'Thank you!',
        description: 'Your feedback has been recorded.'
      });
    } catch (error) {
      console.error('Feedback error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleOpen = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to use the AI assistant.',
        variant: 'destructive'
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpen}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>AI Study Assistant</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Ask me anything about studies!</p>
                <p className="text-sm mt-2">Study tips, interview prep, career guidance...</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-blue-600 text-white rounded-lg px-3 py-2">
                    <p className="text-sm">{message.query}</p>
                  </div>
                </div>

                {/* AI Response */}
                {message.response && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%]">
                      <Card>
                        <CardContent className="p-3">
                          <p className="text-sm whitespace-pre-wrap">{message.response}</p>
                          
                          {/* Feedback Buttons */}
                          <div className="flex items-center gap-1 mt-2 pt-2 border-t">
                            <span className="text-xs text-gray-600">Helpful?</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, 'up')}
                              className={`h-6 w-6 p-0 ${
                                message.feedback === 'up' 
                                  ? 'text-green-600 bg-green-50' 
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, 'down')}
                              className={`h-6 w-6 p-0 ${
                                message.feedback === 'down' 
                                  ? 'text-red-600 bg-red-50' 
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-[80%]">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const FloatingAiChat = () => {
  return (
    <AuthProvider>
      <FloatingAiChatContent />
    </AuthProvider>
  );
};
