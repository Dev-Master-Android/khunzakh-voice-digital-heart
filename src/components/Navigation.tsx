import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, FolderOpen } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

const categories = ['Идея', 'Жалоба', 'Проблема', 'Предложение', 'Успех'];

export function Navigation({ activeTab, onTabChange, selectedCategory, onCategoryChange }: NavigationProps) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/50">
            <TabsTrigger 
              value="popular" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Популярное</span>
              <span className="sm:hidden">Топ</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="new" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Новое</span>
              <span className="sm:hidden">Новое</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="categories" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Категории</span>
              <span className="sm:hidden">Темы</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Categories Filter */}
        {activeTab === 'categories' && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onCategoryChange?.(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                !selectedCategory 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              Все категории
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange?.(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}