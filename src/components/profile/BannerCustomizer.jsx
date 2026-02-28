import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const defaultBanners = [
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
  'https://images.unsplash.com/photo-1518562923427-6629f33a5c5e?w=800',
  'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=800',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
];

export default function BannerCustomizer({ isOpen, onClose, currentBanner, onSave }) {
  const [selectedBanner, setSelectedBanner] = useState(currentBanner || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setSelectedBanner(file_url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await base44.auth.updateMe({ banner_image_url: selectedBanner });
      toast.success('Banner updated successfully');
      onSave(selectedBanner);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to update banner');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Customize Profile Banner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div>
            <p className="text-sm font-medium mb-2">Preview</p>
            <div className="w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-[#0A1A2F] via-[#c9a227] to-[#D9B878]">
              {selectedBanner ? (
                <img
                  src={selectedBanner}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Custom */}
          <div>
            <p className="text-sm font-medium mb-2">Upload Custom Image</p>
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-[#D9B878]/40 rounded-xl p-4 hover:border-[#c9a227] transition-colors">
                <div className="flex items-center justify-center gap-2 text-[#0A1A2F]/60">
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Click to upload (max 5MB)</span>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Default Templates */}
          <div>
            <p className="text-sm font-medium mb-2">Choose from Templates</p>
            <div className="grid grid-cols-3 gap-2">
              {defaultBanners.map((banner, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedBanner(banner)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    selectedBanner === banner
                      ? 'border-[#c9a227] ring-2 ring-[#c9a227]/20'
                      : 'border-[#D9B878]/25 hover:border-[#c9a227]/50'
                  }`}
                >
                  <img
                    src={banner}
                    alt={`Template ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedBanner || saving}
              className="bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:from-[#b89320] hover:to-[#c9a227]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Banner'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}