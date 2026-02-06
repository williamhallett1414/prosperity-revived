import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Plus, Calendar, Scale, Ruler } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ProgressPhotoGallery({ photos }) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    notes: '',
    photo_url: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    body_fat_percentage: ''
  });
  const queryClient = useQueryClient();

  const uploadPhotoMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.ProgressPhoto.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['progressPhotos']);
      setShowUpload(false);
      resetForm();
      toast.success('Progress photo uploaded!');
    }
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      notes: '',
      photo_url: '',
      measurements: {
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: ''
      },
      body_fat_percentage: ''
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, photo_url: file_url });
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.photo_url) {
      toast.error('Please upload a photo');
      return;
    }

    const data = {
      date: formData.date,
      photo_url: formData.photo_url,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      notes: formData.notes || undefined,
      body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : undefined,
      measurements: Object.keys(formData.measurements).some(k => formData.measurements[k]) 
        ? Object.fromEntries(
            Object.entries(formData.measurements)
              .filter(([_, v]) => v)
              .map(([k, v]) => [k, parseFloat(v)])
          )
        : undefined
    };

    uploadPhotoMutation.mutate(data);
  };

  const sortedPhotos = [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-pink-600" />
              Progress Photos
            </span>
            <Button
              size="sm"
              onClick={() => setShowUpload(true)}
              className="bg-pink-600 hover:bg-pink-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Upload
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedPhotos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No progress photos yet. Start tracking your transformation!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sortedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative group cursor-pointer rounded-lg overflow-hidden aspect-square"
                >
                  <img
                    src={photo.photo_url}
                    alt={`Progress ${format(new Date(photo.date), 'MMM d, yyyy')}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 text-white text-xs">
                      <p className="font-semibold">{format(new Date(photo.date), 'MMM d')}</p>
                      {photo.weight && <p>{photo.weight} lbs</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Progress Photo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Photo</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-upload"
              />
              {formData.photo_url ? (
                <div className="relative mt-2">
                  <img src={formData.photo_url} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setFormData({ ...formData, photo_url: '' })}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label htmlFor="photo-upload">
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-pink-400 transition-colors">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload photo'}
                    </p>
                  </div>
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 150"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="body_fat">Body Fat % (Optional)</Label>
              <Input
                id="body_fat"
                type="number"
                step="0.1"
                placeholder="e.g., 18.5"
                value={formData.body_fat_percentage}
                onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2 block">Measurements (inches, optional)</Label>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(formData.measurements).map((key) => (
                  <div key={key}>
                    <Label htmlFor={key} className="text-xs capitalize">{key}</Label>
                    <Input
                      id={key}
                      type="number"
                      step="0.1"
                      placeholder={key}
                      value={formData.measurements[key]}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, [key]: e.target.value }
                      })}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="How are you feeling? Any milestones?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.photo_url || uploadPhotoMutation.isPending}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {uploadPhotoMutation.isPending ? 'Uploading...' : 'Upload Progress Photo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Progress Photo - {format(new Date(selectedPhoto.date), 'MMMM d, yyyy')}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedPhoto.photo_url}
                  alt="Progress"
                  className="w-full rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  {selectedPhoto.weight && (
                    <div className="flex items-center gap-2 text-sm">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{selectedPhoto.weight} lbs</span>
                    </div>
                  )}
                  {selectedPhoto.body_fat_percentage && (
                    <div className="flex items-center gap-2 text-sm">
                      <Ruler className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{selectedPhoto.body_fat_percentage}% body fat</span>
                    </div>
                  )}
                </div>
                {selectedPhoto.measurements && Object.keys(selectedPhoto.measurements).length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Measurements</p>
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                      {Object.entries(selectedPhoto.measurements).map(([key, value]) => (
                        <div key={key}>
                          <span className="capitalize">{key}:</span> {value}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedPhoto.notes && (
                  <div>
                    <p className="font-semibold text-sm mb-1">Notes</p>
                    <p className="text-sm text-gray-600">{selectedPhoto.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}