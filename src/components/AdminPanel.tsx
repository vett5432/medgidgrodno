import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Building, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Settings,
  Newspaper
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { MedicalInstitution, Doctor, Review, MedicalNews } from '../types';
import { InstitutionEditor } from './InstitutionEditor';
import { NewsEditor } from './NewsEditor';
import { toast } from 'sonner@2.0.3';

interface AdminPanelProps {
  institutions: MedicalInstitution[];
  reviews: Review[];
  news: MedicalNews[];
  onUpdateInstitution: (id: string, institution: Partial<MedicalInstitution>) => void;
  onDeleteInstitution: (id: string) => void;
  onAddInstitution: (institution: Omit<MedicalInstitution, 'id'>) => void;
  onApproveReview: (reviewId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  onAddNews: (news: Omit<MedicalNews, 'id'>) => void;
  onDeleteNews: (newsId: string) => void;
}

export function AdminPanel({
  institutions,
  reviews,
  news,
  onUpdateInstitution,
  onDeleteInstitution,
  onAddInstitution,
  onApproveReview,
  onDeleteReview,
  onAddNews,
  onDeleteNews
}: AdminPanelProps) {
  const [isAddingInstitution, setIsAddingInstitution] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<string | null>(null);
  const [newInstitution, setNewInstitution] = useState<Partial<MedicalInstitution>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    type: 'clinic',
    isPaid: false,
    description: '',
    services: [],
    doctors: [],
    photos: [],
    rating: 0,
    reviewCount: 0,
    location: { district: '', coordinates: { lat: 0, lng: 0 } },
    achievements: [],
    yearsOfWork: 0,
    workingHours: {
      monday: { open: '08:00', close: '18:00', isWorking: true },
      tuesday: { open: '08:00', close: '18:00', isWorking: true },
      wednesday: { open: '08:00', close: '18:00', isWorking: true },
      thursday: { open: '08:00', close: '18:00', isWorking: true },
      friday: { open: '08:00', close: '18:00', isWorking: true },
      saturday: { open: '09:00', close: '14:00', isWorking: true },
      sunday: { open: '', close: '', isWorking: false },
    }
  });

  const pendingReviews = reviews.filter(review => !review.isApproved);
  const approvedReviews = reviews.filter(review => review.isApproved);
  
  // Find institution being edited
  const institutionToEdit = editingInstitution 
    ? institutions.find(inst => inst.id === editingInstitution)
    : null;

  const handleAddInstitution = () => {
    if (!newInstitution.name || !newInstitution.address || !newInstitution.phone) return;
    
    onAddInstitution({
      ...newInstitution,
      id: Date.now().toString(),
      name: newInstitution.name!,
      address: newInstitution.address!,
      phone: newInstitution.phone!,
      email: newInstitution.email!,
      type: newInstitution.type as any,
      isPaid: newInstitution.isPaid!,
      description: newInstitution.description!,
      services: newInstitution.services!,
      doctors: newInstitution.doctors!,
      photos: newInstitution.photos!,
      rating: newInstitution.rating!,
      reviewCount: newInstitution.reviewCount!,
      location: newInstitution.location!,
      achievements: newInstitution.achievements!,
      yearsOfWork: newInstitution.yearsOfWork!,
      workingHours: newInstitution.workingHours!
    });
    
    setNewInstitution({
      name: '',
      address: '',
      phone: '',
      email: '',
      type: 'clinic',
      isPaid: false,
      description: '',
      services: [],
      doctors: [],
      photos: [],
      rating: 0,
      reviewCount: 0,
      location: { district: '', coordinates: { lat: 0, lng: 0 } },
      achievements: [],
      yearsOfWork: 0,
      workingHours: {
        monday: { open: '08:00', close: '18:00', isWorking: true },
        tuesday: { open: '08:00', close: '18:00', isWorking: true },
        wednesday: { open: '08:00', close: '18:00', isWorking: true },
        thursday: { open: '08:00', close: '18:00', isWorking: true },
        friday: { open: '08:00', close: '18:00', isWorking: true },
        saturday: { open: '09:00', close: '14:00', isWorking: true },
        sunday: { open: '', close: '', isWorking: false },
      }
    });
    setIsAddingInstitution(false);
  };

  const handleApproveReview = (reviewId: string) => {
    onApproveReview(reviewId);
    toast.success('Отзыв одобрен', {
      description: 'Отзыв опубликован на сайте и виден всем пользователям.',
      duration: 3000,
    });
  };

  const handleRejectReview = (reviewId: string) => {
    onDeleteReview(reviewId);
    toast.info('Отзыв отклонен', {
      description: 'Отзыв был удален и не будет опубликован.',
      duration: 3000,
    });
  };

  return (
    <>
      {/* Institution Editor Modal */}
      {institutionToEdit && (
        <InstitutionEditor
          institution={institutionToEdit}
          onSave={onUpdateInstitution}
          onClose={() => setEditingInstitution(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Панель администратора</h2>
          <p className="text-blue-600">Управление медицинскими учреждениями и отзывами</p>
        </div>

      <Tabs defaultValue="institutions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger value="institutions" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <Building className="w-4 h-4 mr-2" />
            Учреждения ({institutions.length})
          </TabsTrigger>
          <TabsTrigger value="news" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <Newspaper className="w-4 h-4 mr-2" />
            Новости ({news.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 relative">
            <MessageSquare className="w-4 h-4 mr-2" />
            Отзывы
            {pendingReviews.length > 0 && (
              <Badge className="ml-2 bg-orange-500 text-white hover:bg-orange-600">
                {pendingReviews.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>

        {/* Institutions Tab */}
        <TabsContent value="institutions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-900">Медиинские учреждения</h3>
            <Dialog open={isAddingInstitution} onOpenChange={setIsAddingInstitution}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить учреждение
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Добавить новое медицинское учреждение</DialogTitle>
                  <DialogDescription>
                    Заполните основную информацию о медицинском учреждении
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        value={newInstitution.name || ''}
                        onChange={(e) => setNewInstitution(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Название учреждения"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Тип</Label>
                      <Select
                        value={newInstitution.type}
                        onValueChange={(value) => setNewInstitution(prev => ({ ...prev, type: value as any }))}
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
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      value={newInstitution.address || ''}
                      onChange={(e) => setNewInstitution(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Адрес учреждения"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={newInstitution.phone || ''}
                        onChange={(e) => setNewInstitution(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+375 XXX XX-XX-XX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newInstitution.email || ''}
                        onChange={(e) => setNewInstitution(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={newInstitution.description || ''}
                      onChange={(e) => setNewInstitution(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Описание учреждения"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">Район</Label>
                      <Input
                        id="district"
                        value={newInstitution.location?.district || ''}
                        onChange={(e) => setNewInstitution(prev => ({ 
                          ...prev, 
                          location: { ...prev.location!, district: e.target.value }
                        }))}
                        placeholder="Район города"
                      />
                    </div>
                    <div>
                      <Label htmlFor="years">Лет работы</Label>
                      <Input
                        id="years"
                        type="number"
                        value={newInstitution.yearsOfWork || 0}
                        onChange={(e) => setNewInstitution(prev => ({ ...prev, yearsOfWork: parseInt(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddInstitution} className="bg-blue-600 hover:bg-blue-700">
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingInstitution(false)}>
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {institutions.map((institution) => (
              <Card key={institution.id} className="border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">{institution.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{institution.address}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-700">
                          {institution.type}
                        </Badge>
                        <Badge 
                          className={`${
                            institution.isPaid 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {institution.isPaid ? 'Платно' : 'Бесплатно'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600">
                        <span>{institution.services.length} услуг</span>
                        <span>•</span>
                        <span>{institution.doctors.length} врачей</span>
                        <span>•</span>
                        <span>{institution.reviewCount} отзывов</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingInstitution(institution.id)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        title="Редактировать учреждение: услуги, врачи, график работы, база данных"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteInstitution(institution.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-6">
          <NewsEditor 
            open={isAddingNews} 
            onClose={() => setIsAddingNews(false)}
            onSave={onAddNews}
          />

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-900">Медицинские новости</h3>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsAddingNews(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить новость
            </Button>
          </div>

          <div className="grid gap-4">
            {news.length === 0 ? (
              <Card className="border-blue-100">
                <CardContent className="p-6 text-center">
                  <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Новости пока не добавлены</p>
                </CardContent>
              </Card>
            ) : (
              news.slice().reverse().map((newsItem) => (
                <Card key={newsItem.id} className="border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {newsItem.imageUrl && (
                        <img 
                          src={newsItem.imageUrl} 
                          alt={newsItem.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-1">{newsItem.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{newsItem.summary}</p>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-blue-100 text-blue-700">
                                {newsItem.category === 'health' && 'Здоровье'}
                                {newsItem.category === 'announcement' && 'Объявления'}
                                {newsItem.category === 'prevention' && 'Профилактика'}
                                {newsItem.category === 'research' && 'Исследования'}
                                {newsItem.category === 'events' && 'События'}
                              </Badge>
                              <span className="text-xs text-gray-500">{newsItem.date}</span>
                              {newsItem.source && (
                                <span className="text-xs text-gray-500">• {newsItem.source}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteNews(newsItem.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Отзывы на модерации</h3>
              {pendingReviews.length > 0 && (
                <Badge className="bg-orange-500 text-white">
                  {pendingReviews.length} {pendingReviews.length === 1 ? 'новый отзыв' : 'новых отзывов'}
                </Badge>
              )}
            </div>
            
            {pendingReviews.length === 0 ? (
              <Card className="border-blue-100">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-600">Нет отзывов для модерации</p>
                  <p className="text-sm text-gray-500 mt-1">Все отзывы обработаны</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => {
                  const institution = institutions.find(i => i.id === review.institutionId);
                  return (
                    <Card key={review.id} className="border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-blue-900">{review.authorName}</p>
                            <p className="text-sm text-gray-600">
                              {institution?.name} • Оценка: {review.rating}/5
                            </p>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveReview(review.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Одобрить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectReview(review.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Отклонить
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Опубликованные отзывы</h3>
            <div className="space-y-3">
              {approvedReviews.slice(0, 10).map((review) => {
                const institution = institutions.find(i => i.id === review.institutionId);
                return (
                  <Card key={review.id} className="border-blue-100">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-blue-900">{review.authorName}</p>
                          <p className="text-sm text-gray-600">{institution?.name}</p>
                          <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteReview(review.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Статистика системы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Текущие данные</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{institutions.length}</p>
                    <p className="text-sm text-blue-700">Учреждений</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {institutions.reduce((sum, inst) => sum + inst.doctors.length, 0)}
                    </p>
                    <p className="text-sm text-purple-700">Врачей</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{approvedReviews.length}</p>
                    <p className="text-sm text-green-700">Отзывов</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">{pendingReviews.length}</p>
                    <p className="text-sm text-orange-700">На модерации</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Услуги и районы</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-cyan-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-cyan-600">
                      {institutions.reduce((sum, inst) => sum + inst.services.length, 0)}
                    </p>
                    <p className="text-sm text-cyan-700">Всего услуг</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {[...new Set(institutions.map(inst => inst.location.district))].length}
                    </p>
                    <p className="text-sm text-indigo-700">Районов города</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
}