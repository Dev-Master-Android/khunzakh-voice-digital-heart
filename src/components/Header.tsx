
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
// import schoolImage from "@/assets/school-building.jpg";
const schoolImage = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop";

interface HeaderProps {
  onCreatePost: () => void;
}

export function Header({ onCreatePost }: HeaderProps) {
  const { user, signOut } = useAuth();
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors text-xs sm:text-sm"
                  onClick={() => window.open('https://sh-xunzaxskaya-1-r82.gosweb.gosuslugi.ru/', '_blank')}
                >
                  <School className="w-3 h-3 mr-1" />
                  МКОУ Хунзахская СОШ №1
                </Badge>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight animate-fade-up">
                Голос
                <br />
                Школы<span className="text-primary">+</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-md animate-fade-up" style={{animationDelay: '0.1s'}}>
                Цифровое сердце нашей школы. Место для открытых идей, предложений и общения.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-up" style={{animationDelay: '0.2s'}}>
              <Button 
                onClick={onCreatePost}
                className="button-glow px-6 sm:px-8 py-3 text-sm sm:text-base font-medium w-full sm:w-auto relative overflow-hidden group"
                size="lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                <PlusCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2 relative z-10" />
                <span className="relative z-10">Оставить сообщение</span>
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer hover:ring-primary/40 transition-all mx-auto sm:mx-0">
                      <AvatarImage src="/placeholder.svg" alt="User avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground">
                        {user?.email?.charAt(0)?.toUpperCase() || 'У'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="card-glow min-w-48 animate-fade-up"
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
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  onClick={() => window.location.href = '/auth'}
                >
                  <User className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>
          
          {/* Right side - School image */}
          <div className="relative animate-fade-up order-first lg:order-last" style={{animationDelay: '0.3s'}}>
            <div className="card-glow rounded-2xl p-2 group cursor-pointer" onClick={() => window.open('https://sh-xunzaxskaya-1-r82.gosweb.gosuslugi.ru/', '_blank')}>
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src={schoolImage} 
                  alt="МКОУ Хунзахская СОШ №1" 
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Blurred overlay with school info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 sm:p-4 text-white transform translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 sm:w-6 h-5 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <School className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">МКОУ Хунзахская СОШ №1</span>
                      </div>
                      <p className="text-xs text-white/80">Дагестан, село Хунзах</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
