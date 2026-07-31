'use client';

import React, { useEffect, useState, useRef } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  source: 'MQTT' | 'WS' | 'SYSTEM' | 'AUDIO';
  message: string;
  payload?: any;
}

interface TelemetryData {
  cpuTemp: number;
  cpuUsage: number;
  ramUsage: number;
  totalRamGb: string;
  usedRamGb: string;
  uptimeSec: number;
}

export const DeskDashboard: React.FC<{ wsUrl?: string }> = ({ 
  wsUrl = 'ws://eslender-hub.local:8081' 
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'ONLINE' | 'OFFLINE'>('CONNECTING');
  const [deskState, setDeskState] = useState<'occupied' | 'vacant' | 'unknown'>('unknown');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    cpuTemp: 0,
    cpuUsage: 0,
    ramUsage: 0,
    totalRamGb: '0',
    usedRamGb: '0',
    uptimeSec: 0,
  });
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      setConnectionStatus('CONNECTING');
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => setConnectionStatus('ONLINE');

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'SYSTEM_TELEMETRY') {
            setTelemetry(data.data);
          } else if (data.type === 'HUB_LOG') {
            const newLog: LogEntry = {
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date(data.timestamp).toLocaleTimeString(),
              source: data.source,
              message: data.message,
              payload: data.payload,
            };

            setLogs((prev) => [...prev.slice(-199), newLog]);

            if (data.payload?.event === 'desk_presence') {
              setDeskState(data.payload.status === 'active' ? 'occupied' : 'vacant');
            }
          }
        } catch (e) {
          console.log('Raw WS message:', event.data);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('OFFLINE');
        setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      socketRef.current?.close();
    };
  }, [wsUrl]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const sendPresenceTrigger = (status: 'active' | 'inactive') => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event: 'desk_presence', status }));
    }
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const getTempColor = (temp: number) => {
    if (temp <= 0) return '#9CA3AF';
    if (temp < 55) return '#10B981'; // Cool Green
    if (temp < 70) return '#F59E0B'; // Warm Yellow
    return '#EF4444'; // Hot Red
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>DESK HUB // CORE OPERATIONS</h1>
        <div style={styles.badgeGroup}>
          <span style={{
            ...styles.statusBadge,
            backgroundColor: connectionStatus === 'ONLINE' ? '#10B981' : '#EF4444'
          }}>
            WS GATEWAY: {connectionStatus}
          </span>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>DESK PRESENCE</div>
          <div style={{
            ...styles.cardValue,
            color: deskState === 'occupied' ? '#10B981' : deskState === 'vacant' ? '#F59E0B' : '#9CA3AF'
          }}>
            {deskState.toUpperCase()}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>PI 5 CPU TEMP</div>
          <div style={{ ...styles.cardValue, color: getTempColor(telemetry.cpuTemp) }}>
            {telemetry.cpuTemp > 0 ? `${telemetry.cpuTemp}°C` : 'N/A'}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>CPU / RAM USAGE</div>
          <div style={{ ...styles.cardValue, color: '#3B82F6' }}>
            {telemetry.cpuUsage}% <span style={{ color: '#64748B', fontSize: '14px' }}>CPU</span> | {telemetry.ramUsage}% <span style={{ color: '#64748B', fontSize: '14px' }}>RAM</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>PI HOST UPTIME</div>
          <div style={{ ...styles.cardValue, color: '#8B5CF6' }}>
            {formatUptime(telemetry.uptimeSec)}
          </div>
        </div>
      </div>

      {/* Control Actions Row */}
      <div style={{ ...styles.grid, gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>MQTT BROKER ADDRESS</div>
          <div style={{ ...styles.cardValue, color: '#10B981', fontSize: '16px' }}>
            mqtt://mqtt_broker:1883
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>QUICK EVENT SIMULATOR</div>
          <div style={styles.buttonGroup}>
            <button style={styles.btnSuccess} onClick={() => sendPresenceTrigger('active')}>
              Simulate Occupied
            </button>
            <button style={styles.btnDanger} onClick={() => sendPresenceTrigger('inactive')}>
              Simulate Vacant
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Log Stream Terminal */}
      <div style={styles.terminalContainer}>
        <div style={styles.terminalHeader}>
          <span>LIVE TELEMETRY & LOG FEED ({logs.length} EVENTS)</span>
          <div>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={autoScroll} 
                onChange={(e) => setAutoScroll(e.target.checked)} 
              />
              Auto-scroll
            </label>
            <button style={styles.btnClear} onClick={() => setLogs([])}>Clear Log</button>
          </div>
        </div>

        <div ref={logContainerRef} style={styles.terminalBody}>
          {logs.length === 0 ? (
            <div style={styles.emptyState}>Listening for desk events and telemetry...</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} style={styles.logRow}>
                <span style={styles.logTime}>[{log.timestamp}]</span>
                <span style={{
                  ...styles.logSource,
                  color: log.source === 'MQTT' ? '#3B82F6' : log.source === 'WS' ? '#10B981' : log.source === 'AUDIO' ? '#EC4899' : '#F59E0B'
                }}>
                  [{log.source}]
                </span>
                <span style={styles.logMsg}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: 'monospace' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' },
  title: { fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' },
  badgeGroup: { display: 'flex', gap: '12px' },
  statusBadge: { padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#FFF' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' },
  card: { backgroundColor: '#1E293B', padding: '16px', borderRadius: '8px', border: '1px solid #334155' },
  cardLabel: { fontSize: '11px', color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.5px' },
  cardValue: { fontSize: '18px', fontWeight: 'bold' },
  buttonGroup: { display: 'flex', gap: '8px', marginTop: '4px' },
  btnSuccess: { backgroundColor: '#059669', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  btnDanger: { backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  terminalContainer: { backgroundColor: '#020617', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' },
  terminalHeader: { backgroundColor: '#1E293B', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94A3B8' },
  checkboxLabel: { marginRight: '16px', cursor: 'pointer' },
  btnClear: { backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
  terminalBody: { height: '340px', overflowY: 'auto', padding: '16px', fontSize: '13px', lineHeight: '1.6' },
  emptyState: { color: '#64748B', textAlign: 'center', marginTop: '120px' },
  logRow: { marginBottom: '4px', display: 'flex', gap: '10px' },
  logTime: { color: '#64748B' },
  logSource: { fontWeight: 'bold', width: '70px' },
  logMsg: { color: '#E2E8F0', wordBreak: 'break-all' }
};