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
      metadataTitle: 'Private Access',
      badge: 'Private access',
      title: 'Enter your QOOBIX access code.',
      intro:
        'This is a provisioned intelligence system. No account carnival. No password theatre. Insert the private code supplied for your configured environment.'
    },
    accessForm: {
      accessCode: 'Access code',
      rejected: 'Access rejected. Proteus remained unimpressed.',
      failed: 'Something failed while checking the access code.',
      checking: 'Checking…',
      enter: 'Enter'
    },
    recoveryPanel: {
      title: 'Forgot your access code?',
      text:
        'If you created a recovery phrase, you can reset the access code yourself. No traditional login, no email/password ritual, no Sunday panic.',
      button: 'Reset with recovery phrase',
      fallback:
        'If you have also lost the recovery phrase, contact QOOBIX support. We will verify the request manually and issue a temporary reset code.'
    },
    recoveryPage: {
      metadataTitle: 'Recover Access',
      badge: 'Access recovery',
      title: 'Let Proteus generate a new access code.',
      intro:
        'Enter the private access details supplied for your QOOBIX environment. If they match, Proteus will generate a new access code and disable the old one.',
      back: 'Back to private access'
    },
    recoveryForm: {
      clientSlug: 'Client access name',
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
      metadataTitle: 'Acceso privado',
      badge: 'Acceso privado',
      title: 'Introduzca su código de acceso QOOBIX.',
      intro:
        'Este es un sistema de inteligencia provisionado. Sin cuentas tradicionales. Sin teatro de contraseñas. Introduzca el código privado suministrado para su entorno configurado.'
    },
    accessForm: {
      accessCode: 'Código de acceso',
      rejected: 'Acceso rechazado. Proteus no se ha dejado impresionar.',
      failed: 'Algo ha fallado al comprobar el código de acceso.',
      checking: 'Comprobando…',
      enter: 'Entrar'
    },
    recoveryPanel: {
      title: '¿Ha olvidado su código de acceso?',
      text:
        'Si creó una frase de recuperación, puede restablecer el código de acceso usted mismo. Sin inicio de sesión tradicional, sin ritual de email y contraseña, sin pánico de domingo.',
      button: 'Restablecer con frase de recuperación',
      fallback:
        'Si también ha perdido la frase de recuperación, contacte con soporte QOOBIX. Verificaremos la solicitud manualmente y emitiremos un código temporal de restablecimiento.'
    },
    recoveryPage: {
      metadataTitle: 'Recuperar acceso',
      badge: 'Recuperación de acceso',
      title: 'Deje que Proteus genere un nuevo código de acceso.',
      intro:
        'Introduzca los datos privados de acceso suministrados para su entorno QOOBIX. Si coinciden, Proteus generará un nuevo código de acceso y desactivará el anterior.',
      back: 'Volver al acceso privado'
    },
    recoveryForm: {
      clientSlug: 'Nombre de acceso del cliente',
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
      metadataTitle: 'Accesso privato',
      badge: 'Accesso privato',
      title: 'Inserisci il tuo codice di accesso QOOBIX.',
      intro:
        'Questo è un sistema di intelligence provisionato. Niente account tradizionali. Niente teatro delle password. Inserisci il codice privato fornito per il tuo ambiente configurato.'
    },
    accessForm: {
      accessCode: 'Codice di accesso',
      rejected: 'Accesso rifiutato. Proteus non si è lasciato impressionare.',
      failed: 'Qualcosa è andato storto durante la verifica del codice di accesso.',
      checking: 'Verifica…',
      enter: 'Entra'
    },
    recoveryPanel: {
      title: 'Hai dimenticato il codice di accesso?',
      text:
        'Se hai creato una frase di recupero, puoi reimpostare il codice di accesso autonomamente. Niente login tradizionale, niente rito email/password, niente panico domenicale.',
      button: 'Reimposta con frase di recupero',
      fallback:
        'Se hai perso anche la frase di recupero, contatta il supporto QOOBIX. Verificheremo la richiesta manualmente ed emetteremo un codice temporaneo di reset.'
    },
    recoveryPage: {
      metadataTitle: 'Recupera accesso',
      badge: 'Recupero accesso',
      title: 'Lascia che Proteus generi un nuovo codice di accesso.',
      intro:
        'Inserisci i dati di accesso privati forniti per il tuo ambiente QOOBIX. Se corrispondono, Proteus genererà un nuovo codice di accesso e disattiverà quello precedente.',
      back: 'Torna all’accesso privato'
    },
    recoveryForm: {
      clientSlug: 'Nome di accesso cliente',
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
