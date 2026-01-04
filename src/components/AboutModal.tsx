import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { MapPin, Phone, Clock } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">
            О системе MedGid Grodno
          </DialogTitle>
          <DialogDescription>
            Информационно-поисковая система медицинских учреждений города Гродно
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">О системе MedGid Grodno</h3>
            <div className="space-y-3 text-blue-800">
              <p>
                <strong>Наименование:</strong> Информационно-поисковая система «MedGid Grodno» для медицинских учреждений города Гродно.
              </p>
              <p>
                <strong>Назначение:</strong> Система предназначена для людей любого возраста, желающих получить полную и актуальную информацию о медицинских учреждениях города Гродно.
              </p>
              <p>
                <strong>Охват:</strong> База данных включает 40 медицинских учреждений, охватывающих все 9 районов города Гродно (Ленинский, Октябрьский, Форштадт, Грандичи, Южный, Вишневец, Девятовка, Зарица, Обухово).
              </p>
            </div>
          </div>

          {/* Функциональность */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Возможности для гостей</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Просмотр всех страниц сайта</li>
                <li>• Поиск по названию, симптомам, жалобам и требованиям</li>
                <li>• Поиск по профилю и специализации врача</li>
                <li>• Просмотр местоположения учреждений на карте</li>
                <li>• Сортировка по стоимости услуг (от бесплатных к платным)</li>
                <li>• Сортировка по алфавиту (от А до Я)</li>
                <li>• Фильтрация по времени работы учреждений</li>
                <li>• Просмотр контактов, адресов и услуг</li>
                <li>• Оставление отзывов без регистрации</li>
              </ul>
            </div>

            <div className="bg-white border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Панель администратора</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Добавление и удаление категорий</li>
                <li>• Добавление и удаление услуг и врачей</li>
                <li>• Редактирование страниц сайта и приложения</li>
                <li>• Полный доступ к базе данных</li>
                <li>• Модерация отзывов пользователей</li>
                <li>• Управление информацией об учреждениях</li>
              </ul>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">Экстренные контакты</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-orange-800">
                <Phone className="w-4 h-4" />
                <span>Скорая медицинская помощь: <strong>103</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-orange-800">
                <Phone className="w-4 h-4" />
                <span>Служба экстренного реагирования: <strong>112</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-orange-800">
                <MapPin className="w-4 h-4" />
                <span>Город: <strong>Гродно, Беларусь</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-orange-800">
                <Clock className="w-4 h-4" />
                <span>Система работает: <strong>круглосуточно</strong></span>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика базы данных</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">40</div>
                <div className="text-sm text-gray-600">Медучреждений</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">9</div>
                <div className="text-sm text-gray-600">Районов города</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">55+</div>
                <div className="text-sm text-gray-600">Отзывов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600">Покрытие Гродно</div>
              </div>
            </div>
          </div>

          {/* Информация об учреждениях */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Информация о медицинских учреждениях</h3>
            <div className="grid md:grid-cols-2 gap-4 text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Основная информация:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Контакты медучреждений и врачей</li>
                  <li>• Адреса и местоположение</li>
                  <li>• Перечень оказываемых услуг</li>
                  <li>• Время работы врачей</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Дополнительная информация:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Фотографии учреждений и врачей</li>
                  <li>• Достижения и награды</li>
                  <li>• Годы работы и стаж врачей</li>
                  <li>• Отзывы пациентов</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Технические особенности */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Интерфейс системы</h3>
            <div className="text-green-800 space-y-2">
              <p>
                <strong>Цветовая схема:</strong> Преимущественно белые и синие оттенки для медицинской тематики
              </p>
              <p>
                <strong>Адаптивность:</strong> Полная поддержка компьютеров, планшетов и мобильных телефонов
              </p>
              <p>
                <strong>Удобство:</strong> Быстрая загрузка страниц и удобные шрифты для комфортного чтения
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              © 2024 MedGid Grodno. Информационно-поисковая система медицинских учреждений города Гродно.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}