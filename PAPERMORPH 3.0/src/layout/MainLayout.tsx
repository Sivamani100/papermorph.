import { Topbar } from '@/components/Topbar';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { EditorWrapper } from '@/components/EditorWrapper';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <Topbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <SidebarLeft />

        {/* Center - Editor or Custom Content */}
        {children || <EditorWrapper />}

        {/* Right Sidebar - AI Panel */}
        <SidebarRight />
      </div>
    </div>
  );
}
