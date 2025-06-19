import { OptimizationConfig, OptimizationSession, OptimizationStep } from '../types/optimization';

class OptimizationService {
  private currentSession: OptimizationSession | null = null;
  private listeners: ((session: OptimizationSession) => void)[] = [];

  // Simulasi langkah-langkah optimasi
  private optimizationSteps: Omit<OptimizationStep, 'status' | 'progress' | 'logs'>[] = [
    {
      id: 'setup',
      name: 'Setup Model & Analisis'
    },
    {
      id: 'dataset',
      name: 'Persiapan Dataset'
    },
    {
      id: 'balancing',
      name: 'Implementasi Data Balancing'
    },
    {
      id: 'training',
      name: 'Fine-tuning Model'
    },
    {
      id: 'evaluation',
      name: 'Evaluasi Performa'
    },
    {
      id: 'deployment',
      name: 'Deployment Model'
    }
  ];

  subscribe(listener: (session: OptimizationSession) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    if (this.currentSession) {
      this.listeners.forEach(listener => listener(this.currentSession!));
    }
  }

  async startOptimization(config: OptimizationConfig): Promise<string> {
    if (this.currentSession?.status === 'running') {
      throw new Error('Optimasi sedang berjalan. Tunggu hingga selesai.');
    }

    const sessionId = `opt_${Date.now()}`;
    
    this.currentSession = {
      id: sessionId,
      config,
      status: 'running',
      startTime: new Date(),
      steps: this.optimizationSteps.map(step => ({
        ...step,
        status: 'pending' as const,
        progress: 0,
        logs: []
      }))
    };

    this.notifyListeners();

    // Jalankan optimasi secara asinkron
    this.runOptimizationSteps();

    return sessionId;
  }

  private async runOptimizationSteps() {
    if (!this.currentSession) return;

    try {
      for (let i = 0; i < this.currentSession.steps.length; i++) {
        const step = this.currentSession.steps[i];
        
        // Update status step menjadi running
        step.status = 'running';
        step.startTime = new Date();
        this.notifyListeners();

        // Simulasi proses dengan logs
        await this.simulateStepExecution(step, i);

        // Update status step menjadi completed
        step.status = 'completed';
        step.progress = 100;
        step.endTime = new Date();
        this.notifyListeners();

        // Delay antar step
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulasi hasil akhir
      this.currentSession.results = {
        precision: 0.87 + Math.random() * 0.1,
        recall: 0.84 + Math.random() * 0.1,
        f1Score: 0.85 + Math.random() * 0.1,
        mAP: 0.82 + Math.random() * 0.1
      };

      this.currentSession.status = 'completed';
      this.currentSession.endTime = new Date();
      this.notifyListeners();

    } catch (error) {
      if (this.currentSession) {
        this.currentSession.status = 'error';
        this.currentSession.endTime = new Date();
        this.notifyListeners();
      }
    }
  }

  private async simulateStepExecution(step: OptimizationStep, stepIndex: number) {
    const stepLogs = this.getStepLogs(stepIndex);
    const totalDuration = 5000 + Math.random() * 5000; // 5-10 detik per step
    const logInterval = totalDuration / stepLogs.length;

    for (let i = 0; i < stepLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, logInterval));
      
      step.logs.push(`[${new Date().toLocaleTimeString()}] ${stepLogs[i]}`);
      step.progress = Math.round(((i + 1) / stepLogs.length) * 100);
      this.notifyListeners();
    }
  }

  private getStepLogs(stepIndex: number): string[] {
    const allLogs = [
      [
        'Mengunduh model RetinaFace-Ghost...',
        'Memuat pre-trained weights MobileNetV3...',
        'Menganalisis arsitektur model...',
        'Evaluasi performa baseline...',
        'Setup selesai!'
      ],
      [
        'Memuat dataset deteksi wajah...',
        'Menganalisis distribusi kelas...',
        'Membagi dataset (train/val/test)...',
        'Membuat data pipeline...',
        'Dataset siap digunakan!'
      ],
      [
        'Mengimplementasikan SMOTE oversampling...',
        'Menerapkan undersampling...',
        'Menyeimbangkan distribusi kelas...',
        'Validasi dataset seimbang...',
        'Data balancing selesai!'
      ],
      [
        'Setup transfer learning...',
        'Konfigurasi optimizer dan learning rate...',
        'Memulai fine-tuning model...',
        'Monitoring training metrics...',
        'Fine-tuning selesai!'
      ],
      [
        'Menghitung metrik precision dan recall...',
        'Menghitung F1-score dan mAP...',
        'Menganalisis confusion matrix...',
        'Membandingkan dengan baseline...',
        'Evaluasi selesai!'
      ],
      [
        'Mengkonversi model ke format deployment...',
        'Optimasi kecepatan inference...',
        'Setup model serving...',
        'Testing API endpoints...',
        'Deployment selesai!'
      ]
    ];

    return allLogs[stepIndex] || ['Memproses...', 'Selesai!'];
  }

  getCurrentSession(): OptimizationSession | null {
    return this.currentSession;
  }

  stopOptimization(): void {
    if (this.currentSession?.status === 'running') {
      this.currentSession.status = 'error';
      this.currentSession.endTime = new Date();
      
      // Update step yang sedang berjalan
      const runningStep = this.currentSession.steps.find(s => s.status === 'running');
      if (runningStep) {
        runningStep.status = 'error';
        runningStep.error = 'Dihentikan oleh pengguna';
        runningStep.endTime = new Date();
      }
      
      this.notifyListeners();
    }
  }

  exportConfiguration(config: OptimizationConfig): void {
    const configData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      configuration: config,
      metadata: {
        model: 'RetinaFace-Ghost MobileNetV3',
        purpose: 'Face Detection Optimization',
        techniques: ['Data Balancing', 'Oversampling', 'Undersampling']
      }
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `face-detection-config-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importConfiguration(file: File): Promise<OptimizationConfig> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.configuration) {
            resolve(data.configuration);
          } else {
            reject(new Error('Format konfigurasi tidak valid'));
          }
        } catch (error) {
          reject(new Error('File tidak dapat dibaca'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error membaca file'));
      reader.readAsText(file);
    });
  }
}

export const optimizationService = new OptimizationService();