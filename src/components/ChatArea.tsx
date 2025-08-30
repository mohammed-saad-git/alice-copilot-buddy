import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sparkles, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  const [mode, setMode] = useState<"flash" | "pro">("flash");
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
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center gap-3 animate-fade-in">
          <SidebarTrigger className="h-8 w-8 hover:bg-accent/50 transition-colors" />
          <div className="flex items-center gap-2">
            <div className="alice-gradient w-8 h-8 rounded-full flex items-center justify-center animate-glow-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Alice AI
            </h1>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {mode === "flash" ? "Flash" : "Pro"}
              <span className="text-xs text-muted-foreground">
                {mode === "flash" ? "(balanced mode)" : "(advanced mode)"}
              </span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem 
              onClick={() => setMode("flash")}
              className={mode === "flash" ? "bg-accent" : ""}
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium">Flash</div>
                <div className="text-xs text-muted-foreground">Balanced mode - Quick and efficient responses</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setMode("pro")}
              className={mode === "pro" ? "bg-accent" : ""}
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium">Pro</div>
                <div className="text-xs text-muted-foreground">Advanced mode - Detailed and comprehensive responses</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Messages area */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-background/20">
        <div className="space-y-6 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="alice-gradient w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-glow-pulse shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome to Alice
              </h2>
              <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                Your intelligent AI assistant is ready to help. Ask me anything or start a conversation!
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div className="p-4 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 cursor-pointer">
                  <h3 className="font-semibold text-sm mb-2">💡 Creative Writing</h3>
                  <p className="text-xs text-muted-foreground">Get help with stories, essays, and creative content</p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 cursor-pointer">
                  <h3 className="font-semibold text-sm mb-2">🔧 Problem Solving</h3>
                  <p className="text-xs text-muted-foreground">Find solutions to coding and technical challenges</p>
                </div>
              </div>
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
      <div className="relative z-10 bg-gradient-to-t from-background via-background/95 to-transparent">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}