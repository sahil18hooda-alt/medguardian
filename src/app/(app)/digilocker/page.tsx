'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { getFiles, uploadFile, downloadFile } from '@/lib/storage';
import { Loader2, Download, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FileObject {
  name: string;
  // Add other properties as needed
}

export default function DigiLockerPage() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const fileList = await getFiles();
      setFiles(fileList || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error fetching files',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await uploadFile(selectedFile);
      toast({ title: 'File uploaded successfully' });
      fetchFiles(); // Refresh the file list
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message,
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const file = await downloadFile(fileName);
      if (file) {
        const blob = new Blob([file], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: error.message,
      });
    }
  };

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/share?token=dummy-token`;
    navigator.clipboard.writeText(shareLink);
    toast({ title: 'Share link copied to clipboard' });
  };

  const handleLogout = async () => {
    router.push('/login');
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Health DigiLocker</CardTitle>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Securely store and manage your medical records.
          </p>
          <div className="flex gap-4 mb-4">
            <Input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Files</h3>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading files...</span>
              </div>
            ) : files.length > 0 ? (
              <ul className="space-y-2">
                {files.map((file) => (
                  <li key={file.name} className="flex items-center justify-between p-2 border rounded-md">
                    <span>{file.name}</span>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleDownload(file.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
