import { useState } from "react";
import { spamProtection } from "@/lib/utils-school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (postData: any) => void;
}

const categories = [
  { value: 'Идея', label: 'Идея', icon: '💡' },
  { value: 'Жалоба', label: 'Жалоба', icon: '😔' },
  { value: 'Проблема', label: 'Проблема', icon: '😐' },
  { value: 'Предложение', label: 'Предложение', icon: '😊' },
  { value: 'Успех', label: 'Успех / Похвала', icon: '😍' }
];

export function CreatePostDialog({ open, onOpenChange, onSubmit }: CreatePostDialogProps) {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    showName: false,
    authorName: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.title || !formData.content) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    // Check spam protection
    if (!spamProtection.canPost()) {
      const remaining = Math.ceil(spamProtection.getCooldownRemaining() / 1000);
      toast({
        title: "Подождите",
        description: `Можно создать новый пост через ${remaining} секунд`,
        variant: "destructive"
      });
      return;
    }

    spamProtection.recordPost();
    onSubmit(formData);
    setFormData({
      category: '',
      title: '',
      content: '',
      showName: false,
      authorName: ''
    });
    onOpenChange(false);
    
    toast({
      title: "Спасибо!",
      description: "Ваш голос важен. Сообщение опубликовано.",
      className: "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-glow max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="w-6 h-6 text-primary" />
            Поделитесь своим мнением
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Категория *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent className="card-glow">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="hover:bg-primary/10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Заголовок *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Краткое описание вашего сообщения"
              className="bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Текст сообщения *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Расскажите подробнее о вашей идее, проблеме или предложении..."
              rows={5}
              className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showName"
                checked={formData.showName}
                onCheckedChange={(checked) => setFormData({...formData, showName: checked as boolean})}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="showName"
                className="text-sm cursor-pointer"
              >
                Указать имя (необязательно)
              </Label>
            </div>

            {formData.showName && (
              <Input
                value={formData.authorName}
                onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                placeholder="Ваше имя"
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 button-glow"
            >
              <Send className="w-4 h-4 mr-2" />
              Опубликовать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}