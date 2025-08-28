import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Alice, your AI assistant. I'm here to help you with anything you need. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand what you're saying. Let me help you with that.",
        "That's an interesting question! Here's what I think about it...",
        "I'd be happy to assist you with that task. Let me break it down for you.",
        "Great question! Based on my knowledge, I can provide you with several insights.",
        "I see what you're looking for. Here are some suggestions that might help.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-8 w-8" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="font-semibold text-lg">Alice AI</h1>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Ready to help
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-6 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="alice-gradient w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to Alice</h2>
              <p className="text-muted-foreground max-w-md">
                Your intelligent AI assistant is ready to help. Ask me anything or start a conversation!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isTyping && (
                <ChatMessage
                  message=""
                  isUser={false}
                  timestamp={new Date()}
                  isTyping={true}
                />
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
}