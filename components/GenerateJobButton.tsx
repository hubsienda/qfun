'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

type GenerateJobButtonProps = {
  jobId: string;
};

export function GenerateJobButton({ jobId }: GenerateJobButtonProps) {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateJob() {
    setMessage('Proteus is generating the DOCX and XLSX outputs. Keep this page open.');
    setIsGenerating(true);

    try {
      const response = await fetch(`/api/generate/${jobId}`, {
        method: 'POST'
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Generation failed.');
        return;
      }

      setMessage('Generation completed. Opening the result status…');
      window.location.reload();
    } catch {
      setMessage('Generation failed because the request could not be completed.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={generateJob} disabled={isGenerating}>
        {isGenerating ? 'Generating outputs…' : 'Generate DOCX/XLSX outputs'}
      </Button>

      {message ? (
        <p
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            isGenerating
              ? 'border-[var(--qoobix-border)] bg-white/70'
              : 'border-[var(--qoobix-border)] bg-white/70'
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
