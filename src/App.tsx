import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { MedicalInstitutionCard } from './components/MedicalInstitutionCard';
import { InstitutionDetails } from './components/InstitutionDetails';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { MedicalNews } from './components/MedicalNews';
import { Button } from './components/ui/button';
import { ChevronLeft, ChevronRight, Building2, Newspaper } from 'lucide-react';
import { MedicalInstitution, Review, SearchFilters as SearchFiltersType, MedicalNews as MedicalNewsType } from './types';
import { mockInstitutions, mockReviews, mockNews } from './data/mockData';
import { Toaster } from './components/ui/sonner';

const ITEMS_PER_PAGE = 6;

export default function App() {
  const [institutions, setInstitutions] = useState<MedicalInstitution[]>(mockInstitutions);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [news, setNews] = useState<MedicalNewsType[]>(mockNews);
  const [selectedInstitution, setSelectedInstitution] = useState<MedicalInstitution | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'institutions' | 'news'>('institutions');
  const [filters, setFilters] = useState<SearchFiltersType>({
    query: '',
    priceType: 'all',
    specialization: 'none',
    district: 'none',
    workingNow: false,
    sortBy: 'alphabetical'
  });

  // Filter and sort institutions
  const filteredInstitutions = useMemo(() => {
    let filtered = institutions.filter(institution => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const searchIn = [
          institution.name,
          institution.description,
          institution.address,
          ...institution.services,
          ...institution.doctors.map(d => d.name + ' ' + d.specialization)
        ].join(' ').toLowerCase();
        
        if (!searchIn.includes(query)) return false;
      }

      // Price filter
      if (filters.priceType !== 'all') {
        if (filters.priceType === 'free' && institution.isPaid) return false;
        if (filters.priceType === 'paid' && !institution.isPaid) return false;
      }

      // Specialization filter
      if (filters.specialization && filters.specialization !== 'none') {
        const hasSpecialization = institution.services.some(service => 
          service.toLowerCase().includes(filters.specialization.toLowerCase())
        ) || institution.doctors.some(doctor => 
          doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
        );
        if (!hasSpecialization) return false;
      }

      // District filter
      if (filters.district && filters.district !== 'none' && institution.location.district !== filters.district) {
        return false;
      }

      // Working now filter
      if (filters.workingNow) {
        const now = new Date();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const day = dayNames[now.getDay()];
        const currentTime = now.toTimeString().slice(0, 5);
        
        const todaySchedule = institution.workingHours[day];
        if (!todaySchedule?.isWorking) return false;
        
        const isOpen = currentTime >= todaySchedule.open && currentTime <= todaySchedule.close;
        if (!isOpen) return false;
      }

      return true;
    });

    // Sort results
    switch (filters.sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
      case 'price':
        filtered.sort((a, b) => Number(a.isPaid) - Number(b.isPaid));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [institutions, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredInstitutions.length / ITEMS_PER_PAGE);
  const paginatedInstitutions = filteredInstitutions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleViewDetails = (institution: MedicalInstitution) => {
    setSelectedInstitution(institution);
  };

  const handleBack = () => {
    setSelectedInstitution(null);
  };

  const handleAddReview = (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      isApproved: false
    };
    setReviews(prev => [...prev, newReview]);
  };

  const handleUpdateInstitution = (id: string, updates: Partial<MedicalInstitution>) => {
    setInstitutions(prev => prev.map(inst => 
      inst.id === id ? { ...inst, ...updates } : inst
    ));
  };

  const handleDeleteInstitution = (id: string) => {
    setInstitutions(prev => prev.filter(inst => inst.id !== id));
  };

  const handleAddInstitution = (institution: Omit<MedicalInstitution, 'id'>) => {
    const newInstitution: MedicalInstitution = {
      ...institution,
      id: Date.now().toString()
    };
    setInstitutions(prev => [...prev, newInstitution]);
  };

  const handleApproveReview = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, isApproved: true } : review
    ));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const handleAddNews = (newsItem: Omit<MedicalNewsType, 'id'>) => {
    const newNews: MedicalNewsType = {
      ...newsItem,
      id: Date.now().toString()
    };
    setNews(prev => [...prev, newNews]);
  };

  const handleDeleteNews = (newsId: string) => {
    setNews(prev => prev.filter(newsItem => newsItem.id !== newsId));
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Toaster richColors position="top-right" />
        <Header 
          onSearch={handleSearch}
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
          isAdminMode={isAdminMode}
          onQuickSearch={handleSearch}
        />
        <AdminPanel
          institutions={institutions}
          reviews={reviews}
          news={news}
          onUpdateInstitution={handleUpdateInstitution}
          onDeleteInstitution={handleDeleteInstitution}
          onAddInstitution={handleAddInstitution}
          onApproveReview={handleApproveReview}
          onDeleteReview={handleDeleteReview}
          onAddNews={handleAddNews}
          onDeleteNews={handleDeleteNews}
        />
        <Footer 
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
          isAdminMode={isAdminMode}
        />
      </div>
    );
  }

  if (selectedInstitution) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Toaster richColors position="top-right" />
        <Header 
          onSearch={handleSearch}
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
          isAdminMode={isAdminMode}
          onQuickSearch={handleSearch}
        />
        <InstitutionDetails
          institution={selectedInstitution}
          reviews={reviews}
          onBack={handleBack}
          onAddReview={handleAddReview}
        />
        <Footer 
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
          isAdminMode={isAdminMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Toaster richColors position="top-right" />
      <Header 
        onSearch={handleSearch}
        onAdminToggle={() => setIsAdminMode(!isAdminMode)}
        isAdminMode={isAdminMode}
        onQuickSearch={handleSearch}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 bg-white rounded-lg p-1 border border-blue-100 w-fit">
          <Button
            variant={activeTab === 'institutions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('institutions')}
            className={activeTab === 'institutions' ? 'bg-blue-600 text-white' : 'text-blue-700'}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Медицинские учреждения
          </Button>
          <Button
            variant={activeTab === 'news' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('news')}
            className={activeTab === 'news' ? 'bg-blue-600 text-white' : 'text-blue-700'}
          >
            <Newspaper className="w-4 h-4 mr-2" />
            Медицинские новости
          </Button>
        </div>

        {activeTab === 'institutions' ? (
          <>
            {/* Search Filters */}
            <div className="mb-6">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultsCount={filteredInstitutions.length}
              />
            </div>

            {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedInstitutions.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Учреждения не найдены
                </h3>
                <p className="text-blue-600">
                  Попробуйте изменить параметры поиска или очистить фильтры
                </p>
              </div>
            </div>
          ) : (
            paginatedInstitutions.map((institution) => (
              <MedicalInstitutionCard
                key={institution.id}
                institution={institution}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Назад
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-blue-600 text-white" : "bg-white"}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="bg-white"
            >
              Вперед
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

            {/* Statistics */}
            {filteredInstitutions.length > 0 && (
              <div className="mt-12 bg-white rounded-lg shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
                  Статистика медицинских учреждений Гродно
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {institutions.length}
                    </div>
                    <div className="text-sm text-blue-700">Всего учреждений</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {institutions.filter(i => !i.isPaid).length}
                    </div>
                    <div className="text-sm text-green-700">Бесплатных</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {institutions.filter(i => i.isPaid).length}
                    </div>
                    <div className="text-sm text-orange-700">Платных</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {reviews.filter(r => r.isApproved).length}
                    </div>
                    <div className="text-sm text-purple-700">Отзывов</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Medical News */}
            <MedicalNews news={news} />
          </>
        )}
      </main>

      <Footer 
        onAdminToggle={() => setIsAdminMode(!isAdminMode)}
        isAdminMode={isAdminMode}
      />
    </div>
  );
}