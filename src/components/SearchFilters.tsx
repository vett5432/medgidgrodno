import { useState } from 'react';
import { Filter, MapPin, Clock, DollarSign, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { SearchFilters as SearchFiltersType } from '../types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  resultsCount: number;
}

export function SearchFilters({ filters, onFiltersChange, resultsCount }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (updates: Partial<SearchFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      priceType: 'all',
      specialization: 'none',
      district: 'none',
      workingNow: false,
      sortBy: 'alphabetical'
    });
  };

  const activeFiltersCount = [
    filters.priceType !== 'all',
    filters.specialization !== 'none',
    filters.district !== 'none',
    filters.workingNow,
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-blue-100 rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="p-4 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Фильтры поиска</h3>
            {activeFiltersCount > 0 && (
              <Badge className="bg-blue-100 text-blue-700">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-600">
              Найдено: {resultsCount} учреждений
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              {isExpanded ? 'Скрыть' : 'Показать'} фильтры
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Type Filter */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2 text-blue-700">
                <DollarSign className="w-4 h-4" />
                <span>Стоимость услуг</span>
              </Label>
              <Select
                value={filters.priceType}
                onValueChange={(value: 'all' | 'free' | 'paid') => updateFilters({ priceType: value })}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все учреждения</SelectItem>
                  <SelectItem value="free">Бесплатные</SelectItem>
                  <SelectItem value="paid">Платные</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialization Filter */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2 text-blue-700">
                <Stethoscope className="w-4 h-4" />
                <span>Специализация</span>
              </Label>
              <Select
                value={filters.specialization}
                onValueChange={(value) => updateFilters({ specialization: value })}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Выберите специализацию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Все специализации</SelectItem>
                  <SelectItem value="Терапия">Терапия</SelectItem>
                  <SelectItem value="Кардиология">Кардиология</SelectItem>
                  <SelectItem value="Хирургия">Хирургия</SelectItem>
                  <SelectItem value="Педиатрия">Педиатрия</SelectItem>
                  <SelectItem value="Стоматология">Стоматология</SelectItem>
                  <SelectItem value="Неврология">Неврология</SelectItem>
                  <SelectItem value="Офтальмология">Офтальмология</SelectItem>
                  <SelectItem value="Гинекология">Гинекология</SelectItem>
                  <SelectItem value="Дерматология">Дерматология</SelectItem>
                  <SelectItem value="Эндокринология">Эндокринология</SelectItem>
                  <SelectItem value="Урология">Урология</SelectItem>
                  <SelectItem value="Онкология">Онкология</SelectItem>
                  <SelectItem value="Психиатрия">Психиатрия</SelectItem>
                  <SelectItem value="Ортопедия">Ортопедия</SelectItem>
                  <SelectItem value="Травматология">Травматология</SelectItem>
                  <SelectItem value="Ревматология">Ревматология</SelectItem>
                  <SelectItem value="Инфекционные заболевания">Инфекционные заболевания</SelectItem>
                  <SelectItem value="Лабораторная диагностика">Лабораторная диагностика</SelectItem>
                  <SelectItem value="Скорая помощь">Скорая помощь</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* District Filter */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2 text-blue-700">
                <MapPin className="w-4 h-4" />
                <span>Район города</span>
              </Label>
              <Select
                value={filters.district}
                onValueChange={(value) => updateFilters({ district: value })}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Выберите район" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Все районы</SelectItem>
                  <SelectItem value="Ленинский">Ленинский</SelectItem>
                  <SelectItem value="Октябрьский">Октябрьский</SelectItem>
                  <SelectItem value="Центр">Центр города</SelectItem>
                  <SelectItem value="Северный">Северный микрорайон</SelectItem>
                  <SelectItem value="Южный">Южный микрорайон</SelectItem>
                  <SelectItem value="Девятовка">Девятовка</SelectItem>
                  <SelectItem value="Грандичи">Грандичи</SelectItem>
                  <SelectItem value="Вишневец">Вишневец</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <Label className="text-blue-700">Сортировка</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: 'alphabetical' | 'price' | 'rating') => updateFilters({ sortBy: value })}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Сортировать по" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphabetical">По алфавиту</SelectItem>
                  <SelectItem value="price">По стоимости</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Working Now Filter */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <Label htmlFor="working-now" className="flex-1 text-blue-700">
              Работают сейчас
            </Label>
            <Switch
              id="working-now"
              checked={filters.workingNow}
              onCheckedChange={(checked) => updateFilters({ workingNow: checked })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Очистить фильтры
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}