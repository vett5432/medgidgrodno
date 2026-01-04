import { useState } from 'react';
import { Search, Menu, MapPin, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { AboutModal } from './AboutModal';

interface HeaderProps {
  onSearch: (query: string) => void;
  onAdminToggle: () => void;
  isAdminMode: boolean;
  onQuickSearch?: (query: string) => void;
}

export function Header({ onSearch, onAdminToggle, isAdminMode, onQuickSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleQuickSearch = (query: string) => {
    if (onQuickSearch) {
      onQuickSearch(query);
    } else {
      onSearch(query);
    }
  };

  const handleNavClick = (section: string) => {
    switch (section) {
      case 'home':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'search':
        document.querySelector('input[type="text"]')?.focus();
        break;
      case 'map':
        alert('Функция карты будет доступна в следующей версии');
        break;
      case 'about':
        setIsAboutModalOpen(true);
        break;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Compact Fixed Header for Mobile */}
      <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50 md:static">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2H4v1h5v2H4v1h5v2H4V6zm0 8h5v2H4v1h5v2H4v-5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-blue-900">MedGid Grodno</h1>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Поиск по названию, симптомам, специализации..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
                >
                  Найти
                </Button>
              </div>
            </form>

            {/* Quick Search Badges - Desktop */}
            <div className="hidden lg:flex gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleQuickSearch('скорая помощь')}
              >
                Скорая помощь
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleQuickSearch('стоматология')}
              >
                Стоматология
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleQuickSearch('кардиология')}
              >
                Кардиология
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleQuickSearch('педиатрия')}
              >
                Педиатрия
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleQuickSearch('анализы')}
              >
                Анализы
              </Badge>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="relative">
              <Input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 border-blue-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
              >
                Найти
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-blue-100 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <nav className="flex flex-col space-y-2">
                <button 
                  onClick={() => handleNavClick('home')}
                  className="text-blue-700 hover:text-blue-900 font-medium py-2 text-left flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Главная</span>
                </button>
                <button 
                  onClick={() => handleNavClick('search')}
                  className="text-blue-700 hover:text-blue-900 font-medium py-2 text-left flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Поиск</span>
                </button>
                <button 
                  onClick={() => handleNavClick('map')}
                  className="text-blue-700 hover:text-blue-900 font-medium py-2 text-left flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Карта</span>
                </button>
                <button 
                  onClick={() => handleNavClick('about')}
                  className="text-blue-700 hover:text-blue-900 font-medium py-2 text-left"
                >
                  О сайте
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Navigation Menu Below Header */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center justify-center space-x-8 py-3">
            <button 
              onClick={() => handleNavClick('home')}
              className="text-blue-700 hover:text-blue-900 font-medium transition-colors flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>Главная</span>
            </button>
            <button 
              onClick={() => handleNavClick('search')}
              className="text-blue-700 hover:text-blue-900 font-medium transition-colors flex items-center space-x-1"
            >
              <Search className="w-4 h-4" />
              <span>Поиск</span>
            </button>
            <button 
              onClick={() => handleNavClick('map')}
              className="text-blue-700 hover:text-blue-900 font-medium transition-colors flex items-center space-x-1"
            >
              <MapPin className="w-4 h-4" />
              <span>Карта</span>
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              О сайте
            </button>
          </nav>

          {/* Quick Search Links - Mobile/Tablet */}
          <div className="md:hidden py-3 flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
              onClick={() => handleQuickSearch('скорая помощь')}
            >
              Скорая помощь
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
              onClick={() => handleQuickSearch('стоматология')}
            >
              Стоматология
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
              onClick={() => handleQuickSearch('кардиология')}
            >
              Кардиология
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
              onClick={() => handleQuickSearch('педиатрия')}
            >
              Педиатрия
            </Badge>
          </div>
        </div>
      </div>

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </>
  );
}
