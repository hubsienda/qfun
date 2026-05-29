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
    setMessage('');
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

      window.location.reload();
    } catch {
      setMessage('Generation failed because the request could not be completed.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div>
      <Button type="button" onClick={generateJob} disabled={isGenerating}>
        {isGenerating ? 'Generating…' : 'Generate outputs'}
      </Button>

      {message ? (
        <p className="mt-3 text-sm font-semibold text-[var(--qoobix-danger)]">{message}</p>
      ) : null}
    </div>
  );
}
