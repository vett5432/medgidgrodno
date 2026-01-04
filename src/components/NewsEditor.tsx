import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MedicalNews } from '../types';

interface NewsEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (news: Omit<MedicalNews, 'id'>) => void;
}

export function NewsEditor({ open, onClose, onSave }: NewsEditorProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MedicalNews['category']>('health');
  const [imageUrl, setImageUrl] = useState('');
  const [source, setSource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !summary || !content) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const newsData: Omit<MedicalNews, 'id'> = {
      title,
      summary,
      content,
      category,
      date: new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || undefined,
      source: source || undefined
    };

    onSave(newsData);
    
    // Reset form
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('health');
    setImageUrl('');
    setSource('');
    
    onClose();
  };

  const handleCancel = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('health');
    setImageUrl('');
    setSource('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Добавить медицинскую новость</DialogTitle>
          <DialogDescription>
            Создайте новую медицинскую новость для публикации на сайте
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="news-title">
              Заголовок новости <span className="text-red-500">*</span>
            </Label>
            <Input
              id="news-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок новости"
              required
            />
          </div>

          <div>
            <Label htmlFor="news-category">Категория</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as MedicalNews['category'])}>
              <SelectTrigger id="news-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Здоровье</SelectItem>
                <SelectItem value="announcement">Объявления</SelectItem>
                <SelectItem value="prevention">Профилактика</SelectItem>
                <SelectItem value="research">Исследования</SelectItem>
                <SelectItem value="events">События</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="news-summary">
              Краткое описание <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="news-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Краткое описание новости (1-2 предложения)"
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="news-content">
              Полный текст новости <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="news-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите полный текст новости"
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="news-image">URL изображения</Label>
            <Input
              id="news-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg (необязательно)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Можно использовать ссылки с Unsplash или других источников
            </p>
          </div>

          <div>
            <Label htmlFor="news-source">Источник</Label>
            <Input
              id="news-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Например: Министерство здравоохранения РБ"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Предварительный просмотр</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Заголовок:</span> {title || '(не указан)'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Категория:</span>{' '}
                {category === 'health' && 'Здоровье'}
                {category === 'announcement' && 'Объявления'}
                {category === 'prevention' && 'Профилактика'}
                {category === 'research' && 'Исследования'}
                {category === 'events' && 'События'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Краткое описание:</span> {summary || '(не указано)'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Опубликовать новость
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
