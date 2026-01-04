import { useState } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Edit2,
  User,
  Briefcase,
  Clock,
  Award,
  Image as ImageIcon,
  Database,
  Copy,
  Search,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { MedicalInstitution, Doctor } from '../types';

interface InstitutionEditorProps {
  institution: MedicalInstitution;
  onSave: (id: string, updates: Partial<MedicalInstitution>) => void;
  onClose: () => void;
}

export function InstitutionEditor({ institution, onSave, onClose }: InstitutionEditorProps) {
  const [editedInstitution, setEditedInstitution] = useState<MedicalInstitution>(institution);
  const [newService, setNewService] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: '',
    specialization: '',
    experience: 0,
    category: '',
    workingHours: {
      monday: { open: '08:00', close: '18:00', isWorking: true },
      tuesday: { open: '08:00', close: '18:00', isWorking: true },
      wednesday: { open: '08:00', close: '18:00', isWorking: true },
      thursday: { open: '08:00', close: '18:00', isWorking: true },
      friday: { open: '08:00', close: '18:00', isWorking: true },
      saturday: { open: '09:00', close: '14:00', isWorking: false },
      sunday: { open: '', close: '', isWorking: false },
    }
  });
  const [servicesFilter, setServicesFilter] = useState('');
  const [doctorsFilter, setDoctorsFilter] = useState('');
  const [bulkServices, setBulkServices] = useState('');

  const handleSave = () => {
    onSave(institution.id, editedInstitution);
    onClose();
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setEditedInstitution(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    setEditedInstitution(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleBulkAddServices = () => {
    if (bulkServices.trim()) {
      const newServices = bulkServices
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      setEditedInstitution(prev => ({
        ...prev,
        services: [...prev.services, ...newServices]
      }));
      setBulkServices('');
    }
  };

  const handleCopyServices = () => {
    const servicesText = editedInstitution.services.join('\n');
    navigator.clipboard.writeText(servicesText);
  };

  const handleClearAllServices = () => {
    if (window.confirm('Удалить все услуги? Это действие нельзя отменить.')) {
      setEditedInstitution(prev => ({
        ...prev,
        services: []
      }));
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setEditedInstitution(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setEditedInstitution(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleAddPhoto = () => {
    if (newPhoto.trim()) {
      setEditedInstitution(prev => ({
        ...prev,
        photos: [...prev.photos, newPhoto.trim()]
      }));
      setNewPhoto('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setEditedInstitution(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleAddDoctor = () => {
    if (newDoctor.name && newDoctor.specialization) {
      const doctor: Doctor = {
        id: Date.now().toString(),
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        experience: newDoctor.experience || 0,
        category: newDoctor.category || '',
        photo: newDoctor.photo,
        workingHours: newDoctor.workingHours!
      };
      
      setEditedInstitution(prev => ({
        ...prev,
        doctors: [...prev.doctors, doctor]
      }));
      
      setNewDoctor({
        name: '',
        specialization: '',
        experience: 0,
        category: '',
        workingHours: {
          monday: { open: '08:00', close: '18:00', isWorking: true },
          tuesday: { open: '08:00', close: '18:00', isWorking: true },
          wednesday: { open: '08:00', close: '18:00', isWorking: true },
          thursday: { open: '08:00', close: '18:00', isWorking: true },
          friday: { open: '08:00', close: '18:00', isWorking: true },
          saturday: { open: '09:00', close: '14:00', isWorking: false },
          sunday: { open: '', close: '', isWorking: false },
        }
      });
      setIsAddingDoctor(false);
    }
  };

  const handleRemoveDoctor = (doctorId: string) => {
    setEditedInstitution(prev => ({
      ...prev,
      doctors: prev.doctors.filter(d => d.id !== doctorId)
    }));
  };

  const handleUpdateDoctor = (doctorId: string, updates: Partial<Doctor>) => {
    setEditedInstitution(prev => ({
      ...prev,
      doctors: prev.doctors.map(d => d.id === doctorId ? { ...d, ...updates } : d)
    }));
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Понедельник' },
    { key: 'tuesday', label: 'Вторник' },
    { key: 'wednesday', label: 'Среда' },
    { key: 'thursday', label: 'Четверг' },
    { key: 'friday', label: 'Пятница' },
    { key: 'saturday', label: 'Суббота' },
    { key: 'sunday', label: 'Воскресенье' },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-900">
            Редактирование: {institution.name}
          </DialogTitle>
          <DialogDescription>
            Изменение информации об учреждении, услугах, врачах и графике работы
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-blue-50">
            <TabsTrigger value="main">Основное</TabsTrigger>
            <TabsTrigger value="services">
              Услуги ({editedInstitution.services.length})
            </TabsTrigger>
            <TabsTrigger value="doctors">
              Врачи ({editedInstitution.doctors.length})
            </TabsTrigger>
            <TabsTrigger value="schedule">График</TabsTrigger>
            <TabsTrigger value="database">
              <Database className="w-4 h-4 mr-1" />
              База данных
            </TabsTrigger>
          </TabsList>

          {/* Main Information Tab */}
          <TabsContent value="main" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название учреждения</Label>
                    <Input
                      id="name"
                      value={editedInstitution.name}
                      onChange={(e) => setEditedInstitution(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Тип учреждения</Label>
                    <Select
                      value={editedInstitution.type}
                      onValueChange={(value: any) => setEditedInstitution(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">Больница</SelectItem>
                        <SelectItem value="clinic">Клиника</SelectItem>
                        <SelectItem value="polyclinic">Поликлиника</SelectItem>
                        <SelectItem value="center">Медцентр</SelectItem>
                        <SelectItem value="pharmacy">Аптека</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={editedInstitution.description}
                    onChange={(e) => setEditedInstitution(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      value={editedInstitution.address}
                      onChange={(e) => setEditedInstitution(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">Район</Label>
                    <Select
                      value={editedInstitution.location.district}
                      onValueChange={(value) => setEditedInstitution(prev => ({
                        ...prev,
                        location: { ...prev.location, district: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ленинский">Ленинский</SelectItem>
                        <SelectItem value="Октябрьский">Октябрьский</SelectItem>
                        <SelectItem value="Форштадт">Форштадт</SelectItem>
                        <SelectItem value="Гр��нд��чи">Грандичи</SelectItem>
                        <SelectItem value="Южный">Южный</SelectItem>
                        <SelectItem value="Вишневец">Вишневец</SelectItem>
                        <SelectItem value="Девятовка">Девятовка</SelectItem>
                        <SelectItem value="Зарица">Зарица</SelectItem>
                        <SelectItem value="Обухово">Обухово</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={editedInstitution.phone}
                      onChange={(e) => setEditedInstitution(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedInstitution.email}
                      onChange={(e) => setEditedInstitution(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input
                      id="website"
                      value={editedInstitution.website || ''}
                      onChange={(e) => setEditedInstitution(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="years">Лет работы</Label>
                    <Input
                      id="years"
                      type="number"
                      value={editedInstitution.yearsOfWork}
                      onChange={(e) => setEditedInstitution(prev => ({ ...prev, yearsOfWork: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Рейтинг</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editedInstitution.rating}
                      onChange={(e) => setEditedInstitution(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isPaid"
                      checked={editedInstitution.isPaid}
                      onCheckedChange={(checked) => setEditedInstitution(prev => ({ ...prev, isPaid: checked }))}
                    />
                    <Label htmlFor="isPaid">Платные услуги</Label>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Координаты на карте</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">Широта (Latitude)</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="0.0001"
                        value={editedInstitution.location.coordinates.lat}
                        onChange={(e) => setEditedInstitution(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            coordinates: {
                              ...prev.location.coordinates,
                              lat: parseFloat(e.target.value) || 0
                            }
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lng">Долгота (Longitude)</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="0.0001"
                        value={editedInstitution.location.coordinates.lng}
                        onChange={(e) => setEditedInstitution(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            coordinates: {
                              ...prev.location.coordinates,
                              lng: parseFloat(e.target.value) || 0
                            }
                          }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Фотог��афии ({editedInstitution.photos.length})
                  </div>
                  <Button 
                    onClick={() => {
                      if (window.confirm('Удалить все фотографии?')) {
                        setEditedInstitution(prev => ({ ...prev, photos: [] }));
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Очистить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="URL фотографии (https://...)"
                    value={newPhoto}
                    onChange={(e) => setNewPhoto(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPhoto()}
                  />
                  <Button onClick={handleAddPhoto} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {editedInstitution.photos.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Нет добавленных фотографий
                    </div>
                  ) : (
                    editedInstitution.photos.map((photo, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-xs text-gray-500">{index + 1}.</span>
                          <span className="text-sm truncate flex-1">{photo}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigator.clipboard.writeText(photo)}
                            title="Копировать URL"
                          >
                            <Copy className="w-3 h-3 text-blue-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemovePhoto(index)}
                            title="Удалить"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Достижения ({editedInstitution.achievements.length})
                  </div>
                  <Button 
                    onClick={() => {
                      if (window.confirm('Удалить все достижения?')) {
                        setEditedInstitution(prev => ({ ...prev, achievements: [] }));
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Очистить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Добавить достижение (например: Победитель конкурса лучших клиник 2024)"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                  />
                  <Button onClick={handleAddAchievement} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить
                  </Button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {editedInstitution.achievements.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Нет добавленных достижений
                    </div>
                  ) : (
                    editedInstitution.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-start space-x-2 flex-1">
                          <Award className="w-4 h-4 text-amber-600 mt-0.5" />
                          <span className="text-sm flex-1">{achievement}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveAchievement(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Категории услуг ({editedInstitution.services.length})
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleCopyServices} 
                      size="sm" 
                      variant="outline"
                      title="Копировать все услуги"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Копировать
                    </Button>
                    <Button 
                      onClick={handleClearAllServices} 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      title="Удалить все услуги"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Очистить
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Single Service Add */}
                <div>
                  <Label className="mb-2 block">Добавить одну услугу</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Название услуги или категории (например: Кардиология, Анализы крови)"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                    />
                    <Button onClick={handleAddService} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Quick Add Common Services */}
                <div>
                  <Label className="mb-2 block">Быстрое добавление популярных услуг</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      'Терапия',
                      'Кардиология',
                      'Хирургия',
                      'Неврология',
                      'Эндокринология',
                      'Педиатрия',
                      'Гинекология',
                      'Урология',
                      'Офтальмология',
                      'ЛОР',
                      'Стоматология',
                      'Дерматология',
                      'УЗИ диагностика',
                      'Рентген',
                      'МРТ',
                      'КТ',
                      'Анализы крови',
                      'Анализы мочи',
                      'Физиотерапия',
                      'Массаж'
                    ].map(service => (
                      <Button
                        key={service}
                        onClick={() => {
                          if (!editedInstitution.services.includes(service)) {
                            setEditedInstitution(prev => ({
                              ...prev,
                              services: [...prev.services, service]
                            }));
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        disabled={editedInstitution.services.includes(service)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {service}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Bulk Add Services */}
                <div>
                  <Label className="mb-2 block">Массовое добавление услуг</Label>
                  <Textarea
                    placeholder="Введите услуги построчно:&#10;Кардиология&#10;Анализы крови&#10;УЗИ диагностика&#10;Терапия"
                    value={bulkServices}
                    onChange={(e) => setBulkServices(e.target.value)}
                    rows={5}
                    className="mb-2"
                  />
                  <Button 
                    onClick={handleBulkAddServices} 
                    variant="outline" 
                    className="w-full"
                    disabled={!bulkServices.trim()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Добавить все услуги
                  </Button>
                </div>

                <Separator />

                {/* Filter Services */}
                <div>
                  <Label className="mb-2 block">Поиск по услугам</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Поиск услуги..."
                      value={servicesFilter}
                      onChange={(e) => setServicesFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Services List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {editedInstitution.services.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      Нет добавленных услуг
                    </div>
                  ) : (
                    editedInstitution.services
                      .filter(service => 
                        service.toLowerCase().includes(servicesFilter.toLowerCase())
                      )
                      .map((service, index) => {
                        const actualIndex = editedInstitution.services.indexOf(service);
                        return (
                          <div 
                            key={actualIndex} 
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                          >
                            <span className="flex-1">{service}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveService(actualIndex)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })
                  )}
                </div>
                
                {servicesFilter && editedInstitution.services.filter(s => 
                  s.toLowerCase().includes(servicesFilter.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Услуги не найдены
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Врачи и специалисты ({editedInstitution.doctors.length})
                  </div>
                  <Button 
                    onClick={() => setIsAddingDoctor(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить врача
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filter Doctors */}
                <div>
                  <Label className="mb-2 block">Поиск по врачам</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Поиск по имени или специализации..."
                      value={doctorsFilter}
                      onChange={(e) => setDoctorsFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Doctors List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {editedInstitution.doctors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Нет добавленных врачей
                    </div>
                  ) : (
                    editedInstitution.doctors
                      .filter(doctor => {
                        const searchText = doctorsFilter.toLowerCase();
                        return doctor.name.toLowerCase().includes(searchText) ||
                               doctor.specialization.toLowerCase().includes(searchText) ||
                               doctor.category.toLowerCase().includes(searchText);
                      })
                      .map((doctor) => (
                    <div 
                      key={doctor.id} 
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge className="bg-blue-100 text-blue-700">
                            {doctor.category || 'Без категории'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Стаж: {doctor.experience} лет
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingDoctor(doctor)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveDoctor(doctor.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )))}
                
                  {doctorsFilter && editedInstitution.doctors.filter(d => {
                    const searchText = doctorsFilter.toLowerCase();
                    return d.name.toLowerCase().includes(searchText) ||
                           d.specialization.toLowerCase().includes(searchText) ||
                           d.category.toLowerCase().includes(searchText);
                  }).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Врачи не найдены
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Doctor Dialog */}
            <Dialog open={isAddingDoctor} onOpenChange={setIsAddingDoctor}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Добавить нового врача</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о враче: ФИО, специализация, стаж и график работы
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ФИО врача</Label>
                      <Input
                        value={newDoctor.name || ''}
                        onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Иванов Иван Иванович"
                      />
                    </div>
                    <div>
                      <Label>Специализация</Label>
                      <Input
                        value={newDoctor.specialization || ''}
                        onChange={(e) => setNewDoctor(prev => ({ ...prev, specialization: e.target.value }))}
                        placeholder="Кардиолог"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Категория</Label>
                      <Select
                        value={newDoctor.category || ''}
                        onValueChange={(value) => setNewDoctor(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Первая категория">Первая категория</SelectItem>
                          <SelectItem value="Вторая категория">Вторая категория</SelectItem>
                          <SelectItem value="Высшая категория">Высшая категория</SelectItem>
                          <SelectItem value="Без категории">Без категории</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Стаж работы (лет)</Label>
                      <Input
                        type="number"
                        value={newDoctor.experience || 0}
                        onChange={(e) => setNewDoctor(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>URL фотографии (необязательно)</Label>
                    <Input
                      value={newDoctor.photo || ''}
                      onChange={(e) => setNewDoctor(prev => ({ ...prev, photo: e.target.value }))}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddDoctor} className="bg-blue-600 hover:bg-blue-700">
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingDoctor(false)}>
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Doctor Dialog */}
            {editingDoctor && (
              <Dialog open={!!editingDoctor} onOpenChange={() => setEditingDoctor(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Редактировать врача</DialogTitle>
                    <DialogDescription>
                      Изменение информации о враче
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ФИО врача</Label>
                        <Input
                          value={editingDoctor.name}
                          onChange={(e) => setEditingDoctor(prev => prev ? { ...prev, name: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label>Специализация</Label>
                        <Input
                          value={editingDoctor.specialization}
                          onChange={(e) => setEditingDoctor(prev => prev ? { ...prev, specialization: e.target.value } : null)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Категория</Label>
                        <Input
                          value={editingDoctor.category}
                          onChange={(e) => setEditingDoctor(prev => prev ? { ...prev, category: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label>Стаж работы (лет)</Label>
                        <Input
                          type="number"
                          value={editingDoctor.experience}
                          onChange={(e) => setEditingDoctor(prev => prev ? { ...prev, experience: parseInt(e.target.value) || 0 } : null)}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          if (editingDoctor) {
                            handleUpdateDoctor(editingDoctor.id, editingDoctor);
                            setEditingDoctor(null);
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={() => setEditingDoctor(null)}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    График работы учреждения
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => {
                        const weekdaySchedule = { open: '08:00', close: '18:00', isWorking: true };
                        const saturdaySchedule = { open: '09:00', close: '14:00', isWorking: true };
                        const sundaySchedule = { open: '', close: '', isWorking: false };
                        
                        setEditedInstitution(prev => ({
                          ...prev,
                          workingHours: {
                            monday: weekdaySchedule,
                            tuesday: weekdaySchedule,
                            wednesday: weekdaySchedule,
                            thursday: weekdaySchedule,
                            friday: weekdaySchedule,
                            saturday: saturdaySchedule,
                            sunday: sundaySchedule,
                          }
                        }));
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Стандартный график
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-32">
                      <span className="font-medium">{label}</span>
                    </div>
                    <Switch
                      checked={editedInstitution.workingHours[key]?.isWorking || false}
                      onCheckedChange={(checked) => {
                        setEditedInstitution(prev => ({
                          ...prev,
                          workingHours: {
                            ...prev.workingHours,
                            [key]: {
                              ...prev.workingHours[key],
                              isWorking: checked
                            }
                          }
                        }));
                      }}
                    />
                    {editedInstitution.workingHours[key]?.isWorking && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">С</Label>
                          <Input
                            type="time"
                            value={editedInstitution.workingHours[key]?.open || ''}
                            onChange={(e) => {
                              setEditedInstitution(prev => ({
                                ...prev,
                                workingHours: {
                                  ...prev.workingHours,
                                  [key]: {
                                    ...prev.workingHours[key],
                                    open: e.target.value
                                  }
                                }
                              }));
                            }}
                            className="w-28"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">До</Label>
                          <Input
                            type="time"
                            value={editedInstitution.workingHours[key]?.close || ''}
                            onChange={(e) => {
                              setEditedInstitution(prev => ({
                                ...prev,
                                workingHours: {
                                  ...prev.workingHours,
                                  [key]: {
                                    ...prev.workingHours[key],
                                    close: e.target.value
                                  }
                                }
                              }));
                            }}
                            className="w-28"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Полные данные учреждения
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(editedInstitution, null, 2));
                      }}
                      size="sm" 
                      variant="outline"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Копировать JSON
                    </Button>
                    <Button 
                      onClick={() => {
                        const dataStr = JSON.stringify(editedInstitution, null, 2);
                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${editedInstitution.name.replace(/\s+/g, '_')}.json`;
                        link.click();
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Экспорт
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
                  <pre>{JSON.stringify(editedInstitution, null, 2)}</pre>
                </div>
                <p className="text-sm text-gray-600">
                  Полная база данных учреждения в формате JSON. Здесь отображаются все данные включая врач��й, услуги, график работы и все остальные параметры.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Размер данных</p>
                      <p>
                        Всего символов: <strong>{JSON.stringify(editedInstitution).length}</strong>
                        {' '}({(JSON.stringify(editedInstitution).length / 1024).toFixed(2)} KB)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Button
                    onClick={() => {
                      const summary = `
Учреждение: ${editedInstitution.name}
Адрес: ${editedInstitution.address}
Район: ${editedInstitution.location.district}
Телефон: ${editedInstitution.phone}
Email: ${editedInstitution.email}
${editedInstitution.website ? `Сайт: ${editedInstitution.website}` : ''}

Услуги (${editedInstitution.services.length}):
${editedInstitution.services.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Врачи (${editedInstitution.doctors.length}):
${editedInstitution.doctors.map((d, i) => `${i + 1}. ${d.name} - ${d.specialization} (${d.experience} лет)`).join('\n')}

Рейтинг: ${editedInstitution.rating}/5
Отзывов: ${editedInstitution.reviewCount}
Лет работы: ${editedInstitution.yearsOfWork}
                      `.trim();
                      navigator.clipboard.writeText(summary);
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать сводку
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const servicesExport = editedInstitution.services.join('\n');
                      const blob = new Blob([servicesExport], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `services_${editedInstitution.name.replace(/\s+/g, '_')}.txt`;
                      link.click();
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт услуг
                  </Button>

                  <Button
                    onClick={() => {
                      const doctorsExport = editedInstitution.doctors
                        .map(d => `${d.name}\t${d.specialization}\t${d.experience} лет\t${d.category}`)
                        .join('\n');
                      const blob = new Blob([doctorsExport], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `doctors_${editedInstitution.name.replace(/\s+/g, '_')}.txt`;
                      link.click();
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт врачей
                  </Button>

                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(editedInstitution.phone);
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать телефон
                  </Button>

                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(editedInstitution.email);
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать email
                  </Button>

                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(editedInstitution.address);
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать адрес
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Детальная статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {editedInstitution.services.length}
                    </div>
                    <div className="text-sm text-blue-700">Услуг</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {editedInstitution.doctors.length}
                    </div>
                    <div className="text-sm text-green-700">Врачей</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {editedInstitution.photos.length}
                    </div>
                    <div className="text-sm text-orange-700">Фото</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {editedInstitution.reviewCount}
                    </div>
                    <div className="text-sm text-purple-700">Отзывов</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Дополнительная информация</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Достижений:</span>
                      <span className="ml-2 font-medium">{editedInstitution.achievements.length}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Рейтинг:</span>
                      <span className="ml-2 font-medium">{editedInstitution.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Тип:</span>
                      <span className="ml-2 font-medium">{editedInstitution.type}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Район:</span>
                      <span className="ml-2 font-medium">{editedInstitution.location.district}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Лет работы:</span>
                      <span className="ml-2 font-medium">{editedInstitution.yearsOfWork}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Платные услуги:</span>
                      <span className="ml-2 font-medium">{editedInstitution.isPaid ? 'Да' : 'Нет'}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded col-span-2">
                      <span className="text-gray-600">ID:</span>
                      <span className="ml-2 font-mono text-xs">{editedInstitution.id}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">График работы</h4>
                  <div className="text-sm space-y-1">
                    {Object.entries(editedInstitution.workingHours).map(([day, schedule]) => (
                      <div key={day} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="capitalize">{day}</span>
                        <span className={schedule.isWorking ? 'text-green-600' : 'text-red-600'}>
                          {schedule.isWorking ? `${schedule.open} - ${schedule.close}` : 'Выходной'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 space-x-0 md:space-x-2 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (window.confirm('Сбросить все изменения?')) {
                  setEditedInstitution(institution);
                }
              }}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Сбросить
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const changes = [];
                if (editedInstitution.name !== institution.name) changes.push('Название');
                if (editedInstitution.services.length !== institution.services.length) changes.push('Услуги');
                if (editedInstitution.doctors.length !== institution.doctors.length) changes.push('Врачи');
                if (changes.length > 0) {
                  alert(`Изменено: ${changes.join(', ')}`);
                } else {
                  alert('Изменений нет');
                }
              }}
            >
              <Database className="w-4 h-4 mr-1" />
              Просмотр изменений
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Сохранить изменения
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}