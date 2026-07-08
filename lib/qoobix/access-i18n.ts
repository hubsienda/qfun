export type AccessLocale = 'en' | 'es' | 'it';

export type AccessDictionary = {
  language: {
    english: string;
    spanish: string;
    italian: string;
  };
  accessPage: {
    metadataTitle: string;
    badge: string;
    title: string;
    intro: string;
    authorisedTitle: string;
    authorisedText: string;
    clientsTitle: string;
    clientsText: string;
    requestTitle: string;
    requestText: string;
    requestButton: string;
    loginButton: string;
    loginTitle: string;
  };
  accessForm: {
    accessCode: string;
    rejected: string;
    failed: string;
    checking: string;
    enter: string;
  };
  recoveryPanel: {
    title: string;
    text: string;
    button: string;
    fallback: string;
  };
  recoveryPage: {
    metadataTitle: string;
    badge: string;
    title: string;
    intro: string;
    back: string;
  };
  recoveryForm: {
    clientSlug: string;
    recoveryPhrase: string;
    failed: string;
    requestFailed: string;
    success: string;
    generatedTitle: string;
    generatedText: string;
    generating: string;
    submit: string;
  };
};

const dictionaries: Record<AccessLocale, AccessDictionary> = {
  en: {
    language: {
      english: 'English',
      spanish: 'Español',
      italian: 'Italiano'
    },
    accessPage: {
      metadataTitle: 'Secure Access',
      badge: 'Secure access',
      title: 'Secure Access',
      intro:
        'Access to QOOBIX IDAAS is reserved for authorised users, Sienda Ltd administrators and qualified partner workspaces approved by Sienda Ltd. QOOBIX IDAAS is not a public self-service platform. Businesses do not need platform access in order to receive an intelligence package.',
      authorisedTitle: 'Authorised access only',
      authorisedText:
        'QOOBIX IDAAS access is restricted to authorised users. The access area is used to prepare, manage, review and deliver intelligence jobs.',
      clientsTitle: 'Clients receive the intelligence package',
      clientsText:
        'Ordinary clients do not need to operate the platform. The client provides the business context and market question; the operator prepares the job, runs the intelligence process, reviews the output and delivers the intelligence package.',
      requestTitle: 'Request an intelligence review',
      requestText:
        'If you are a business exploring a market, competitor landscape, distributor channel, partner search, expansion area or commercial opportunity, use the request route instead of trying to access the platform.',
      requestButton: 'Request an intelligence review',
      loginButton: 'Authorised login',
      loginTitle: 'Authorised login'
    },
    accessForm: {
      accessCode: 'Access code',
      rejected: 'Access rejected.',
      failed: 'Something failed while checking the access code.',
      checking: 'Checking…',
      enter: 'Enter'
    },
    recoveryPanel: {
      title: 'Forgot your access code?',
      text:
        'If you created a recovery phrase, you can reset the access code yourself. This route is for authorised users only.',
      button: 'Reset with recovery phrase',
      fallback:
        'If you have also lost the recovery phrase, contact QOOBIX support. We will verify the request manually and issue a temporary reset code.'
    },
    recoveryPage: {
      metadataTitle: 'Recover Access',
      badge: 'Access recovery',
      title: 'Generate a new authorised access code.',
      intro:
        'Enter the private access details supplied for your authorised QOOBIX IDAAS environment. If they match, Proteus will generate a new access code and disable the old one.',
      back: 'Back to secure access'
    },
    recoveryForm: {
      clientSlug: 'Access name',
      recoveryPhrase: 'Recovery phrase',
      failed: 'Access recovery failed.',
      requestFailed: 'Access recovery failed because the request could not be completed.',
      success: 'Proteus generated a new access code. Copy it now, then use it to enter.',
      generatedTitle: 'New Proteus-generated access code',
      generatedText: 'Copy this now. QOOBIX will not show it again.',
      generating: 'Generating…',
      submit: 'Generate new access code'
    }
  },

  es: {
    language: {
      english: 'English',
      spanish: 'Español',
      italian: 'Italiano'
    },
    accessPage: {
      metadataTitle: 'Acceso seguro',
      badge: 'Acceso seguro',
      title: 'Acceso seguro',
      intro:
        'El acceso a QOOBIX IDAAS está reservado a usuarios autorizados, administradores de Sienda Ltd y espacios de trabajo de partners cualificados aprobados por Sienda Ltd. QOOBIX IDAAS no es una plataforma pública de autoservicio. Las empresas no necesitan acceso a la plataforma para recibir un paquete de inteligencia.',
      authorisedTitle: 'Solo acceso autorizado',
      authorisedText:
        'El acceso a QOOBIX IDAAS está restringido a usuarios autorizados. El área de acceso se utiliza para preparar, gestionar, revisar y entregar trabajos de inteligencia.',
      clientsTitle: 'Los clientes reciben el paquete de inteligencia',
      clientsText:
        'Los clientes ordinarios no necesitan operar la plataforma. El cliente proporciona el contexto empresarial y la pregunta de mercado; el operador prepara el trabajo, ejecuta el proceso de inteligencia, revisa el resultado y entrega el paquete de inteligencia.',
      requestTitle: 'Solicitar una revisión de inteligencia',
      requestText:
        'Si su empresa está explorando un mercado, paisaje competitivo, canal de distribución, búsqueda de partners, zona de expansión u oportunidad comercial, utilice la ruta de solicitud en lugar de intentar acceder a la plataforma.',
      requestButton: 'Solicitar una revisión de inteligencia',
      loginButton: 'Acceso autorizado',
      loginTitle: 'Acceso autorizado'
    },
    accessForm: {
      accessCode: 'Código de acceso',
      rejected: 'Acceso rechazado.',
      failed: 'Algo ha fallado al comprobar el código de acceso.',
      checking: 'Comprobando…',
      enter: 'Entrar'
    },
    recoveryPanel: {
      title: '¿Ha olvidado su código de acceso?',
      text:
        'Si creó una frase de recuperación, puede restablecer el código de acceso. Esta ruta es solo para usuarios autorizados.',
      button: 'Restablecer con frase de recuperación',
      fallback:
        'Si también ha perdido la frase de recuperación, contacte con soporte QOOBIX. Verificaremos la solicitud manualmente y emitiremos un código temporal de restablecimiento.'
    },
    recoveryPage: {
      metadataTitle: 'Recuperar acceso',
      badge: 'Recuperación de acceso',
      title: 'Generar un nuevo código de acceso autorizado.',
      intro:
        'Introduzca los datos privados de acceso suministrados para su entorno autorizado QOOBIX IDAAS. Si coinciden, Proteus generará un nuevo código de acceso y desactivará el anterior.',
      back: 'Volver al acceso seguro'
    },
    recoveryForm: {
      clientSlug: 'Nombre de acceso',
      recoveryPhrase: 'Frase de recuperación',
      failed: 'La recuperación de acceso ha fallado.',
      requestFailed: 'La recuperación de acceso ha fallado porque la petición no se ha completado.',
      success: 'Proteus ha generado un nuevo código de acceso. Cópielo ahora y úselo para entrar.',
      generatedTitle: 'Nuevo código de acceso generado por Proteus',
      generatedText: 'Cópielo ahora. QOOBIX no volverá a mostrarlo.',
      generating: 'Generando…',
      submit: 'Generar nuevo código de acceso'
    }
  },

  it: {
    language: {
      english: 'English',
      spanish: 'Español',
      italian: 'Italiano'
    },
    accessPage: {
      metadataTitle: 'Accesso sicuro',
      badge: 'Accesso sicuro',
      title: 'Accesso sicuro',
      intro:
        'L’accesso a QOOBIX IDAAS è riservato a utenti autorizzati, amministratori di Sienda Ltd e workspace di partner qualificati approvati da Sienda Ltd. QOOBIX IDAAS non è una piattaforma pubblica self-service. Le aziende non hanno bisogno di accedere alla piattaforma per ricevere un pacchetto di intelligence.',
      authorisedTitle: 'Solo accesso autorizzato',
      authorisedText:
        'L’accesso a QOOBIX IDAAS è limitato agli utenti autorizzati. L’area di accesso viene utilizzata per preparare, gestire, revisionare e consegnare lavori di intelligence.',
      clientsTitle: 'I clienti ricevono il pacchetto di intelligence',
      clientsText:
        'I clienti ordinari non devono usare direttamente la piattaforma. Il cliente fornisce il contesto aziendale e la domanda di mercato; l’operatore prepara il lavoro, esegue il processo di intelligence, revisiona l’output e consegna il pacchetto di intelligence.',
      requestTitle: 'Richiedi una revisione di intelligence',
      requestText:
        'Se la tua azienda sta valutando un mercato, un panorama competitivo, un canale distributivo, una ricerca di partner, una zona di espansione o un’opportunità commerciale, usa il percorso di richiesta invece di provare ad accedere alla piattaforma.',
      requestButton: 'Richiedi una revisione di intelligence',
      loginButton: 'Accesso autorizzato',
      loginTitle: 'Accesso autorizzato'
    },
    accessForm: {
      accessCode: 'Codice di accesso',
      rejected: 'Accesso rifiutato.',
      failed: 'Qualcosa è andato storto durante la verifica del codice di accesso.',
      checking: 'Verifica…',
      enter: 'Entra'
    },
    recoveryPanel: {
      title: 'Hai dimenticato il codice di accesso?',
      text:
        'Se hai creato una frase di recupero, puoi reimpostare il codice di accesso. Questo percorso è solo per utenti autorizzati.',
      button: 'Reimposta con frase di recupero',
      fallback:
        'Se hai perso anche la frase di recupero, contatta il supporto QOOBIX. Verificheremo la richiesta manualmente ed emetteremo un codice temporaneo di reset.'
    },
    recoveryPage: {
      metadataTitle: 'Recupera accesso',
      badge: 'Recupero accesso',
      title: 'Genera un nuovo codice di accesso autorizzato.',
      intro:
        'Inserisci i dati di accesso privati forniti per il tuo ambiente autorizzato QOOBIX IDAAS. Se corrispondono, Proteus genererà un nuovo codice di accesso e disattiverà quello precedente.',
      back: 'Torna all’accesso sicuro'
    },
    recoveryForm: {
      clientSlug: 'Nome di accesso',
      recoveryPhrase: 'Frase di recupero',
      failed: 'Recupero accesso non riuscito.',
      requestFailed: 'Recupero accesso non riuscito perché la richiesta non è stata completata.',
      success: 'Proteus ha generato un nuovo codice di accesso. Copialo ora, poi usalo per entrare.',
      generatedTitle: 'Nuovo codice di accesso generato da Proteus',
      generatedText: 'Copialo ora. QOOBIX non lo mostrerà di nuovo.',
      generating: 'Generazione…',
      submit: 'Genera nuovo codice di accesso'
    }
  }
};

export function getAccessLocale(value: string | string[] | undefined): AccessLocale {
  const raw = Array.isArray(value) ? value[0] : value;
  const normalised = (raw ?? '').trim().toLowerCase();

  if (normalised === 'es') return 'es';
  if (normalised === 'it') return 'it';

  return 'en';
}

export function getAccessDictionary(value: string | string[] | undefined) {
  return dictionaries[getAccessLocale(value)];
}
