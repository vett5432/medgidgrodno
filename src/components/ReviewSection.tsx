import { useState } from 'react';
import { Star, MessageSquare, User, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Review } from '../types';
import { toast } from 'sonner@2.0.3';

interface ReviewSectionProps {
  institutionId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => void;
}

export function ReviewSection({ institutionId, reviews, onAddReview }: ReviewSectionProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newReview, setNewReview] = useState({
    authorName: '',
    rating: 5,
    comment: ''
  });

  const institutionReviews = reviews.filter(review => 
    review.institutionId === institutionId && review.isApproved
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.authorName.trim() || !newReview.comment.trim()) return;

    onAddReview({
      institutionId,
      authorName: newReview.authorName,
      rating: newReview.rating,
      comment: newReview.comment
    });

    setNewReview({ authorName: '', rating: 5, comment: '' });
    setIsWritingReview(false);
    setShowSuccessMessage(true);
    
    // Show toast notification
    toast.success('Отзыв отправлен на модерацию', {
      description: 'Администратор проверит ваш отзыв, и он появится на сайте после одобрения.',
      duration: 5000,
    });

    // Hide success message after 10 seconds
    setTimeout(() => setShowSuccessMessage(false), 10000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Отзыв успешно отправлен!</p>
                <p className="text-sm text-green-700 mt-1">
                  Ваш отзыв отправлен на модерацию. Администратор проверит его, и после одобрения он появится на сайте.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-900">
          Отзывы ({institutionReviews.length})
        </h3>
        {!isWritingReview && (
          <Button
            onClick={() => setIsWritingReview(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Оставить отзыв
          </Button>
        )}
      </div>

      {/* Write Review Form */}
      {isWritingReview && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Написать отзыв</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label htmlFor="author-name">Ваше имя</Label>
                <Input
                  id="author-name"
                  type="text"
                  value={newReview.authorName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="Введите ваше имя"
                  className="border-blue-200 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <Label>Оценка</Label>
                <div className="flex items-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= newReview.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {newReview.rating} из 5
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Комментарий</Label>
                <Textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Поделитесь своим опытом посещения этого медицинского учреждения..."
                  className="border-blue-200 focus:border-blue-500 min-h-[100px]"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Отправить отзыв
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsWritingReview(false)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {institutionReviews.length === 0 ? (
          <Card className="border-blue-100">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Пока нет отзывов об этом учреждении</p>
              <p className="text-sm text-gray-500 mt-1">
                Станьте первым, кто поделится своим опытом!
              </p>
            </CardContent>
          </Card>
        ) : (
          institutionReviews.map((review) => (
            <Card key={review.id} className="border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">{review.authorName}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}