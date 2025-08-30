import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen h-screen flex w-full bg-background overflow-hidden">
        <ChatSidebar />
        <ChatArea />
      </div>
    </SidebarProvider>
  );
};

export default Index;
