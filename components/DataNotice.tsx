type DataNoticeProps = {
  variant?: 'compact' | 'full';
  language?: string | null;
};

type DataNoticeLabels = {
  fullTitle: string;
  fullParagraph1: string;
  fullParagraph2: string;
  fullParagraph3: string;
  compact: string;
};

const labels: Record<'en' | 'es' | 'it', DataNoticeLabels> = {
  en: {
    fullTitle: 'AI-assisted analysis and verification notice',
    fullParagraph1:
      'QOOBIX generates AI-assisted market intelligence from the business profile and the specific request submitted by the client. Outputs may contain errors, omissions, incomplete information, outdated assumptions, or candidate market signals requiring verification.',
    fullParagraph2:
      'Reports and workbooks must be reviewed and verified before they are used for commercial, legal, regulatory, technical, financial, procurement, or strategic decisions. QOOBIX does not replace professional judgement, source verification, commercial due diligence, or sector-specific expertise.',
    fullParagraph3:
      'Generated files are retained temporarily according to the configured retention period. The client is responsible for downloading and keeping any output they need to preserve.',
    compact:
      'AI-assisted outputs may contain errors, omissions, candidate information, or incomplete information. Verify all intelligence before commercial use. Generated files are retained temporarily; download anything you need to keep.'
  },
  es: {
    fullTitle: 'Aviso sobre análisis asistido por IA y verificación',
    fullParagraph1:
      'QOOBIX genera inteligencia de mercado asistida por IA a partir del perfil empresarial y de la solicitud específica enviada por el cliente. Los resultados pueden contener errores, omisiones, información incompleta, hipótesis desactualizadas o señales de mercado candidatas que requieren verificación.',
    fullParagraph2:
      'Los informes y libros de trabajo deben revisarse y verificarse antes de utilizarse para decisiones comerciales, legales, regulatorias, técnicas, financieras, de compras o estratégicas. QOOBIX no sustituye el juicio profesional, la verificación de fuentes, la diligencia comercial ni la experiencia sectorial.',
    fullParagraph3:
      'Los archivos generados se conservan temporalmente según el periodo de retención configurado. El cliente es responsable de descargar y conservar cualquier resultado que necesite guardar.',
    compact:
      'Los resultados asistidos por IA pueden contener errores, omisiones, información candidata o información incompleta. Verifique toda la inteligencia antes de su uso comercial. Los archivos generados se conservan temporalmente; descargue todo lo que necesite guardar.'
  },
  it: {
    fullTitle: 'Avviso su analisi assistita da IA e verifica',
    fullParagraph1:
      'QOOBIX genera market intelligence assistita da IA a partire dal profilo aziendale e dalla richiesta specifica inviata dal cliente. Gli output possono contenere errori, omissioni, informazioni incomplete, ipotesi non aggiornate o segnali di mercato candidati che richiedono verifica.',
    fullParagraph2:
      'Report e workbook devono essere revisionati e verificati prima di essere utilizzati per decisioni commerciali, legali, regolatorie, tecniche, finanziarie, di procurement o strategiche. QOOBIX non sostituisce il giudizio professionale, la verifica delle fonti, la due diligence commerciale o la competenza di settore.',
    fullParagraph3:
      'I file generati vengono conservati temporaneamente secondo il periodo di conservazione configurato. Il cliente è responsabile di scaricare e conservare qualsiasi output debba mantenere.',
    compact:
      'Gli output assistiti da IA possono contenere errori, omissioni, informazioni candidate o informazioni incomplete. Verifica tutta l’intelligence prima dell’uso commerciale. I file generati vengono conservati temporaneamente; scarica tutto ciò che devi mantenere.'
  }
};

function getLocale(language?: string | null): 'en' | 'es' | 'it' {
  const value = (language ?? '').toLowerCase();

  if (
    value === 'es' ||
    value.includes('spanish') ||
    value.includes('español') ||
    value.includes('espanol') ||
    value.includes('spain')
  ) {
    return 'es';
  }

  if (
    value === 'it' ||
    value.includes('italian') ||
    value.includes('italiano') ||
    value.includes('italy') ||
    value.includes('italia')
  ) {
    return 'it';
  }

  return 'en';
}

export function DataNotice({ variant = 'compact', language }: DataNoticeProps) {
  const t = labels[getLocale(language)];

  if (variant === 'full') {
    return (
      <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/48 p-5 text-sm leading-7 text-[var(--qoobix-muted)] shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
        <h2 className="mb-3 text-base font-semibold tracking-[-0.02em] text-[var(--qoobix-text)]">
          {t.fullTitle}
        </h2>
        <p>{t.fullParagraph1}</p>
        <p className="mt-3">{t.fullParagraph2}</p>
        <p className="mt-3">{t.fullParagraph3}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/46 p-4 text-sm leading-7 text-[var(--qoobix-muted)] shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
      {t.compact}
    </div>
  );
}
