import { useState, useEffect } from 'react';
import { OptimizationSession, OptimizationConfig } from '../types/optimization';
import { optimizationService } from '../services/optimizationService';

export const useOptimization = () => {
  const [session, setSession] = useState<OptimizationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = optimizationService.subscribe((newSession) => {
      setSession(newSession);
      setIsLoading(newSession.status === 'running');
    });

    // Load current session if exists
    const currentSession = optimizationService.getCurrentSession();
    if (currentSession) {
      setSession(currentSession);
      setIsLoading(currentSession.status === 'running');
    }

    return unsubscribe;
  }, []);

  const startOptimization = async (config: OptimizationConfig) => {
    try {
      setError(null);
      setIsLoading(true);
      await optimizationService.startOptimization(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  const stopOptimization = () => {
    optimizationService.stopOptimization();
    setIsLoading(false);
  };

  const exportConfig = (config: OptimizationConfig) => {
    try {
      optimizationService.exportConfiguration(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengekspor konfigurasi');
    }
  };

  const importConfig = async (file: File): Promise<OptimizationConfig> => {
    try {
      return await optimizationService.importConfiguration(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengimpor konfigurasi');
      throw err;
    }
  };

  return {
    session,
    isLoading,
    error,
    startOptimization,
    stopOptimization,
    exportConfig,
    importConfig
  };
};