import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Download, ExternalLink, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileViewerProps {
  filePath: string;
  fileName: string;
  uploadTitle: string;
  externalLink?: string | null;
  children: React.ReactNode;
}

export const FileViewer: React.FC<FileViewerProps> = ({ 
  filePath, 
  fileName, 
  uploadTitle, 
  externalLink,
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleViewFile = async () => {
    if (externalLink) {
      window.open(externalLink, '_blank');
      return;
    }

    if (!filePath) return;

    setIsLoading(true);
    try {
      // Use signed URL for iframe viewing to avoid Chrome blocking
      const { data, error } = await supabase.storage
        .from('notes')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;

      setFileUrl(data.signedUrl);
      setIsOpen(true);
    } catch (error: any) {
      console.error('Error getting file URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to load file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (externalLink) {
      window.open(externalLink, '_blank');
      return;
    }

    if (!filePath) return;

    try {
      const { data, error } = await supabase.storage
        .from('notes')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download Started',
        description: 'Your file download has started.',
      });
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getFileExtension = (path: string) => {
    return path.split('.').pop()?.toLowerCase() || '';
  };

  const canPreview = (path: string) => {
    const ext = getFileExtension(path);
    return ['pdf', 'txt', 'md'].includes(ext);
  };

  return (
    <>
      <div 
        onClick={handleViewFile}
        className="cursor-pointer"
      >
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{uploadTitle}</span>
              <div className="flex space-x-2">
                {filePath && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                )}
                {externalLink && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(externalLink, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Link</span>
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : fileUrl && canPreview(filePath) ? (
              <iframe
                src={fileUrl}
                className="w-full h-96 border rounded-md"
                title={uploadTitle}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            ) : fileUrl ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Eye className="h-12 w-12 text-gray-400" />
                <p className="text-gray-600">Preview not available for this file type.</p>
                <Button onClick={handleDownload} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download to View</span>
                </Button>
              </div>
            ) : externalLink ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <ExternalLink className="h-12 w-12 text-gray-400" />
                <p className="text-gray-600">This is an external resource.</p>
                <Button 
                  onClick={() => window.open(externalLink, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open External Link</span>
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};