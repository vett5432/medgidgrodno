import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Globe,
  Mail,
  Award,
  Calendar,
  User,
  DollarSign,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MedicalInstitution, Review } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ReviewSection } from './ReviewSection';

interface InstitutionDetailsProps {
  institution: MedicalInstitution;
  reviews: Review[];
  onBack: () => void;
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => void;
}

export function InstitutionDetails({ institution, reviews, onBack, onAddReview }: InstitutionDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getTypeLabel = (type: string) => {
    const labels = {
      hospital: 'Больница',
      clinic: 'Клиника',
      polyclinic: 'Поликлиника',
      center: 'Медицинский центр',
      pharmacy: 'Аптека'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getDayName = (day: string) => {
    const names = {
      monday: 'Понедельник',
      tuesday: 'Вторник',
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье'
    };
    return names[day as keyof typeof names] || day;
  };

  const isWorkingNow = () => {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = dayNames[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todaySchedule = institution.workingHours[day];
    if (!todaySchedule?.isWorking) return false;
    
    return currentTime >= todaySchedule.open && currentTime <= todaySchedule.close;
  };

  // Default images
  const defaultImages = [
    'https://images.unsplash.com/photo-1643055419804-397de33fe331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaG9zcGl0YWwlMjBidWlsZGluZ3xlbnwxfHx8fHwxNzU4NTU5MjQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2xpbmljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU4NDc0NDYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1682663947127-ac9d59d7f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc1ODU1OTI0NXww&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  const displayImages = institution.photos.length > 0 ? institution.photos : defaultImages;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back Button */}
      <Button 
        onClick={onBack}
        variant="outline"
        className="mb-6 border-blue-200 text-blue-600 hover:bg-blue-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к поиску
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-blue-900 mb-2">
                    {institution.name}
                  </h1>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-blue-100 text-blue-700">
                      {getTypeLabel(institution.type)}
                    </Badge>
                    <Badge 
                      className={`${
                        institution.isPaid 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      {institution.isPaid ? 'Платно' : 'Бесплатно'}
                    </Badge>
                    <Badge 
                      className={`${
                        isWorkingNow() 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {isWorkingNow() ? 'Открыто сейчас' : 'Закрыто'}
                    </Badge>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(institution.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-blue-600">{institution.rating}</span>
                    <span className="text-gray-500">({institution.reviewCount} отзывов)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Images */}
          <Card>
            <CardContent className="p-0">
              <div className="h-64 sm:h-80 overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src={displayImages[selectedImageIndex]}
                  alt={institution.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {displayImages.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {displayImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <ImageWithFallback
                          src={image}
                          alt={`${institution.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-blue-50">
              <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                Информация
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                Услуги
              </TabsTrigger>
              <TabsTrigger value="doctors" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                Врачи
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                <MessageSquare className="w-4 h-4 mr-1" />
                Отзывы
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Описание</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{institution.description}</p>
                </CardContent>
              </Card>

              {institution.achievements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-500" />
                      Достижения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {institution.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Предоставляемые услуги</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {institution.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-800">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctors">
              <div className="space-y-4">
                {institution.doctors.map((doctor) => (
                  <Card key={doctor.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900">{doctor.name}</h3>
                          <p className="text-blue-600 mb-2">{doctor.specialization}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Стаж: {doctor.experience} лет</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewSection
                institutionId={institution.id}
                reviews={reviews}
                onAddReview={onAddReview}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{institution.address}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <a href={`tel:${institution.phone}`} className="text-blue-600 hover:text-blue-800">
                  {institution.phone}
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <a href={`mailto:${institution.email}`} className="text-blue-600 hover:text-blue-800">
                  {institution.email}
                </a>
              </div>

              {institution.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <a 
                    href={institution.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Сайт учреждения
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Время работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(institution.workingHours).map(([day, schedule]) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-gray-700">{getDayName(day)}</span>
                    <span className={`text-sm ${schedule.isWorking ? 'text-green-600' : 'text-red-500'}`}>
                      {schedule.isWorking ? `${schedule.open} - ${schedule.close}` : 'Выходной'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Дополнительно</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Работает {institution.yearsOfWork} лет</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Район: {institution.location.district}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}