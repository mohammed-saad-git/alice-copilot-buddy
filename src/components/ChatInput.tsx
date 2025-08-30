import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border/30 bg-card/20 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto p-4">
        <div className="relative">
          {/* Input container */}
          <div className="flex items-end gap-3 p-3 rounded-2xl bg-alice-chat-input border border-border/50 shadow-lg hover:bg-card/70 focus-within:bg-card/80 transition-all duration-300 backdrop-blur-sm">
            {/* Attachment button */}
            <Button
              size="sm"
              variant="ghost"
              className="flex-shrink-0 h-8 w-8 p-0 rounded-full hover:bg-accent/50 transition-all duration-300"
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Text input */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message Alice..."
              disabled={disabled}
              className={cn(
                "min-h-0 max-h-32 resize-none border-0 bg-transparent",
                "focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-1",
                "placeholder:text-muted-foreground/70 text-sm"
              )}
              rows={1}
              style={{
                height: 'auto',
                minHeight: '24px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />

            {/* Voice input button */}
            <Button
              size="sm"
              variant="ghost"
              className="flex-shrink-0 h-8 w-8 p-0 rounded-full hover:bg-accent/50 transition-all duration-300"
              disabled={disabled}
            >
              <Mic className="w-4 h-4" />
            </Button>

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              size="sm"
              className={cn(
                "flex-shrink-0 h-8 w-8 p-0 rounded-full",
                "alice-gradient hover:scale-105 alice-glow shadow-lg",
                "disabled:opacity-50 disabled:scale-100 disabled:shadow-none",
                "transition-all duration-300"
              )}
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>

          {/* Helper text */}
          <div className="flex justify-between items-center mt-3 px-2">
            <span className="text-xs text-muted-foreground/70">
              {message.length > 0 && `${message.length} characters`}
            </span>
            <span className="text-xs text-muted-foreground/70">
              Press Enter to send, Shift+Enter for new line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}