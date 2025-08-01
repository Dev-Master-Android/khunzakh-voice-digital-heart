import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, User, School, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import schoolImage from "@/assets/school-building.jpg";

interface HeaderProps {
  onCreatePost: () => void;
}

export function Header({ onCreatePost }: HeaderProps) {
  const { user, signOut } = useAuth();
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <School className="w-3 h-3 mr-1" />
                  МКОУ Хунзахская СОШ №1
                </Badge>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight animate-fade-up">
                Голос
                <br />
                Школы<span className="text-primary">+</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md animate-fade-up" style={{animationDelay: '0.1s'}}>
                Цифровое сердце нашей школы. Место для открытых идей, предложений и общения.
              </p>
            </div>
            
            <div className="flex items-center gap-3 animate-fade-up" style={{animationDelay: '0.2s'}}>
              <Button 
                onClick={onCreatePost}
                className="button-glow px-8 py-3 text-base font-medium"
                size="lg"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Оставить сообщение
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                      <AvatarImage src="/placeholder.svg" alt="User avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground">
                        {user?.email?.charAt(0)?.toUpperCase() || 'У'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="card-glow border-border/50 min-w-48 animate-fade-up"
                  >
                    <DropdownMenuItem 
                      className="text-muted-foreground cursor-pointer hover:text-foreground hover:bg-primary/10 transition-colors"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="lg" className="border-border/50 hover:border-primary/50">
                  <User className="w-5 h-5 mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>
          
          {/* Right side - School image */}
          <div className="relative animate-fade-up" style={{animationDelay: '0.3s'}}>
            <div className="card-glow rounded-2xl p-2 border border-border/30">
              <img 
                src={schoolImage} 
                alt="МКОУ Хунзахская СОШ №1" 
                className="w-full h-64 sm:h-80 object-cover rounded-xl"
              />
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="card-glow rounded-xl p-4 border border-border/30">
                  <Button 
                    onClick={onCreatePost}
                    className="w-full button-glow"
                  >
                    Оставить сообщение
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}