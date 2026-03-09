'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from 'lucide-react';

interface CVSectionProps {
  id: string;
  cvUrl?: string | null;
  isOwnProfile: boolean;
  onCVUpdate?: (newUrl: string) => void;
}

export const CVSection = ({ id, cvUrl, isOwnProfile, onCVUpdate }: CVSectionProps) => {
  const [uploading, setUploading] = useState(false);
  const [cvLink, setCvLink] = useState(cvUrl || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleUploadCV = async () => {
    if (!cvLink.trim()) {
      alert('Please enter a valid CV URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(cvLink);
    } catch {
      alert('Please enter a valid URL (e.g., https://drive.google.com/...)');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvUrl: cvLink }),
      });

      if (!res.ok) {
        throw new Error('Failed to upload CV');
      }

      const data = await res.json();
      alert('CV uploaded successfully!');
      setIsEditing(false);
      if (onCVUpdate) {
        onCVUpdate(data.cvUrl);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curriculum Vitae</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvUrl && !isEditing ? (
          <div className="flex flex-wrap gap-x-2 gap-y-4 justify-between items-center">
            <div>
              <div className="font-medium">CV Available</div>
              <div className="text-sm text-muted-foreground">
                View or download this user&apos;s CV
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(cvUrl, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                View CV
              </Button>
              {isOwnProfile && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Update
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {isOwnProfile ? (
              <div className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Upload Your CV</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share a link to your CV (Google Drive, Dropbox, or any public URL)
                  </p>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUploadCV}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : cvUrl ? 'Update CV' : 'Upload CV'}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setCvLink(cvUrl || '');
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No CV uploaded yet</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};