import { getClientLocale } from '@/lib/qoobix/client-i18n';
import type { ClientConfiguration } from '@/lib/qoobix/types';

export type HelpDictionary = {
  helpIndex: {
    metadataTitle: string;
    backToClientArea: string;
    kicker: string;
    title: string;
    intro: string;
    cardKicker: string;
    openDocument: string;
  };
  helpDocument: {
    metadataTitle: string;
    backToHelp: string;
    kicker: string;
  };
};

const dictionaries: Record<'en' | 'es' | 'it', HelpDictionary> = {
  en: {
    helpIndex: {
      metadataTitle: 'Help',
      backToClientArea: 'Back to client area',
      kicker: 'Private help centre',
      title: 'QOOBIX help.',
      intro:
        'Guidance for using QOOBIX, creating better intelligence requests, and understanding practical examples. This area is available only inside the private client session.',
      cardKicker: 'Help document',
      openDocument: 'Open document'
    },
    helpDocument: {
      metadataTitle: 'Help',
      backToHelp: 'Back to help',
      kicker: 'Private help document'
    }
  },

  es: {
    helpIndex: {
      metadataTitle: 'Ayuda',
      backToClientArea: 'Volver al área de cliente',
      kicker: 'Centro de ayuda privado',
      title: 'Ayuda QOOBIX.',
      intro:
        'Guía para usar QOOBIX, crear mejores solicitudes de inteligencia y comprender ejemplos prácticos. Esta zona solo está disponible dentro de la sesión privada del cliente.',
      cardKicker: 'Documento de ayuda',
      openDocument: 'Abrir documento'
    },
    helpDocument: {
      metadataTitle: 'Ayuda',
      backToHelp: 'Volver a ayuda',
      kicker: 'Documento privado de ayuda'
    }
  },

  it: {
    helpIndex: {
      metadataTitle: 'Aiuto',
      backToClientArea: 'Torna all’area cliente',
      kicker: 'Centro assistenza privato',
      title: 'Aiuto QOOBIX.',
      intro:
        'Guida per usare QOOBIX, creare richieste di intelligence migliori e comprendere esempi pratici. Quest’area è disponibile solo all’interno della sessione privata del cliente.',
      cardKicker: 'Documento di aiuto',
      openDocument: 'Apri documento'
    },
    helpDocument: {
      metadataTitle: 'Aiuto',
      backToHelp: 'Torna all’aiuto',
      kicker: 'Documento privato di aiuto'
    }
  }
};

export function getHelpDictionary(clientOrLanguage: ClientConfiguration | string | null | undefined) {
  return dictionaries[getClientLocale(clientOrLanguage)];
}
