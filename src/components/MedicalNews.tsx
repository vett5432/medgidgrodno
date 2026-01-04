import { MedicalNews as MedicalNewsType } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MedicalNewsProps {
  news: MedicalNewsType[];
}

const categoryNames: Record<MedicalNewsType['category'], string> = {
  health: 'Здоровье',
  announcement: 'Объявления',
  prevention: 'Профилактика',
  research: 'Исследования',
  events: 'События'
};

const categoryColors: Record<MedicalNewsType['category'], string> = {
  health: 'bg-blue-100 text-blue-700',
  announcement: 'bg-green-100 text-green-700',
  prevention: 'bg-purple-100 text-purple-700',
  research: 'bg-orange-100 text-orange-700',
  events: 'bg-pink-100 text-pink-700'
};

export function MedicalNews({ news }: MedicalNewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-blue-900 mb-2">Медицинские новости</h2>
          <p className="text-blue-600">Актуальные новости здравоохранения города Гродно</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((newsItem) => (
          <Card key={newsItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {newsItem.imageUrl && (
              <div className="relative h-48 overflow-hidden bg-blue-100">
                <ImageWithFallback
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  variant="secondary" 
                  className={categoryColors[newsItem.category]}
                >
                  {categoryNames[newsItem.category]}
                </Badge>
                <div className="flex items-center text-sm text-blue-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(newsItem.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <h3 className="text-blue-900 mb-2 line-clamp-2">
                {newsItem.title}
              </h3>

              <p className="text-blue-700 mb-4 line-clamp-3">
                {newsItem.summary}
              </p>

              {newsItem.source && (
                <div className="flex items-center text-sm text-blue-600 border-t border-blue-100 pt-3">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  <span className="line-clamp-1">{newsItem.source}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-blue-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Новостей пока нет
          </h3>
          <p className="text-blue-600">
            Новости появятся в ближайшее время
          </p>
        </div>
      )}
    </div>
  );
}