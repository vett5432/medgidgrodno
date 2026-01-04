import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Calendar, 
  DollarSign, 
  Globe,
  Award,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MedicalInstitution } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MedicalInstitutionCardProps {
  institution: MedicalInstitution;
  onViewDetails: (institution: MedicalInstitution) => void;
}

export function MedicalInstitutionCard({ institution, onViewDetails }: MedicalInstitutionCardProps) {
  const [imageError, setImageError] = useState(false);

  const getTypeLabel = (type: string) => {
    const labels = {
      hospital: 'Больница',
      clinic: 'Клиника',
      polyclinic: 'Поликлиника',
      center: 'Медцентр',
      pharmacy: 'Аптека'
    };
    return labels[type as keyof typeof labels] || type;
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

  const workingNow = isWorkingNow();

  // Default image based on institution type
  const defaultImages = {
    hospital: 'https://images.unsplash.com/photo-1643055419804-397de33fe331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaG9zcGl0YWwlMjBidWlsZGluZ3xlbnwxfHx8fHwxNzU4NTU5MjQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    clinic: 'https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2xpbmljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU4NDc0NDYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    polyclinic: 'https://images.unsplash.com/photo-1758101512269-660feabf64fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2xpbmljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU4NDc0NDYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    center: 'https://images.unsplash.com/photo-1682663947127-ac9d59d7f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc1ODU1OTI0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    pharmacy: 'https://images.unsplash.com/photo-1682663947127-ac9d59d7f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc1ODU1OTI0NXww&ixlib=rb-4.1.0&q=80&w=1080'
  };

  const imageUrl = institution.photos.length > 0 && !imageError 
    ? institution.photos[0] 
    : defaultImages[institution.type as keyof typeof defaultImages];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-blue-100">
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={institution.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
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
          
          <Badge className="bg-blue-100 text-blue-700">
            {getTypeLabel(institution.type)}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge 
            className={`${
              workingNow 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {workingNow ? 'Открыто' : 'Закрыто'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-blue-900 line-clamp-2">
          {institution.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(institution.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-blue-600 font-medium">{institution.rating}</span>
          <span className="text-sm text-gray-500">({institution.reviewCount} отзывов)</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Address */}
        <div className="flex items-start space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">{institution.address}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700">{institution.phone}</span>
        </div>

        {/* Experience */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700">Работает {institution.yearsOfWork} лет</span>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-700">Услуги:</p>
          <div className="flex flex-wrap gap-1">
            {institution.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-600">
                {service}
              </Badge>
            ))}
            {institution.services.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{institution.services.length - 3} еще
              </Badge>
            )}
          </div>
        </div>

        {/* Doctors */}
        <div className="flex items-center space-x-2 text-sm">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700">Врачей: {institution.doctors.length}</span>
        </div>

        {/* Achievements */}
        {institution.achievements.length > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700 truncate">{institution.achievements[0]}</span>
          </div>
        )}

        {/* Website */}
        {institution.website && (
          <div className="flex items-center space-x-2 text-sm">
            <Globe className="w-4 h-4 text-blue-500" />
            <a 
              href={institution.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Сайт учреждения
            </a>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onViewDetails(institution)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Подробная информация
        </Button>
      </CardContent>
    </Card>
  );
}