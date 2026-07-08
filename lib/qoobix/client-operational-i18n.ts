import { getClientLocale } from '@/lib/qoobix/client-i18n';
import type { ClientConfiguration } from '@/lib/qoobix/types';

export type OperationalDictionary = {
  common: {
    backToClientArea: string;
    backToClient: string;
    expiryNotConfigured: string;
  };
  jobPage: {
    badge: string;
    title: string;
    marketQuestion: string;
    fallbackQuestion: string;
    productService: string;
    targetCountries: string;
    commercialObjective: string;
    openResult: string;
    generatedFiles: string;
    generatedFilesText: string;
    expires: string;
  };
  generateButton: {
    startMessage: string;
    failed: string;
    requestFailed: string;
    completed: string;
    generating: string;
    idle: string;
  };
  resultPage: {
    title: string;
    badge: string;
    intro: string;
    downloadNotice: string;
    microsoftOffice: string;
    microsoftOfficeText: string;
    googleUniversal: string;
    googleUniversalText: string;
    otherFiles: string;
    fileExpires: string;
    linkValid: string;
    labels: Record<string, string>;
    help: Record<string, string>;
  };
};

const dictionaries: Record<'en' | 'es' | 'it', OperationalDictionary> = {
  en: {
    common: {
      backToClientArea: 'Back to client area',
      backToClient: 'Back to client',
      expiryNotConfigured: 'Expiry not configured'
    },
    jobPage: {
      badge: 'Intelligence job',
      title: 'Market intelligence request',
      marketQuestion: 'Market question',
      fallbackQuestion: 'Market intelligence request',
      productService: 'Product/service',
      targetCountries: 'Target countries',
      commercialObjective: 'Commercial objective',
      openResult: 'Open result',
      generatedFiles: 'Generated files',
      generatedFilesText: 'Download files from the result page before their expiry date.',
      expires: 'Expires'
    },
    generateButton: {
      startMessage: 'Proteus is generating the DOCX, XLSX, Markdown, RTF, and CSV outputs. Keep this page open.',
      failed: 'Generation failed.',
      requestFailed: 'Generation failed because the request could not be completed.',
      completed: 'Generation completed. Opening the result status…',
      generating: 'Generating outputs…',
      idle: 'Generate outputs'
    },
    resultPage: {
      title: 'Download the intelligence.',
      badge: 'Intelligence ready',
      intro:
        'Choose the format that matches the tool you want to use. DOCX and XLSX are prepared for Microsoft Office. Markdown, RTF and CSV are provided for editable Google Docs / Google Sheets workflows.',
      downloadNotice:
        'Download and store the files you need before their expiry date. The generated files are retained for the configured retention period. The download links shown here are temporary signed links and remain valid for up to 4 hours. Anyone who has one of those temporary links may open it until it expires.',
      microsoftOffice: 'Microsoft Office',
      microsoftOfficeText: 'Use these files with Microsoft Word and Microsoft Excel.',
      googleUniversal: 'Editable / Google-friendly formats',
      googleUniversalText: 'Use Markdown or RTF for editable documents and CSV for Google Sheets.',
      otherFiles: 'Other files',
      fileExpires: 'File expires',
      linkValid: 'Link valid for up to 4 hours',
      labels: {
        docx: 'Microsoft Word report',
        xlsx: 'Microsoft Excel workbook',
        md: 'Editable Markdown report',
        rtf: 'Google Docs / universal editable report',
        csv: 'Google Sheets / candidate CSV export'
      },
      help: {
        docx: 'Best for Microsoft Word.',
        xlsx: 'Best for Microsoft Excel.',
        md: 'Editable plain-text report. Good for Google Docs, editors, and manual cleanup.',
        rtf: 'Upload to Google Drive and open with Google Docs, or open with most word processors.',
        csv: 'Candidate data export for Google Sheets or Excel.'
      }
    }
  },

  es: {
    common: {
      backToClientArea: 'Volver al área de cliente',
      backToClient: 'Volver al cliente',
      expiryNotConfigured: 'Caducidad no configurada'
    },
    jobPage: {
      badge: 'Trabajo de inteligencia',
      title: 'Solicitud de inteligencia de mercado',
      marketQuestion: 'Pregunta de mercado',
      fallbackQuestion: 'Solicitud de inteligencia de mercado',
      productService: 'Producto/servicio',
      targetCountries: 'Países objetivo',
      commercialObjective: 'Objetivo comercial',
      openResult: 'Abrir resultado',
      generatedFiles: 'Archivos generados',
      generatedFilesText: 'Descargue los archivos desde la página de resultado antes de su fecha de caducidad.',
      expires: 'Caduca'
    },
    generateButton: {
      startMessage:
        'Proteus está generando los archivos DOCX, XLSX, Markdown, RTF y CSV. Mantenga esta página abierta.',
      failed: 'La generación ha fallado.',
      requestFailed: 'La generación ha fallado porque la petición no se ha completado.',
      completed: 'Generación completada. Abriendo el estado del resultado…',
      generating: 'Generando archivos…',
      idle: 'Generar archivos'
    },
    resultPage: {
      title: 'Descargue la inteligencia.',
      badge: 'Inteligencia lista',
      intro:
        'Elija el formato que corresponda a la herramienta que desea utilizar. DOCX y XLSX están preparados para Microsoft Office. Markdown, RTF y CSV se proporcionan para flujos editables con Google Docs y Google Sheets.',
      downloadNotice:
        'Descargue y guarde los archivos que necesite antes de su fecha de caducidad. Los archivos generados se conservan durante el periodo de retención configurado. Los enlaces de descarga mostrados aquí son enlaces temporales firmados y siguen siendo válidos hasta 4 horas. Cualquier persona que tenga uno de esos enlaces temporales podrá abrirlo hasta que caduque.',
      microsoftOffice: 'Microsoft Office',
      microsoftOfficeText: 'Use estos archivos con Microsoft Word y Microsoft Excel.',
      googleUniversal: 'Formatos editables / compatibles con Google',
      googleUniversalText: 'Use Markdown o RTF para documentos editables y CSV para Google Sheets.',
      otherFiles: 'Otros archivos',
      fileExpires: 'El archivo caduca',
      linkValid: 'Enlace válido hasta 4 horas',
      labels: {
        docx: 'Informe Microsoft Word',
        xlsx: 'Libro Microsoft Excel',
        md: 'Informe Markdown editable',
        rtf: 'Informe editable para Google Docs / universal',
        csv: 'Exportación CSV de candidatos / Google Sheets'
      },
      help: {
        docx: 'Recomendado para Microsoft Word.',
        xlsx: 'Recomendado para Microsoft Excel.',
        md: 'Informe editable en texto plano. Útil para Google Docs, editores y revisión manual.',
        rtf: 'Subir a Google Drive y abrir con Google Docs, o abrir con la mayoría de procesadores de texto.',
        csv: 'Exportación de candidatos para Google Sheets o Excel.'
      }
    }
  },

  it: {
    common: {
      backToClientArea: 'Torna all’area cliente',
      backToClient: 'Torna al cliente',
      expiryNotConfigured: 'Scadenza non configurata'
    },
    jobPage: {
      badge: 'Job di intelligence',
      title: 'Richiesta di market intelligence',
      marketQuestion: 'Domanda di mercato',
      fallbackQuestion: 'Richiesta di market intelligence',
      productService: 'Prodotto/servizio',
      targetCountries: 'Paesi target',
      commercialObjective: 'Obiettivo commerciale',
      openResult: 'Apri risultato',
      generatedFiles: 'File generati',
      generatedFilesText: 'Scarica i file dalla pagina del risultato prima della data di scadenza.',
      expires: 'Scade'
    },
    generateButton: {
      startMessage:
        'Proteus sta generando gli output DOCX, XLSX, Markdown, RTF e CSV. Tieni aperta questa pagina.',
      failed: 'Generazione non riuscita.',
      requestFailed: 'Generazione non riuscita perché la richiesta non è stata completata.',
      completed: 'Generazione completata. Apertura dello stato del risultato…',
      generating: 'Generazione output…',
      idle: 'Genera output'
    },
    resultPage: {
      title: 'Scarica l’intelligence.',
      badge: 'Intelligence pronta',
      intro:
        'Scegli il formato più adatto allo strumento che vuoi usare. DOCX e XLSX sono preparati per Microsoft Office. Markdown, RTF e CSV sono forniti per flussi modificabili con Google Docs e Google Sheets.',
      downloadNotice:
        'Scarica e conserva i file necessari prima della data di scadenza. I file generati vengono conservati per il periodo configurato. I link di download mostrati qui sono link temporanei firmati e restano validi fino a 4 ore. Chiunque abbia uno di questi link temporanei può aprirlo fino alla scadenza.',
      microsoftOffice: 'Microsoft Office',
      microsoftOfficeText: 'Usa questi file con Microsoft Word e Microsoft Excel.',
      googleUniversal: 'Formati modificabili / compatibili con Google',
      googleUniversalText: 'Usa Markdown o RTF per documenti modificabili e CSV per Google Sheets.',
      otherFiles: 'Altri file',
      fileExpires: 'Il file scade',
      linkValid: 'Link valido fino a 4 ore',
      labels: {
        docx: 'Report Microsoft Word',
        xlsx: 'Workbook Microsoft Excel',
        md: 'Report Markdown modificabile',
        rtf: 'Report modificabile Google Docs / universale',
        csv: 'Export CSV candidati / Google Sheets'
      },
      help: {
        docx: 'Consigliato per Microsoft Word.',
        xlsx: 'Consigliato per Microsoft Excel.',
        md: 'Report modificabile in testo semplice. Utile per Google Docs, editor e revisione manuale.',
        rtf: 'Carica su Google Drive e apri con Google Docs, oppure apri con la maggior parte dei word processor.',
        csv: 'Export candidati per Google Sheets o Excel.'
      }
    }
  }
};

export function getOperationalDictionary(clientOrLanguage: ClientConfiguration | string | null | undefined) {
  return dictionaries[getClientLocale(clientOrLanguage)];
}
