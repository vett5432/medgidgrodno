import { MapPin, Phone, Mail, Globe, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AdminLogin } from './AdminLogin';

interface FooterProps {
  onAdminToggle?: () => void;
  isAdminMode?: boolean;
}

export function Footer({ onAdminToggle, isAdminMode }: FooterProps = {}) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = (username: string, password: string) => {
    // Проверяем демо-доступ или сохраненные учетные данные
    const savedPassword = localStorage.getItem(`admin_password_${username}`);
    
    if ((username === 'admin' && password === 'admin123') || 
        (savedPassword && savedPassword === password)) {
      onAdminToggle?.();
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleAdminButtonClick = () => {
    if (isAdminMode) {
      onAdminToggle?.();
    } else {
      setShowAdminLogin(true);
    }
  };

  return (
    <footer className="bg-blue-900 text-white">
      <AdminLogin 
        open={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLogin}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white text-blue-900 p-2 rounded-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2H4v1h5v2H4v1h5v2H4V6zm0 8h5v2H4v1h5v2H4v-5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">МedGid Grodno</h3>
                <p className="text-blue-300">Медицинские учреждения города</p>
              </div>
            </div>
            <p className="text-blue-200 mb-4 max-w-md">
              Информационно-поисковая система для поиска медицинских учреждений города Гродно. 
              Найдите подходящего врача, узнайте о услугах и оставьте отзыв.
            </p>
            <div className="flex items-center space-x-2 text-blue-300">
              <Phone className="w-4 h-4" />
              <span>Экстренные службы: 103, 112</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Поиск учреждений
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Карта города
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Отзывы пациентов
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Часто задаваемые вопросы
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Medical Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Специализации</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Терапия
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Кардиология
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Педиатрия
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Стоматология
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Хирургия
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-blue-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium">Адрес</p>
                <p className="text-blue-200">г. Гродно, Беларусь</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:info@medpoisk.grodno.by" className="text-blue-200 hover:text-white">
                  info@medpoisk.grodno.by
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium">Официальный сайт</p>
                <a 
                  href="https://grodnouzo.gov.by"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-blue-200 hover:text-white"
                >
                  Гродненское УЗО
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-blue-300 text-sm">
              © 2024 МedGid Grodno. Все права защищены.
            </p>
            
            {/* Admin Login */}
            {onAdminToggle && (
              <Button
                onClick={handleAdminButtonClick}
                variant={isAdminMode ? "default" : "outline"}
                size="sm"
                className="bg-blue-700 hover:bg-blue-600 text-white border-blue-600"
              >
                <User className="w-4 h-4 mr-1" />
                {isAdminMode ? 'Выйти из админки' : 'Вход админа'}
              </Button>
            )}
            
            <p className="text-blue-300 text-sm text-center sm:text-right">
              Информация носит справочный характер. Обязательно консультируйтесь с врачом.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}