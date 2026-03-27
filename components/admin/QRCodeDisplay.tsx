'use client';

import { useState } from 'react';
import { Project, projectsApi } from '@/lib/api/projects';

interface QRCodeDisplayProps {
  project: Project;
}

export default function QRCodeDisplay({ project }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const voteUrl = `${window.location.origin}/vote/${project.id}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(voteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      const blob = await projectsApi.downloadQR(project.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/\s+/g, '-')}-qr-code.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download QR code');
    }
  };

  return (
    <div className="card-elevated">
      <h3 className="text-lg font-semibold mb-4">QR Code</h3>

      {project.qr_code_url ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-white p-4 rounded-lg inline-block">
            <img src={project.qr_code_url} alt="QR Code" className="w-48 h-48" />
          </div>

          <div>
            <p className="text-xs text-secondary mb-2">Vote URL:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={voteUrl}
                readOnly
                className="input flex-1 text-sm"
              />
              <button onClick={handleCopyUrl} className="btn-secondary text-sm">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <button onClick={handleDownloadQR} className="btn-primary w-full">
            Download High-Res QR Code
          </button>
        </div>
      ) : (
        <p className="text-secondary">QR code not available</p>
      )}
    </div>
  );
}
