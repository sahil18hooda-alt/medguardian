'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { getFiles, downloadFile } from '@/lib/storage';
import { Loader2, Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface FileObject {
  name: string;
  // Add other properties as needed
}

export default function SharePage() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token === 'dummy-token') {
        fetchFiles();
    } else {
        setIsLoading(false);
        toast({ variant: 'destructive', title: 'Invalid share link' });
    }
  }, [token]);

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

  return (
    <div className="container mx-auto max-w-5xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Shared Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <Button size="icon" variant="ghost" onClick={() => handleDownload(file.name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files shared.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
