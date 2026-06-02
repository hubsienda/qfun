'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

type GenerateJobButtonLabels = {
  startMessage: string;
  failed: string;
  requestFailed: string;
  completed: string;
  generating: string;
  idle: string;
};

type GenerateJobButtonProps = {
  jobId: string;
  labels?: GenerateJobButtonLabels;
};

const defaultLabels: GenerateJobButtonLabels = {
  startMessage: 'Proteus is generating the DOCX, XLSX, RTF, and CSV outputs. Keep this page open.',
  failed: 'Generation failed.',
  requestFailed: 'Generation failed because the request could not be completed.',
  completed: 'Generation completed. Opening the result status…',
  generating: 'Generating outputs…',
  idle: 'Generate outputs'
};

export function GenerateJobButton({ jobId, labels = defaultLabels }: GenerateJobButtonProps) {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateJob() {
    setMessage(labels.startMessage);
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
        setMessage(payload.error ?? labels.failed);
        return;
      }

      setMessage(labels.completed);
      window.location.reload();
    } catch {
      setMessage(labels.requestFailed);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={generateJob} disabled={isGenerating}>
        {isGenerating ? labels.generating : labels.idle}
      </Button>

      {message ? (
        <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}
    </div>
  );
}
