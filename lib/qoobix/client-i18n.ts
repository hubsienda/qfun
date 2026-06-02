import type { ClientConfiguration } from '@/lib/qoobix/types';

export type ClientLocale = 'en' | 'es' | 'it';

export type ClientDictionary = {
  common: {
    backToClientArea: string;
    logout: string;
  };
  newRequestPage: {
    metadataTitle: string;
    profileRequiredBadge: string;
    profileRequiredTitle: string;
    profileRequiredText: string;
    completeBusinessProfile: string;
    badge: string;
    intro: string;
  };
  newJobForm: {
    intelligenceMode: string;
    analysis: string;
    discovery: string;
    analysisDescription: string;
    discoveryDescription: string;
    productOrService: string;
    targetCountries: string;
    marketQuestion: string;
    marketQuestionHint: string;
    commercialObjective: string;
    targetCustomerTypes: string;
    targetChannels: string;
    knownCompetitors: string;
    knownPartners: string;
    preferredOutputLanguage: string;
    outputNotice: string;
    creatingNotice: string;
    genericCreateError: string;
    requestFailedError: string;
    creatingButton: string;
    submitButton: string;
    objectives: Record<string, string>;
  };
};

const dictionaries: Record<ClientLocale, ClientDictionary> = {
  en: {
    common: {
      backToClientArea: 'Back to client area',
      logout: 'Log out'
    },
    newRequestPage: {
      metadataTitle: 'New request',
      profileRequiredBadge: 'Business profile required',
      profileRequiredTitle: 'Complete the business profile first.',
      profileRequiredText:
        'QOOBIX needs the stable client context before it can generate useful request-specific intelligence.',
      completeBusinessProfile: 'Complete business profile',
      badge: 'New intelligence request',
      intro:
        'Describe the specific market question. QOOBIX will combine this request with the saved business profile and generate downloadable DOCX, XLSX, RTF, and CSV outputs.'
    },
    newJobForm: {
      intelligenceMode: 'Intelligence mode',
      analysis: 'Analysis',
      discovery: 'Discovery',
      analysisDescription:
        'Analysis Mode produces strategic intelligence, positioning, risks, priorities, and commercial reasoning without live named-organisation discovery.',
      discoveryDescription:
        'Discovery Mode is for named candidate organisations such as possible partners, distributors, competitors, suppliers, operators, or other market actors. These candidates are for verification, not confirmed leads.',
      productOrService: 'Product or service to analyse',
      targetCountries: 'Target country or countries',
      marketQuestion: 'Market question',
      marketQuestionHint: 'Describe the commercial question QOOBIX should answer.',
      commercialObjective: 'Commercial objective',
      targetCustomerTypes: 'Target customer types',
      targetChannels: 'Target channels',
      knownCompetitors: 'Known competitors',
      knownPartners: 'Known partners/distributors/representatives',
      preferredOutputLanguage: 'Preferred output language',
      outputNotice:
        'QOOBIX will generate the provisioned output files for this environment. Current output formats are DOCX, XLSX, RTF, and CSV. Discovery Mode prepares the request for candidate organisation discovery, but candidates must still be independently verified.',
      creatingNotice: 'Creating the request and preparing the job page…',
      genericCreateError: 'The intelligence request could not be created.',
      requestFailedError: 'The intelligence request could not be created because the request failed.',
      creatingButton: 'Creating request…',
      submitButton: 'Create intelligence request',
      objectives: {
        'Market-entry analysis': 'Market-entry analysis',
        'Distributor discovery': 'Distributor discovery',
        'Partner discovery': 'Partner discovery',
        'Competitor mapping': 'Competitor mapping',
        'Regional opportunity assessment': 'Regional opportunity assessment',
        'Lead/prospect discovery': 'Lead/prospect discovery',
        'Positioning analysis': 'Positioning analysis',
        'Pricing/channel analysis': 'Pricing/channel analysis',
        'Action-priority report': 'Action-priority report'
      }
    }
  },

  es: {
    common: {
      backToClientArea: 'Volver al área de cliente',
      logout: 'Cerrar sesión'
    },
    newRequestPage: {
      metadataTitle: 'Nueva solicitud',
      profileRequiredBadge: 'Perfil empresarial requerido',
      profileRequiredTitle: 'Complete primero el perfil empresarial.',
      profileRequiredText:
        'QOOBIX necesita el contexto estable del cliente antes de generar inteligencia útil para una solicitud concreta.',
      completeBusinessProfile: 'Completar perfil empresarial',
      badge: 'Nueva solicitud de inteligencia',
      intro:
        'Describa la pregunta de mercado concreta. QOOBIX combinará esta solicitud con el perfil empresarial guardado y generará archivos descargables en DOCX, XLSX, RTF y CSV.'
    },
    newJobForm: {
      intelligenceMode: 'Modo de inteligencia',
      analysis: 'Análisis',
      discovery: 'Descubrimiento',
      analysisDescription:
        'El modo Análisis produce inteligencia estratégica, posicionamiento, riesgos, prioridades y razonamiento comercial sin descubrimiento en directo de organizaciones con nombre.',
      discoveryDescription:
        'El modo Descubrimiento sirve para identificar organizaciones candidatas, como posibles socios, distribuidores, competidores, proveedores, operadores u otros actores de mercado. Son candidatos para verificación, no oportunidades confirmadas.',
      productOrService: 'Producto o servicio que se debe analizar',
      targetCountries: 'País o países objetivo',
      marketQuestion: 'Pregunta de mercado',
      marketQuestionHint: 'Describa la pregunta comercial que QOOBIX debe responder.',
      commercialObjective: 'Objetivo comercial',
      targetCustomerTypes: 'Tipos de clientes objetivo',
      targetChannels: 'Canales objetivo',
      knownCompetitors: 'Competidores conocidos',
      knownPartners: 'Socios, distribuidores o representantes conocidos',
      preferredOutputLanguage: 'Idioma preferido del resultado',
      outputNotice:
        'QOOBIX generará los archivos de salida previstos para este entorno. Los formatos actuales son DOCX, XLSX, RTF y CSV. El modo Descubrimiento prepara la solicitud para descubrir organizaciones candidatas, pero los candidatos deberán verificarse de forma independiente.',
      creatingNotice: 'Creando la solicitud y preparando la página del trabajo…',
      genericCreateError: 'No se ha podido crear la solicitud de inteligencia.',
      requestFailedError:
        'No se ha podido crear la solicitud de inteligencia porque la petición ha fallado.',
      creatingButton: 'Creando solicitud…',
      submitButton: 'Crear solicitud de inteligencia',
      objectives: {
        'Market-entry analysis': 'Análisis de entrada en mercado',
        'Distributor discovery': 'Descubrimiento de distribuidores',
        'Partner discovery': 'Descubrimiento de socios',
        'Competitor mapping': 'Mapeo de competidores',
        'Regional opportunity assessment': 'Evaluación regional de oportunidades',
        'Lead/prospect discovery': 'Descubrimiento de prospectos',
        'Positioning analysis': 'Análisis de posicionamiento',
        'Pricing/channel analysis': 'Análisis de precios y canales',
        'Action-priority report': 'Informe de prioridades de acción'
      }
    }
  },

  it: {
    common: {
      backToClientArea: 'Torna all’area cliente',
      logout: 'Esci'
    },
    newRequestPage: {
      metadataTitle: 'Nuova richiesta',
      profileRequiredBadge: 'Profilo aziendale richiesto',
      profileRequiredTitle: 'Completa prima il profilo aziendale.',
      profileRequiredText:
        'QOOBIX ha bisogno del contesto stabile del cliente prima di generare intelligence utile per una richiesta specifica.',
      completeBusinessProfile: 'Completa il profilo aziendale',
      badge: 'Nuova richiesta di intelligence',
      intro:
        'Descrivi la domanda di mercato specifica. QOOBIX combinerà questa richiesta con il profilo aziendale salvato e genererà file scaricabili in DOCX, XLSX, RTF e CSV.'
    },
    newJobForm: {
      intelligenceMode: 'Modalità di intelligence',
      analysis: 'Analisi',
      discovery: 'Discovery',
      analysisDescription:
        'La modalità Analisi produce intelligence strategica, posizionamento, rischi, priorità e ragionamento commerciale senza discovery in tempo reale di organizzazioni nominate.',
      discoveryDescription:
        'La modalità Discovery serve a individuare organizzazioni candidate, come potenziali partner, distributori, concorrenti, fornitori, operatori o altri attori di mercato. Sono candidati da verificare, non contatti confermati.',
      productOrService: 'Prodotto o servizio da analizzare',
      targetCountries: 'Paese o Paesi target',
      marketQuestion: 'Domanda di mercato',
      marketQuestionHint: 'Descrivi la domanda commerciale a cui QOOBIX deve rispondere.',
      commercialObjective: 'Obiettivo commerciale',
      targetCustomerTypes: 'Tipologie di clienti target',
      targetChannels: 'Canali target',
      knownCompetitors: 'Concorrenti conosciuti',
      knownPartners: 'Partner, distributori o rappresentanti conosciuti',
      preferredOutputLanguage: 'Lingua preferita per l’output',
      outputNotice:
        'QOOBIX genererà i file previsti per questo ambiente. I formati attuali sono DOCX, XLSX, RTF e CSV. La modalità Discovery prepara la richiesta per individuare organizzazioni candidate, ma i candidati dovranno essere verificati in modo indipendente.',
      creatingNotice: 'Creazione della richiesta e preparazione della pagina del job…',
      genericCreateError: 'Non è stato possibile creare la richiesta di intelligence.',
      requestFailedError:
        'Non è stato possibile creare la richiesta di intelligence perché la richiesta non è riuscita.',
      creatingButton: 'Creazione richiesta…',
      submitButton: 'Crea richiesta di intelligence',
      objectives: {
        'Market-entry analysis': 'Analisi di ingresso nel mercato',
        'Distributor discovery': 'Discovery di distributori',
        'Partner discovery': 'Discovery di partner',
        'Competitor mapping': 'Mappatura dei concorrenti',
        'Regional opportunity assessment': 'Valutazione delle opportunità regionali',
        'Lead/prospect discovery': 'Discovery di prospect',
        'Positioning analysis': 'Analisi del posizionamento',
        'Pricing/channel analysis': 'Analisi prezzi/canali',
        'Action-priority report': 'Report sulle priorità operative'
      }
    }
  }
};

export function getClientLocale(clientOrLanguage: ClientConfiguration | string | null | undefined): ClientLocale {
  const language =
    typeof clientOrLanguage === 'string'
      ? clientOrLanguage
      : clientOrLanguage?.preferredLanguage ?? '';

  const normalised = language.trim().toLowerCase();

  if (
    normalised === 'es' ||
    normalised.includes('spanish') ||
    normalised.includes('español') ||
    normalised.includes('espanol') ||
    normalised.includes('spain')
  ) {
    return 'es';
  }

  if (
    normalised === 'it' ||
    normalised.includes('italian') ||
    normalised.includes('italiano') ||
    normalised.includes('italy') ||
    normalised.includes('italia')
  ) {
    return 'it';
  }

  return 'en';
}

export function getClientDictionary(clientOrLanguage: ClientConfiguration | string | null | undefined) {
  return dictionaries[getClientLocale(clientOrLanguage)];
}
