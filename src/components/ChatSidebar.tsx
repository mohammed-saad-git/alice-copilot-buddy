import { useState } from "react";
import { Plus, MessageSquare, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import aliceAvatar from "@/assets/alice-avatar.png";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  isActive: boolean;
}

export function ChatSidebar() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Welcome to Alice",
      timestamp: new Date(),
      isActive: true,
    },
    {
      id: "2", 
      title: "Help with coding",
      timestamp: new Date(Date.now() - 3600000),
      isActive: false,
    },
    {
      id: "3",
      title: "Project planning",
      timestamp: new Date(Date.now() - 7200000),
      isActive: false,
    },
  ]);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New conversation",
      timestamp: new Date(),
      isActive: false,
    };
    setSessions([newSession, ...sessions]);
  };

  const selectSession = (id: string) => {
    setSessions(sessions.map(session => ({
      ...session,
      isActive: session.id === id
    })));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours === 0) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src={aliceAvatar} 
            alt="Alice AI" 
            className="w-8 h-8 rounded-full alice-glow"
          />
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Alice</h2>
            <p className="text-xs text-sidebar-foreground/60">AI Assistant</p>
          </div>
        </div>
        <Button 
          onClick={createNewChat}
          variant="outline" 
          size="sm"
          className="mt-3 w-full justify-start gap-2 border-sidebar-border hover:bg-sidebar-accent"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton 
                    onClick={() => selectSession(session.id)}
                    className={cn(
                      "w-full justify-between group",
                      session.isActive && "bg-sidebar-accent"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {session.title}
                        </p>
                        <p className="text-xs text-sidebar-foreground/60">
                          {formatTime(session.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/settings")}
          className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}