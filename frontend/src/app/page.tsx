'use client';

import { useState } from 'react';

const contentData = {
  en: {
    title: 'Systems & Software Engineer',
    overviewTab: 'sys_overview',
    projectsTab: 'project_ledger',
    capabilitiesTab: 'core_capabilities',
    logsTab: 'system_logs',
    overviewHeader: 'System Execution Overview',
    overviewDesc: 'Engineering robust runtime instances, modular backend frameworks, and decoupled cloud systems architectures. Focused on high-efficiency data flows and precise system integration lines.',
    focusSectors: 'Focus Sectors',
    primaryRuntime: 'Primary Stack Runtime',
    envFocus: 'Environment Focus',
    projectHeader: 'Production Ledger & Architecture Case Studies',
    moodDesc: 'A cross-platform mobile application utilizing decoupled social state engines and highly responsive, real-time media pipeline distributions.',
    movieDesc: 'Decoupled backend engine featuring fully containerized service tasks running entirely serverless with isolated secure database parameters.',
    capabilitiesHeader: 'Verified Technical Stack Runtime',
    languagesLabel: 'Engine Languages',
    frameworksLabel: 'Frameworks & Systems',
    logsHeader: 'System Event Logs & Activity',
    logsDesc: 'Real-time telemetry tracking active development pipelines, system updates, and core deployment infrastructure statistics.'
  },
  es: {
    title: 'Ingeniero de Sistemas y Software',
    overviewTab: 'vista_general',
    projectsTab: 'registro_proyectos',
    capabilitiesTab: 'capacidades_nucleo',
    logsTab: 'logs_sistema',
    overviewHeader: 'Vista General de Ejecución del Sistema',
    overviewDesc: 'Ingeniería de instancias de ejecución robustas, frameworks de backend modulares y arquitecturas de sistemas desacoplados en la nube. Enfocado en flujos de datos de alta eficiencia y líneas de integración precisas.',
    focusSectors: 'Sectores de Enfoque',
    primaryRuntime: 'Runtime Principal',
    envFocus: 'Enfoque de Entorno',
    projectHeader: 'Registro de Producción y Casos de Estudio de Arquitectura',
    moodDesc: 'Una aplicación móvil multiplataforma que utiliza motores de estado social desacoplados y distribuciones de canales de medios en tiempo real altamente receptivas.',
    movieDesc: 'Motor de backend desacoplado que presenta tareas de servicio totalmente contenedorizadas que se ejecutan por completo sin servidor con parámetros de base de datos seguros y aislados.',
    capabilitiesHeader: 'Runtime de Stack Técnico Verificado',
    languagesLabel: 'Lenguajes de Motor',
    frameworksLabel: 'Frameworks y Sistemas',
    logsHeader: 'Logs de Eventos y Actividad del Sistema',
    logsDesc: 'Telemetría en tiempo real que rastrea pipelines de desarrollo activos, actualizaciones del sistema y estadísticas de infraestructura.'
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'capabilities' | 'logs'>('overview');
  const [lang, setLang] = useState<'en' | 'es'>('en');

  const t = contentData[lang];

  const toggleLanguage = () => {
    setLang((current) => (current === 'en' ? 'es' : 'en'));
  };

  return (
    <div className="console-frame">
      <div className="console-topbar">
        <div className="window-controls">
          <div className="control-dot" style={{ backgroundColor: '#ff5f56' }}></div>
          <div className="control-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
          <div className="control-dot" style={{ backgroundColor: '#27c93f' }}></div>
        </div>
        <div>eslender@systems-engine-v1.0</div>
        
        <button onClick={toggleLanguage} className="lang-btn">
          LOCALE: {lang.toUpperCase()} (TOGGLE)
        </button>
      </div>

      <div className="console-body">
        <aside className="console-sidebar">
          <div className="profile-block">
            <h1 className="profile-name">Eslender</h1>
            <div className="profile-role">{t.title}</div>
            
            <div className="social-container">
              <a 
                href="https://linkedin.com/in/YOUR_USERNAME" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8.37h2.8v-4.67c0-.25.015-.51.09-.69.2-.5.65-1 1.41-1 1 0 1.39.75 1.39 1.86v4.52h2.8M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/YOUR_USERNAME" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          <nav>
            <div className="nav-group">
              <div className="nav-label">Core Modules</div>
              <button onClick={() => setActiveTab('overview')} className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}>
                &gt;_ {t.overviewTab}
              </button>
              <button onClick={() => setActiveTab('projects')} className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}>
                &gt;_ {t.projectsTab}
              </button>
              <button onClick={() => setActiveTab('capabilities')} className={`nav-item ${activeTab === 'capabilities' ? 'active' : ''}`}>
                &gt;_ {t.capabilitiesTab}
              </button>
              <button onClick={() => setActiveTab('logs')} className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}>
                &gt;_ {t.logsTab}
              </button>
            </div>
          </nav>
        </aside>

        <main className="console-content">
          {activeTab === 'overview' && (
            <div className="content-section">
              <h2 className="section-title">{t.overviewHeader}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>{t.overviewDesc}</p>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-header">{t.focusSectors}</div>
                  <div className="metric-value">{lang === 'en' ? 'Full-Stack / Systems' : 'Full-Stack / Sistemas'}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-header">{t.primaryRuntime}</div>
                  <div className="metric-value">Node.js / Java</div>
                </div>
                <div className="metric-card">
                  <div className="metric-header">{t.envFocus}</div>
                  <div className="metric-value">{lang === 'en' ? 'Containerized / Cloud' : 'Contenedores / Nube'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="content-section">
              <h2 className="section-title">{t.projectHeader}</h2>
              <div className="ledger-stack">
                <div className="ledger-row">
                  <div>
                    <div className="ledger-title">MOOD Mobile Social Network</div>
                    <p className="ledger-desc">{t.moodDesc}</p>
                    <div className="tech-tags">
                      <span className="tag">TypeScript</span>
                      <span className="tag">React Native</span>
                      <span className="tag">Expo</span>
                      <span className="tag">Node.js</span>
                      <span className="tag">MongoDB</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    [{lang === 'en' ? 'STATUS: DEPLOYED' : 'ESTADO: DESPLEGADO'}]
                  </div>
                </div>

                <div className="ledger-row">
                  <div>
                    <div className="ledger-title">Serverless Cloud Movie Engine</div>
                    <p className="ledger-desc">{t.movieDesc}</p>
                    <div className="tech-tags">
                      <span className="tag">Java</span>
                      <span className="tag">Spring Boot</span>
                      <span className="tag">GCP Cloud Run</span>
                      <span className="tag">MongoDB Atlas</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    [{lang === 'en' ? 'STATUS: PRODUCTION' : 'ESTADO: PRODUCCIÓN'}]
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div className="content-section">
              <h2 className="section-title">{t.capabilitiesHeader}</h2>
              <div style={{ display: 'grid', gap: '2rem' }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{t.languagesLabel}</div>
                  <div className="tech-tags">
                    <span className="tag">JavaScript (ES6+)</span>
                    <span className="tag">TypeScript</span>
                    <span className="tag">Java SE</span>
                    <span className="tag">SQL</span>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{t.frameworksLabel}</div>
                  <div className="tech-tags">
                    <span className="tag">React / Next.js</span>
                    <span className="tag">React Native / Expo</span>
                    <span className="tag">Node.js Engine</span>
                    <span className="tag">Spring Boot Architecture</span>
                    <span className="tag">NoSQL Data Modeling (MongoDB)</span>
                    <span className="tag">Docker Container Environments</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="content-section">
              <h2 className="section-title">{t.logsHeader}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.logsDesc}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ borderLeft: '3px solid var(--color-accent)', background: 'var(--bg-main)', padding: '1rem', borderRadius: '0 6px 6px 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>[2026.07.18 11:20:00]</span> 
                  <span style={{ color: 'var(--color-accent)', marginLeft: '0.5rem' }}>[SYS_UPDATE]</span>
                  <p style={{ marginTop: '0.25rem', color: '#fff' }}>
                    {lang === 'en' ? 'Optimizing local container orchestration network profiles.' : 'Optimizando perfiles de red de orquestación de contenedores locales.'}
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid var(--color-success)', background: 'var(--bg-main)', padding: '1rem', borderRadius: '0 6px 6px 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>[2026.06.12 14:05:22]</span> 
                  <span style={{ color: 'var(--color-success)', marginLeft: '0.5rem' }}>[RELEASE]</span>
                  <p style={{ marginTop: '0.25rem', color: '#fff' }}>
                    {lang === 'en' ? 'Deployed production build of serverless review engine API to cloud cluster.' : 'Desplegada compilación de producción de API de motor de revisión sin servidor en cluster en la nube.'}
                  </p>
                </div>

                <div className="contact-grid" style={{ marginTop: '1rem' }}>
                  <div className="contact-card">
                    <div className="contact-label">{lang === 'en' ? 'Node Status' : 'Estado del Nodo'}</div>
                    <div className="contact-value" style={{ color: 'var(--color-success)' }}>● ONLINE / ACTIVE</div>
                  </div>
                  <div className="contact-card">
                    <div className="contact-label">{lang === 'en' ? 'Global Deployments' : 'Despliegues Globales'}</div>
                    <div className="contact-value">2 Verified Production Runtimes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}