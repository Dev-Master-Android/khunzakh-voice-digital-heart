import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, FolderOpen } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

const categories = ['Идея', 'Жалоба', 'Проблема', 'Предложение', 'Успех'];

const tabs = [
  { id: 'popular', label: 'Популярное', icon: TrendingUp },
  { id: 'new', label: 'Новое', icon: Clock },
  { id: 'categories', label: 'Категории', icon: FolderOpen }
];

export function Navigation({ activeTab, onTabChange, selectedCategory, onCategoryChange }: NavigationProps) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <div className="flex bg-card/50 backdrop-blur-md rounded-xl p-1 border border-border/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 button-glow' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:shadow-md'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label.slice(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Categories Filter */}
        {activeTab === 'categories' && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <button
              onClick={() => onCategoryChange?.(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 ${
                !selectedCategory 
                  ? 'bg-primary text-primary-foreground button-glow' 
                  : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-primary/20'
              }`}
            >
              Все категории
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange?.(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground button-glow' 
                    : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-primary/20'
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