import { useState, useEffect } from "react";
import { ArrowLeft, Palette, Monitor, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";

type Theme = "light" | "dark" | "system";

const Settings = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Get saved theme from localStorage or default to dark
    const savedTheme = (localStorage.getItem("alice-theme") as Theme) || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.className = systemTheme;
    } else {
      root.className = newTheme;
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("alice-theme", newTheme);
    applyTheme(newTheme);
  };

  const getThemeIcon = (themeOption: Theme) => {
    switch (themeOption) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "system":
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ChatSidebar />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <header className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Chat
              </Button>
            </div>
            
            <h1 className="text-lg font-semibold">Settings</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </header>

          {/* Settings Content */}
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how Alice looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Theme</Label>
                  <RadioGroup 
                    value={theme} 
                    onValueChange={handleThemeChange}
                    className="grid grid-cols-1 gap-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer flex-1">
                        {getThemeIcon("light")}
                        <div>
                          <div className="font-medium">Light</div>
                          <div className="text-sm text-muted-foreground">Clean, bright interface</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer flex-1">
                        {getThemeIcon("dark")}
                        <div>
                          <div className="font-medium">Dark</div>
                          <div className="text-sm text-muted-foreground">Easy on the eyes, perfect for long sessions</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer flex-1">
                        {getThemeIcon("system")}
                        <div>
                          <div className="font-medium">System</div>
                          <div className="text-sm text-muted-foreground">Matches your device settings</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your theme looks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">A</span>
                    </div>
                    <div>
                      <div className="font-medium">Alice AI</div>
                      <div className="text-sm text-muted-foreground">Online</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm max-w-xs">
                        Hello Alice, how are you today?
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-alice-message-assistant border border-border px-3 py-2 rounded-lg text-sm max-w-xs">
                        I'm doing great! How can I help you today?
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;