import { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, X, Image as ImageIcon, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Toast } from './Toast';

interface MediaItem {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  file_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      showToast('Failed to load media', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          showToast(`${file.name} is not an image`, 'error');
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('toolserve-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('toolserve-media')
          .getPublicUrl(filePath);

        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            filename: file.name,
            storage_path: filePath,
            public_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
            width: img.width,
            height: img.height,
            uploaded_by: user.id
          });

        if (dbError) throw dbError;
      }

      showToast('Files uploaded successfully', 'success');
      fetchMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
      showToast('Failed to upload files', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.filename}?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('toolserve-media')
        .remove([item.storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      showToast('Media deleted successfully', 'success');
      fetchMedia();
      if (selectedImage?.id === item.id) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      showToast('Failed to delete media', 'error');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleUpdateMetadata = async () => {
    if (!selectedImage) return;

    try {
      const { error } = await supabase
        .from('media_library')
        .update({
          alt_text: selectedImage.alt_text,
          caption: selectedImage.caption,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedImage.id);

      if (error) throw error;

      showToast('Metadata updated successfully', 'success');
      fetchMedia();
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating metadata:', error);
      showToast('Failed to update metadata', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Media Library</h2>
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <Button disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </label>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by filename or alt text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {filteredMedia.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <ImageIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 mb-2">No media files found</p>
          <p className="text-sm text-slate-500">Upload images to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                <img
                  src={item.public_url}
                  alt={item.alt_text || item.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-3">
                <p className="text-sm font-medium text-slate-800 truncate mb-1">
                  {item.filename}
                </p>
                <p className="text-xs text-slate-500">
                  {item.width && item.height ? `${item.width}×${item.height} • ` : ''}
                  {formatFileSize(item.file_size)}
                </p>
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setSelectedImage(item)}
                  className="p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                  title="View details"
                >
                  <ImageIcon className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  onClick={() => handleCopyUrl(item.public_url)}
                  className="p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                  title="Copy URL"
                >
                  {copiedUrl === item.public_url ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-700" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Media Details</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={selectedImage.public_url}
                  alt={selectedImage.alt_text || selectedImage.filename}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Filename
                  </label>
                  <p className="text-slate-900">{selectedImage.filename}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dimensions
                  </label>
                  <p className="text-slate-900">
                    {selectedImage.width && selectedImage.height
                      ? `${selectedImage.width} × ${selectedImage.height}px`
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Size
                  </label>
                  <p className="text-slate-900">{formatFileSize(selectedImage.file_size)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Type
                  </label>
                  <p className="text-slate-900">{selectedImage.file_type}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Public URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedImage.public_url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyUrl(selectedImage.public_url)}
                  >
                    {copiedUrl === selectedImage.public_url ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={selectedImage.alt_text || ''}
                  onChange={(e) => setSelectedImage({ ...selectedImage, alt_text: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={selectedImage.caption || ''}
                  onChange={(e) => setSelectedImage({ ...selectedImage, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Optional caption"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateMetadata}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
