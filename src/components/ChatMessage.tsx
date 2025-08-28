import { Bot, User } from "lucide-react";
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

  return (
    <div className={cn(
      "flex gap-4 max-w-4xl mx-auto message-slide-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        ) : (
          <img 
            src={aliceAvatar} 
            alt="Alice" 
            className="w-8 h-8 rounded-full alice-glow"
          />
        )}
      </div>

      {/* Message content */}
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-md" 
            : "bg-alice-message-assistant border border-border rounded-bl-md"
        )}>
          {isTyping ? (
            <div className="flex items-center gap-1">
              <span>Alice is typing</span>
              <div className="flex gap-1 ml-2">
                <div className="w-1 h-1 bg-current rounded-full typing-dots"></div>
                <div className="w-1 h-1 bg-current rounded-full typing-dots"></div>
                <div className="w-1 h-1 bg-current rounded-full typing-dots"></div>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground px-1">
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
}