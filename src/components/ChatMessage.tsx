import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import aliceAvatar from "@/assets/alice-avatar.png";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export function ChatMessage({ message, isUser, timestamp, isTyping = false }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isTyping) {
    return (
      <div className="flex gap-4 max-w-4xl mx-auto animate-fade-in">
        <Avatar className="w-8 h-8 shrink-0 border-2 border-primary/20 shadow-lg">
          <AvatarImage src={aliceAvatar} alt="Alice" />
          <AvatarFallback className="alice-gradient text-white text-xs">
            <Sparkles className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="text-xs text-muted-foreground">Alice is typing...</div>
          <div className="bg-alice-message-assistant p-4 rounded-2xl rounded-tl-md border border-border/30 backdrop-blur-sm shadow-md">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full typing-dots"></div>
              <div className="w-2 h-2 bg-primary rounded-full typing-dots"></div>
              <div className="w-2 h-2 bg-primary rounded-full typing-dots"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex gap-4 max-w-4xl mx-auto message-slide-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <Avatar className="w-8 h-8 shrink-0 border-2 border-primary/20 shadow-lg">
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={aliceAvatar} alt="Alice" />
            <AvatarFallback className="alice-gradient text-white text-xs">
              <Sparkles className="w-4 h-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Message content */}
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className="text-xs text-muted-foreground">
          {isUser ? 'You' : 'Alice'} • {formatTime(timestamp)}
        </div>
        <div className={cn(
          "p-4 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-md border-primary/30 alice-glow" 
            : "bg-alice-message-assistant border-border/30 rounded-tl-md hover:bg-card/70"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}