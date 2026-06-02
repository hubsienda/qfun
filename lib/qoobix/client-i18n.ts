import type { ClientConfiguration } from '@/lib/qoobix/types';

export type ClientLocale = 'en' | 'es' | 'it';

export type ClientDictionary = {
  common: {
    backToClientArea: string;
    logout: string;
    open: string;
    view: string;
    notConfigured: string;
    unlimited: string;
  };
  clientArea: {
    metadataTitle: string;
    privateClientArea: string;
    intro: string;
    profile: string;
    ready: string;
    incomplete: string;
    readyOutputs: string;
    activeJobs: string;

    licenceAndUsage: string;
    internalAccount: string;
    internalDescription: string;
    normalLicenceDescription: string;
    licenceActive: string;
    licenceInactive: string;
    plan: string;
    internal: string;
    analysis: string;
    analysisDiscovery: string;
    limitsNotEnforced: string;
    currentCommercialVersion: string;
    licencePeriod: string;
    jobsCountedInsidePeriod: string;
    fileRetention: string;
    fileRetentionHelper: string;
    totalJobs: string;
    totalJobsHelper: string;
    analysisJobs: string;
    discoveryJobs: string;
    countriesPerDiscovery: string;
    candidatesPerDiscovery: string;
    extrasNotice: string;

    commandCentre: string;
    whatDoYouWant: string;
    completeProfileBeforeFirstRequest: string;
    actionIntelligence: string;
    actionNewRequest: string;
    actionNewRequestDescription: string;
    actionConfiguration: string;
    actionBusinessProfile: string;
    actionBusinessProfileDescription: string;
    actionGuidance: string;
    actionHelpCentre: string;
    actionHelpCentreDescription: string;

    businessProfileRequired: string;
    businessProfileRequiredText: string;
    completeBusinessProfile: string;
    businessProfile: string;
    sector: string;
    website: string;
    productsServices: string;
    targetCountries: string;
    targetCustomerTypes: string;
    targetChannels: string;

    previousJobs: string;
    created: string;
    question: string;
    status: string;
    marketIntelligenceRequest: string;
    noJobsYet: string;

    recoveryTitle: string;
    recoveryText: string;
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
      logout: 'Log out',
      open: 'Open',
      view: 'View',
      notConfigured: 'Not configured',
      unlimited: 'unlimited'
    },
    clientArea: {
      metadataTitle: 'Client',
      privateClientArea: 'Private client area',
      intro:
        'Manage the business profile, create intelligence requests, review previous jobs, and download generated outputs.',
      profile: 'Profile',
      ready: 'Ready',
      incomplete: 'Incomplete',
      readyOutputs: 'Ready outputs',
      activeJobs: 'Active jobs',

      licenceAndUsage: 'Licence and usage',
      internalAccount: 'Internal QOOBIX account',
      internalDescription:
        'This account is marked as internal. Usage limits are visible for monitoring, but they are not enforced.',
      normalLicenceDescription:
        'This summary shows the current licence period and the annual usage allowance for this QOOBIX environment.',
      licenceActive: 'Licence active',
      licenceInactive: 'Licence inactive',
      plan: 'Plan',
      internal: 'Internal',
      analysis: 'Analysis',
      analysisDiscovery: 'Analysis + Discovery',
      limitsNotEnforced: 'Limits not enforced',
      currentCommercialVersion: 'Current commercial version',
      licencePeriod: 'Licence period',
      jobsCountedInsidePeriod: 'Jobs are counted inside this period',
      fileRetention: 'File retention',
      fileRetentionHelper: 'Generated files must be downloaded and kept by the client',
      totalJobs: 'Total jobs',
      totalJobsHelper: 'Analysis and Discovery combined',
      analysisJobs: 'Analysis jobs',
      discoveryJobs: 'Discovery jobs',
      countriesPerDiscovery: 'Countries per Discovery',
      candidatesPerDiscovery: 'Candidates per Discovery',
      extrasNotice:
        'Extra Analysis jobs, Discovery jobs, Discovery countries, and candidate packs are added by Sienda after quotation, invoice, and bank transfer.',

      commandCentre: 'Command centre',
      whatDoYouWant: 'What do you want to do?',
      completeProfileBeforeFirstRequest:
        'Complete the business profile before creating the first intelligence request.',
      actionIntelligence: 'Intelligence',
      actionNewRequest: 'New request',
      actionNewRequestDescription:
        'Create a structured market-intelligence job and generate downloadable outputs.',
      actionConfiguration: 'Configuration',
      actionBusinessProfile: 'Business profile',
      actionBusinessProfileDescription:
        'Review or update sector, products, markets, channels, competitors, and language.',
      actionGuidance: 'Guidance',
      actionHelpCentre: 'Help centre',
      actionHelpCentreDescription: 'Read the user guide, request examples, and private case studies.',

      businessProfileRequired: 'Business profile required',
      businessProfileRequiredText:
        'Before QOOBIX can generate useful intelligence, the client must complete the business profile: sector, products/services, target countries, target channels, and known market context.',
      completeBusinessProfile: 'Complete business profile',
      businessProfile: 'Business profile',
      sector: 'Sector',
      website: 'Website',
      productsServices: 'Products/services',
      targetCountries: 'Target countries',
      targetCustomerTypes: 'Target customer types',
      targetChannels: 'Target channels',

      previousJobs: 'Previous jobs',
      created: 'Created',
      question: 'Question',
      status: 'Status',
      marketIntelligenceRequest: 'Market intelligence request',
      noJobsYet: 'No jobs yet. Complete the business profile, then create the first request.',

      recoveryTitle: 'Recovery phrase and access code',
      recoveryText:
        'Set a recovery phrase and let Proteus generate a private access code. The generated code is shown once. QOOBIX stores only hashes, not readable access codes or recovery phrases.'
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
      logout: 'Cerrar sesión',
      open: 'Abrir',
      view: 'Ver',
      notConfigured: 'No configurado',
      unlimited: 'sin límite'
    },
    clientArea: {
      metadataTitle: 'Cliente',
      privateClientArea: 'Área privada de cliente',
      intro:
        'Gestione el perfil empresarial, cree solicitudes de inteligencia, revise trabajos anteriores y descargue los resultados generados.',
      profile: 'Perfil',
      ready: 'Listo',
      incomplete: 'Incompleto',
      readyOutputs: 'Resultados listos',
      activeJobs: 'Trabajos activos',

      licenceAndUsage: 'Licencia y uso',
      internalAccount: 'Cuenta interna QOOBIX',
      internalDescription:
        'Esta cuenta está marcada como interna. Los límites de uso son visibles para seguimiento, pero no se aplican.',
      normalLicenceDescription:
        'Este resumen muestra el periodo de licencia actual y el uso anual permitido para este entorno QOOBIX.',
      licenceActive: 'Licencia activa',
      licenceInactive: 'Licencia inactiva',
      plan: 'Plan',
      internal: 'Interno',
      analysis: 'Análisis',
      analysisDiscovery: 'Análisis + Descubrimiento',
      limitsNotEnforced: 'Límites no aplicados',
      currentCommercialVersion: 'Versión comercial actual',
      licencePeriod: 'Periodo de licencia',
      jobsCountedInsidePeriod: 'Los trabajos se cuentan dentro de este periodo',
      fileRetention: 'Retención de archivos',
      fileRetentionHelper: 'El cliente debe descargar y conservar los archivos generados',
      totalJobs: 'Trabajos totales',
      totalJobsHelper: 'Análisis y Descubrimiento combinados',
      analysisJobs: 'Trabajos de Análisis',
      discoveryJobs: 'Trabajos de Descubrimiento',
      countriesPerDiscovery: 'Países por Descubrimiento',
      candidatesPerDiscovery: 'Candidatos por Descubrimiento',
      extrasNotice:
        'Los trabajos extra de Análisis, trabajos extra de Descubrimiento, países extra de Descubrimiento y paquetes de candidatos son añadidos por Sienda tras presupuesto, factura y transferencia bancaria.',

      commandCentre: 'Centro de control',
      whatDoYouWant: '¿Qué desea hacer?',
      completeProfileBeforeFirstRequest:
        'Complete el perfil empresarial antes de crear la primera solicitud de inteligencia.',
      actionIntelligence: 'Inteligencia',
      actionNewRequest: 'Nueva solicitud',
      actionNewRequestDescription:
        'Cree un trabajo estructurado de inteligencia de mercado y genere resultados descargables.',
      actionConfiguration: 'Configuración',
      actionBusinessProfile: 'Perfil empresarial',
      actionBusinessProfileDescription:
        'Revise o actualice sector, productos, mercados, canales, competidores e idioma.',
      actionGuidance: 'Guía',
      actionHelpCentre: 'Centro de ayuda',
      actionHelpCentreDescription:
        'Consulte la guía de usuario, ejemplos de solicitudes y casos privados.',

      businessProfileRequired: 'Perfil empresarial requerido',
      businessProfileRequiredText:
        'Antes de que QOOBIX pueda generar inteligencia útil, el cliente debe completar el perfil empresarial: sector, productos/servicios, países objetivo, canales objetivo y contexto de mercado conocido.',
      completeBusinessProfile: 'Completar perfil empresarial',
      businessProfile: 'Perfil empresarial',
      sector: 'Sector',
      website: 'Sitio web',
      productsServices: 'Productos/servicios',
      targetCountries: 'Países objetivo',
      targetCustomerTypes: 'Tipos de clientes objetivo',
      targetChannels: 'Canales objetivo',

      previousJobs: 'Trabajos anteriores',
      created: 'Creado',
      question: 'Pregunta',
      status: 'Estado',
      marketIntelligenceRequest: 'Solicitud de inteligencia de mercado',
      noJobsYet: 'Aún no hay trabajos. Complete el perfil empresarial y cree la primera solicitud.',

      recoveryTitle: 'Frase de recuperación y código de acceso',
      recoveryText:
        'Defina una frase de recuperación y permita que Proteus genere un código de acceso privado. El código generado se muestra una sola vez. QOOBIX solo guarda hashes, no códigos de acceso ni frases de recuperación legibles.'
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
      logout: 'Esci',
      open: 'Apri',
      view: 'Vedi',
      notConfigured: 'Non configurato',
      unlimited: 'illimitato'
    },
    clientArea: {
      metadataTitle: 'Cliente',
      privateClientArea: 'Area privata cliente',
      intro:
        'Gestisci il profilo aziendale, crea richieste di intelligence, controlla i job precedenti e scarica gli output generati.',
      profile: 'Profilo',
      ready: 'Pronto',
      incomplete: 'Incompleto',
      readyOutputs: 'Output pronti',
      activeJobs: 'Job attivi',

      licenceAndUsage: 'Licenza e utilizzo',
      internalAccount: 'Account QOOBIX interno',
      internalDescription:
        'Questo account è segnato come interno. I limiti di utilizzo sono visibili per monitoraggio, ma non vengono applicati.',
      normalLicenceDescription:
        'Questo riepilogo mostra il periodo di licenza attuale e l’utilizzo annuale consentito per questo ambiente QOOBIX.',
      licenceActive: 'Licenza attiva',
      licenceInactive: 'Licenza inattiva',
      plan: 'Piano',
      internal: 'Interno',
      analysis: 'Analisi',
      analysisDiscovery: 'Analisi + Discovery',
      limitsNotEnforced: 'Limiti non applicati',
      currentCommercialVersion: 'Versione commerciale attuale',
      licencePeriod: 'Periodo di licenza',
      jobsCountedInsidePeriod: 'I job vengono conteggiati in questo periodo',
      fileRetention: 'Conservazione file',
      fileRetentionHelper: 'I file generati devono essere scaricati e conservati dal cliente',
      totalJobs: 'Job totali',
      totalJobsHelper: 'Analisi e Discovery combinati',
      analysisJobs: 'Job di Analisi',
      discoveryJobs: 'Job di Discovery',
      countriesPerDiscovery: 'Paesi per Discovery',
      candidatesPerDiscovery: 'Candidati per Discovery',
      extrasNotice:
        'Job extra di Analisi, job extra di Discovery, Paesi extra di Discovery e pacchetti candidati vengono aggiunti da Sienda dopo preventivo, fattura e bonifico bancario.',

      commandCentre: 'Centro di controllo',
      whatDoYouWant: 'Cosa vuoi fare?',
      completeProfileBeforeFirstRequest:
        'Completa il profilo aziendale prima di creare la prima richiesta di intelligence.',
      actionIntelligence: 'Intelligence',
      actionNewRequest: 'Nuova richiesta',
      actionNewRequestDescription:
        'Crea un job strutturato di market intelligence e genera output scaricabili.',
      actionConfiguration: 'Configurazione',
      actionBusinessProfile: 'Profilo aziendale',
      actionBusinessProfileDescription:
        'Rivedi o aggiorna settore, prodotti, mercati, canali, concorrenti e lingua.',
      actionGuidance: 'Guida',
      actionHelpCentre: 'Centro assistenza',
      actionHelpCentreDescription:
        'Leggi la guida utente, gli esempi di richiesta e i casi studio privati.',

      businessProfileRequired: 'Profilo aziendale richiesto',
      businessProfileRequiredText:
        'Prima che QOOBIX possa generare intelligence utile, il cliente deve completare il profilo aziendale: settore, prodotti/servizi, Paesi target, canali target e contesto di mercato conosciuto.',
      completeBusinessProfile: 'Completa il profilo aziendale',
      businessProfile: 'Profilo aziendale',
      sector: 'Settore',
      website: 'Sito web',
      productsServices: 'Prodotti/servizi',
      targetCountries: 'Paesi target',
      targetCustomerTypes: 'Tipologie di clienti target',
      targetChannels: 'Canali target',

      previousJobs: 'Job precedenti',
      created: 'Creato',
      question: 'Domanda',
      status: 'Stato',
      marketIntelligenceRequest: 'Richiesta di market intelligence',
      noJobsYet: 'Non ci sono ancora job. Completa il profilo aziendale e crea la prima richiesta.',

      recoveryTitle: 'Frase di recupero e codice di accesso',
      recoveryText:
        'Imposta una frase di recupero e lascia che Proteus generi un codice di accesso privato. Il codice generato viene mostrato una sola volta. QOOBIX conserva solo hash, non codici di accesso o frasi di recupero leggibili.'
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

export function getClientLocale(
  clientOrLanguage: ClientConfiguration | string | null | undefined
): ClientLocale {
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
