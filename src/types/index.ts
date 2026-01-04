export interface MedicalInstitution {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  type: 'hospital' | 'clinic' | 'polyclinic' | 'center' | 'pharmacy';
  isPaid: boolean;
  workingHours: {
    [key: string]: { open: string; close: string; isWorking: boolean };
  };
  services: string[];
  doctors: Doctor[];
  photos: string[];
  description: string;
  rating: number;
  reviewCount: number;
  location: {
    district: string;
    coordinates: { lat: number; lng: number };
  };
  achievements: string[];
  yearsOfWork: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  photo?: string;
  workingHours: {
    [key: string]: { open: string; close: string; isWorking: boolean };
  };
  category: string;
}

export interface Review {
  id: string;
  institutionId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export interface SearchFilters {
  query: string;
  priceType: 'all' | 'free' | 'paid';
  specialization: string;
  district: string;
  workingNow: boolean;
  sortBy: 'alphabetical' | 'price' | 'rating';
}

export interface MedicalNews {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'health' | 'announcement' | 'prevention' | 'research' | 'events';
  date: string;
  imageUrl?: string;
  source?: string;
}