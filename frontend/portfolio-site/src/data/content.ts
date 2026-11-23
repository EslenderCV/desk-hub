export type Language = 'en' | 'es';

export interface DisciplineItem {
  number: string;
  title: string;
  lines: [string, string];
}

export interface SystemNode {
  indexLabel: string;
  title: string;
  subtitle: string;
}

export interface ProjectConfig {
  id: 'yourgarage' | 'forma' | 'devflow';
  kicker: string;
  title: string;
  accentColor: string;
  externalIcon: string;
  headline: string;
  subline: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  systemPills: string[];
  buildLabel: string;
  systemNodes: [SystemNode, SystemNode, SystemNode];
  systemSummary: string;
}

export interface SocialLink {
  id: 'github' | 'linkedin';
  label: string;
  href: string;
}

export interface SiteContent {
  meta: {
    title: string;
  };
  languageToggle: {
    ariaLabel: string;
    enLabel: string;
    esLabel: string;
  };
  hero: {
    roleLocation: string;
    availability: string;
    name: string;
    portraitAlt: string;
    sigLeftLine1: string;
    sigLeftLine2: string;
    sigCenterLine1: string;
    sigCenterLine2: string;
    scrollCue: string;
  };
  approach: {
    sectionLabel: string;
    headingLines: [string, string, string];
    bio: string;
    disciplines: DisciplineItem[];
  };
  activity: {
    heading: string;
    runnerStatus: string;
    piDeployedLabel: string;
    deployingLabel: string;
    verifiedCommitLabel: string;
    profileUrlLabel: string;
    profileUrl: string;
  };
  work: {
    sectionLabel: string;
    sectionMeta: string;
    headline: string;
    liveTabLabel: string;
    systemTabLabel: string;
    desktopLabel: string;
    mobileLabel: string;
    openLiveLabel: string;
    systemOverviewLabel: string;
    systemSubtitle: string;
    httpsLabel: string;
    queryLabel: string;
    projects: ProjectConfig[];
  };
  contact: {
    sectionLabel: string;
    introLine1: string;
    introLine2: string;
    ctaText: string;
    email: string;
    copiedLabel: string;
    locationLine1: string;
    locationLine2: string;
    socials: SocialLink[];
    domainText: string;
    copyright: string;
  };
}

