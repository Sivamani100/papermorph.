import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Zap,
  Palette,
  Grid3x3,
  BarChart3,
  Layers,
} from 'lucide-react';
import AnimatedDiagram from '@/components/AnimatedDiagram';
import EnhancedTable from '@/components/EnhancedTable';
import ThemeSelector from '@/components/ThemeSelector';

const sampleTableData = [
  { id: '1', feature: 'Interactive Diagrams', status: 'Active', category: 'Visualization' },
  { id: '2', feature: 'Theme Selector', status: 'Active', category: 'Customization' },
  { id: '3', feature: 'Enhanced Tables', status: 'Active', category: 'Data' },
  { id: '4', feature: 'Image Hover Effects', status: 'Active', category: 'UI' },
  { id: '5', feature: 'Smooth Animations', status: 'Active', category: 'Experience' },
  { id: '6', feature: 'Template Cards', status: 'Active', category: 'UI' },
];

export function FeaturesShowcase() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Feature Cards */}
        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-accent" />
              Interactive Diagrams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pan & zoom diagrams with smooth interactions. Scroll to zoom, drag to pan.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4 text-accent" />
              Theme Selector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Choose from multiple accent themes. Persists across sessions.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Grid3x3 className="h-4 w-4 text-accent" />
              Enhanced Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Search, sort, and filter with zebra striping for better readability.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-accent" />
              Template Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Hover actions, smooth image zoom, and entrance animations.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-accent" />
              Live Animations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Fade-in, slide-in, and pulse animations for smooth UX.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-accent" />
              Responsive Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              All components work beautifully on mobile, tablet & desktop.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Features Tab */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Feature Overview</CardTitle>
              <CardDescription>All interactive components available in your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">🎨 Customization</h4>
                <p className="text-xs text-muted-foreground">
                  Use the palette icon in the topbar to switch between Blue, Purple, Green, and Red accent themes.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">📊 Data Visualization</h4>
                <p className="text-xs text-muted-foreground">
                  Interactive diagrams support pan/zoom for better exploration of complex flows and relationships.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">🔍 Enhanced Tables</h4>
                <p className="text-xs text-muted-foreground">
                  Search, sort by clicking column headers, and enjoy zebra-striped rows for better readability.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">✨ Smooth Interactions</h4>
                <p className="text-xs text-muted-foreground">
                  Hover effects on template cards reveal quick actions (Preview, Use, Favorite).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagrams" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Diagram Demo</CardTitle>
              <CardDescription>Scroll to zoom, drag to pan, and explore</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedDiagram />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Table Demo</CardTitle>
              <CardDescription>Search, sort, and filter features showcase</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                columns={[
                  { key: 'feature', label: 'Feature' },
                  { key: 'status', label: 'Status' },
                  { key: 'category', label: 'Category' },
                ]}
                data={sampleTableData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FeaturesShowcase;