export const content: Record<Language, SiteContent> = {
  en: {
    meta: {
      title: 'ESLENDER — Developer Portfolio',
    },
    languageToggle: {
      ariaLabel: 'Switch language',
      enLabel: 'EN',
      esLabel: 'ES',
    },
    hero: {
      roleLocation: 'FULL STACK DEVELOPER · SANTIAGO, DR',
      availability: 'AVAILABLE FOR WORK',
      name: 'ESLENDER',
      portraitAlt: 'Monochrome close-up portrait of Eslender Cruz',
      sigLeftLine1: 'ROBUST SYSTEMS.',
      sigLeftLine2: 'HUMAN EXPERIENCES.',
      sigCenterLine1: 'FROM FIRST COMMIT',
      sigCenterLine2: 'TO WHAT’S NEXT.',
      scrollCue: 'SCROLL TO EXPLORE',
    },
    approach: {
      sectionLabel: '01 / APPROACH',
      headingLines: ['Complex problems.', 'Clear, dependable', 'software.'],
      bio: 'I’m Eslender, a full-stack developer building enterprise web apps, REST APIs, and responsive interfaces. From C# and .NET to React and TypeScript, I connect thoughtful frontends with systems built to last.',
      disciplines: [
        {
          number: '01',
          title: 'FRONTEND',
          lines: ['TypeScript, JS, React,', 'React Native, Vite'],
        },
        {
          number: '02',
          title: 'BACKEND',
          lines: ['C#, .NET, ASP.NET, Node.js,', 'Java, REST APIs'],
        },
        {
          number: '03',
          title: 'DATA & TOOLS',
          lines: ['SQL Server, MySQL, MongoDB,', 'Git, CI/CD, Figma'],
        },
      ],
    },
    activity: {
      heading: 'LIVE ACTIVITY // GITHUB & RASPBERRY PI CI',
      runnerStatus: 'RUNNER ONLINE · ARM64',
      piDeployedLabel: 'PI DEPLOYED',
      deployingLabel: 'PI DEPLOYING',
      verifiedCommitLabel: 'MAIN',
      profileUrlLabel: 'VIEW ALL ON GITHUB',
      profileUrl: 'https://github.com/EslenderCV',
    },
    work: {
      sectionLabel: '02 / SELECTED WORK',
      sectionMeta: 'THREE BUILDS. END TO END.',
      headline: 'BUILT TO WORK.',
      liveTabLabel: 'LIVE APP',
      systemTabLabel: 'SYSTEM & STACK',
      desktopLabel: 'Desktop',
      mobileLabel: 'Mobile',
      openLiveLabel: 'OPEN LIVE',
      systemOverviewLabel: 'SYSTEM OVERVIEW',
      systemSubtitle: 'SEPARATION OF CONCERNS / END TO END',
      httpsLabel: 'HTTPS / JSON',
      queryLabel: 'QUERY',
      projects: [
        {
          id: 'yourgarage',
          kicker: '01 / VEHICLE TELEMETRY & MOBILE APP',
          title: 'yourGarage',
          accentColor: '#FF5500',
          externalIcon: '/assets/figma/external-link-orange.svg',
          headline: 'Your car’s health, automatically tracked.',
          subline:
            'Offline-first vehicle maintenance and expense tracker with ESP32 BLE OBD-II hardware telemetry and SQLite persistence.',
          liveUrl: 'https://yourgarage.eslender.dev',
          githubUrl: 'https://github.com/EslenderCV/yourGarage',
          tags: ['REACT NATIVE / EXPO', 'TYPESCRIPT / BLE', 'SQLITE / ESP32'],
          systemPills: ['REACT NATIVE / EXPO', 'TYPESCRIPT', 'EXPO SQLITE', 'ESP32 BLE OBD-II'],
          buildLabel: 'LIVE BUILD · YOURGARAGE.ESLENDER.DEV',
          systemNodes: [
            {
              indexLabel: '01 / CLIENT',
              title: 'React Native + Expo',
              subtitle: 'OFFLINE-FIRST MOBILE & WEB',
            },
            {
              indexLabel: '02 / TELEMETRY',
              title: 'ESP32 BLE OBD-II',
              subtitle: 'AES-128 / CAN BUS / VOLTAGE',
            },
            {
              indexLabel: '03 / DATABASE',
              title: 'Expo SQLite (WAL)',
              subtitle: 'LOCAL PERSISTENCE / REMINDERS',
            },
          ],
          systemSummary:
            'An offline-first mobile app paired with an ESP32 OBD-II BLE dongle and local SQLite persistence.',
        },
        {
          id: 'forma',
          kicker: '02 / BILLING PLATFORM',
          title: 'Forma',
          accentColor: '#3B82F6',
          externalIcon: '/assets/figma/external-link-blue.svg',
          headline: 'Every invoice. Every detail. Under control.',
          subline: 'A responsive billing workspace with a clean API at its core.',
          liveUrl: '/demos/forma.html',
          tags: ['REACT / VITE', 'NODE.JS / REST', 'MONGODB'],
          systemPills: ['REACT / VITE', 'NODE.JS / REST', 'MONGODB', 'GIT / CI/CD'],
          buildLabel: 'SELF-INITIATED / CONCEPT BUILD',
          systemNodes: [
            {
              indexLabel: '01 / CLIENT',
              title: 'React + Vite',
              subtitle: 'RESPONSIVE UI',
            },
            {
              indexLabel: '02 / API',
              title: 'Node.js REST API',
              subtitle: 'VALIDATION / AUTH / LOGIC',
            },
            {
              indexLabel: '03 / DATABASE',
              title: 'MongoDB',
              subtitle: 'PERSISTENCE / QUERIES',
            },
          ],
          systemSummary: 'A typed client. A focused API. A deliberate data model.',
        },
        {
          id: 'devflow',
          kicker: '03 / DEVELOPER WORKSPACE',
          title: 'Devflow',
          accentColor: '#A3E635',
          externalIcon: '/assets/figma/external-link-lime.svg',
          headline: 'Less overhead. More shipped.',
          subline: 'A focused project workspace connecting planning to delivery.',
          liveUrl: '/demos/devflow.html',
          tags: ['REACT / TYPESCRIPT', 'C# / .NET', 'MYSQL'],
          systemPills: ['REACT / TYPESCRIPT', 'C# / .NET', 'MYSQL', 'GIT / CI/CD'],
          buildLabel: 'SELF-INITIATED / CONCEPT BUILD',
          systemNodes: [
            {
              indexLabel: '01 / CLIENT',
              title: 'React + TypeScript',
              subtitle: 'RESPONSIVE UI',
            },
            {
              indexLabel: '02 / API',
              title: '.NET REST API',
              subtitle: 'VALIDATION / AUTH / LOGIC',
            },
            {
              indexLabel: '03 / DATABASE',
              title: 'MySQL',
              subtitle: 'PERSISTENCE / QUERIES',
            },
          ],
          systemSummary: 'A typed client. A focused API. A deliberate data model.',
        },
      ],
    },
    contact: {
      sectionLabel: '03 / HAVE SOMETHING IN MIND?',
      introLine1: 'LET’S TURN THE RIGHT IDEA',
      introLine2: 'INTO SOMETHING THAT WORKS.',
      ctaText: 'LET’S BUILD',
      email: 'me@eslender.dev',
      copiedLabel: 'Copied to clipboard',
      locationLine1: 'BASED IN SANTIAGO, DR',
      locationLine2: 'OPEN TO WHAT’S NEXT.',
      socials: [
        { id: 'github', label: 'GitHub', href: 'https://github.com/EslenderCV' },
        { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/eslender-cruz' },
      ],
      domainText: 'eslender.dev',
      copyright: '© ESLENDER',
    },
  },
  es: {
    meta: {
      title: 'ESLENDER — Portafolio de Desarrollador',
    },
    languageToggle: {
      ariaLabel: 'Cambiar idioma',
      enLabel: 'EN',
      esLabel: 'ES',
    },
    hero: {
      roleLocation: 'DESARROLLADOR FULL STACK · SANTIAGO, RD',
      availability: 'DISPONIBLE PARA TRABAJAR',
      name: 'ESLENDER',
      portraitAlt: 'Retrato monocromático de alto contraste de Eslender Cruz',
      sigLeftLine1: 'SISTEMAS ROBUSTOS.',
      sigLeftLine2: 'EXPERIENCIAS HUMANAS.',
      sigCenterLine1: 'DESDE EL PRIMER COMMIT',
      sigCenterLine2: 'HASTA LO QUE SIGUE.',
      scrollCue: 'DESLIZA PARA EXPLORAR',
    },
    approach: {
      sectionLabel: '01 / ENFOQUE',
      headingLines: ['Problemas complejos.', 'Software claro y', 'confiable.'],
      bio: 'Soy Eslender, desarrollador full-stack enfocado en aplicaciones web empresariales, APIs REST e interfaces responsivas. Desde C# y .NET hasta React y TypeScript, conecto frontends cuidados con sistemas diseñados para perdurar.',
      disciplines: [
        {
          number: '01',
          title: 'FRONTEND',
          lines: ['TypeScript, JS, React,', 'React Native, Vite'],
        },
        {
          number: '02',
          title: 'BACKEND',
          lines: ['C#, .NET, ASP.NET, Node.js,', 'Java, REST APIs'],
        },
        {
          number: '03',
          title: 'DATOS Y HERRAMIENTAS',
          lines: ['SQL Server, MySQL, MongoDB,', 'Git, CI/CD, Figma'],
        },
      ],
    },
    activity: {
      heading: 'ACTIVIDAD EN VIVO // GITHUB Y CI RASPBERRY PI',
      runnerStatus: 'RUNNER ACTIVO · ARM64',
      piDeployedLabel: 'DESPLEGADO EN PI',
      deployingLabel: 'DESPLEGANDO EN PI',
      verifiedCommitLabel: 'MAIN',
      profileUrlLabel: 'VER TODO EN GITHUB',
      profileUrl: 'https://github.com/EslenderCV',
    },
    work: {
      sectionLabel: '02 / OBRA SELECCIONADA',
      sectionMeta: 'TRES PROYECTOS. DE PRINCIPIO A FIN.',
      headline: 'HECHO PARA FUNCIONAR.',
      liveTabLabel: 'APP EN VIVO',
      systemTabLabel: 'SISTEMA Y STACK',
      desktopLabel: 'Escritorio',
      mobileLabel: 'Móvil',
      openLiveLabel: 'ABRIR EN VIVO',
      systemOverviewLabel: 'RESUMEN DEL SISTEMA',
      systemSubtitle: 'SEPARACIÓN DE RESPONSABILIDADES / END TO END',
      httpsLabel: 'HTTPS / JSON',
      queryLabel: 'CONSULTA',
      projects: [
        {
          id: 'yourgarage',
          kicker: '01 / TELEMETRÍA VEHICULAR Y APP MÓVIL',
          title: 'yourGarage',
          accentColor: '#FF5500',
          externalIcon: '/assets/figma/external-link-orange.svg',
          headline: 'La salud de tu vehículo, monitoreada automáticamente.',
          subline:
            'App offline-first para mantenimiento y gastos vehiculares con telemetría OBD-II vía ESP32 BLE y persistencia SQLite.',
          liveUrl: 'https://yourgarage.eslender.dev',
          githubUrl: 'https://github.com/EslenderCV/yourGarage',
          tags: ['REACT NATIVE / EXPO', 'TYPESCRIPT / BLE', 'SQLITE / ESP32'],
          systemPills: ['REACT NATIVE / EXPO', 'TYPESCRIPT', 'EXPO SQLITE', 'ESP32 BLE OBD-II'],
          buildLabel: 'EN PRODUCCIÓN · YOURGARAGE.ESLENDER.DEV',
          systemNodes: [
            {
              indexLabel: '01 / CLIENTE',
              title: 'React Native + Expo',
              subtitle: 'APP MÓVIL Y WEB OFFLINE-FIRST',
            },
            {
              indexLabel: '02 / TELEMETRÍA',
              title: 'ESP32 BLE OBD-II',
              subtitle: 'AES-128 / CAN BUS / VOLTAJE',
            },
            {
              indexLabel: '03 / BASE DE DATOS',
              title: 'Expo SQLite (WAL)',
              subtitle: 'PERSISTENCIA LOCAL / ALERTAS',
            },
          ],
          systemSummary:
            'Una app móvil offline-first conectada a un dongle ESP32 OBD-II BLE con persistencia local en SQLite.',
        },
        {
          id: 'forma',
          kicker: '02 / PLATAFORMA DE FACTURACIÓN',
          title: 'Forma',
          accentColor: '#3B82F6',
          externalIcon: '/assets/figma/external-link-blue.svg',
          headline: 'Cada factura. Cada detalle. Bajo control.',
          subline: 'Un espacio de facturación responsivo con una API limpia en su núcleo.',
          liveUrl: '/demos/forma.html',
          tags: ['REACT / VITE', 'NODE.JS / REST', 'MONGODB'],
          systemPills: ['REACT / VITE', 'NODE.JS / REST', 'MONGODB', 'GIT / CI/CD'],
          buildLabel: 'INICIATIVA PROPIA / CONCEPTO',
          systemNodes: [
            {
              indexLabel: '01 / CLIENTE',
              title: 'React + Vite',
              subtitle: 'UI RESPONSIVA',
            },
            {
              indexLabel: '02 / API',
              title: 'Node.js REST API',
              subtitle: 'VALIDACIÓN / AUTH / LÓGICA',
            },
            {
              indexLabel: '03 / BASE DE DATOS',
              title: 'MongoDB',
              subtitle: 'PERSISTENCIA / CONSULTAS',
            },
          ],
          systemSummary: 'Un cliente tipado. Una API enfocada. Un modelo de datos deliberado.',
        },
        {
          id: 'devflow',
          kicker: '03 / ESPACIO PARA DESARROLLADORES',
          title: 'Devflow',
          accentColor: '#A3E635',
          externalIcon: '/assets/figma/external-link-lime.svg',
          headline: 'Menos fricción. Más entregas.',
          subline: 'Un espacio de trabajo enfocado que conecta la planificación con la entrega.',
          liveUrl: '/demos/devflow.html',
          tags: ['REACT / TYPESCRIPT', 'C# / .NET', 'MYSQL'],
          systemPills: ['REACT / TYPESCRIPT', 'C# / .NET', 'MYSQL', 'GIT / CI/CD'],
          buildLabel: 'INICIATIVA PROPIA / CONCEPTO',
          systemNodes: [
            {
              indexLabel: '01 / CLIENTE',
              title: 'React + TypeScript',
              subtitle: 'UI RESPONSIVA',
            },
            {
              indexLabel: '02 / API',
              title: '.NET REST API',
              subtitle: 'VALIDACIÓN / AUTH / LÓGICA',
            },
            {
              indexLabel: '03 / BASE DE DATOS',
              title: 'MySQL',
              subtitle: 'PERSISTENCIA / CONSULTAS',
            },
          ],
          systemSummary: 'Un cliente tipado. Una API enfocada. Un modelo de datos deliberado.',
        },
      ],
    },
    contact: {
      sectionLabel: '03 / ¿TIENES ALGO EN MENTE?',
      introLine1: 'CONVIRTAMOS LA IDEA CORRECTA',
      introLine2: 'EN ALGO QUE FUNCIONE.',
      ctaText: 'CONSTRUYAMOS',
      email: 'me@eslender.dev',
      copiedLabel: 'Copiado al portapapeles',
      locationLine1: 'DESDE SANTIAGO, RD',
      locationLine2: 'ABIERTO A LO QUE SIGUE.',
      socials: [
        { id: 'github', label: 'GitHub', href: 'https://github.com/EslenderCV' },
        { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/eslender-cruz' },
      ],
      domainText: 'eslender.dev',
      copyright: '© ESLENDER',
    },
  },
};
