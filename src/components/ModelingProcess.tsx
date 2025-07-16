import React, { useState } from 'react';
import { Brain, Database, BarChart3, Settings, Calculator, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  formula: string;
  details: string[];
  icon: React.ReactNode;
}

export const ModelingProcess: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const modelingSteps: ProcessStep[] = [
    {
      id: 'data-preprocessing',
      title: 'Data Preprocessing & Augmentation',
      description: 'Persiapan data dan augmentasi untuk meningkatkan variasi dataset',
      formula: 'X_aug = T(X_original) where T ∈ {rotation, scaling, flipping, brightness}',
      details: [
        'Normalisasi pixel values: X_norm = (X - μ) / σ',
        'Resize gambar ke ukuran standar (224x224 atau 416x416)',
        'Data augmentation: rotasi (±15°), scaling (0.8-1.2), horizontal flip',
        'Brightness adjustment: I_new = I_old × (1 + α) dimana α ∈ [-0.3, 0.3]',
        'Gaussian noise addition untuk robustness'
      ],
      icon: <Database className="text-blue-600" size={24} />
    },
    {
      id: 'data-balancing',
      title: 'Data Balancing Techniques',
      description: 'Implementasi SMOTE dan undersampling untuk mengatasi class imbalance',
      formula: 'SMOTE: X_synthetic = X_i + λ × (X_nn - X_i) where λ ∈ [0,1]',
      details: [
        'SMOTE (Synthetic Minority Oversampling Technique)',
        'Formula: X_new = X_minority + random(0,1) × (X_neighbor - X_minority)',
        'Random Undersampling untuk majority class',
        'Tomek Links untuk cleaning overlapping samples',
        'Class weight adjustment: w_i = n_samples / (n_classes × n_samples_i)'
      ],
      icon: <Settings className="text-purple-600" size={24} />
    },
    {
      id: 'model-architecture',
      title: 'RetinaFace-Ghost Architecture',
      description: 'Implementasi arsitektur RetinaFace dengan MobileNetV3 backbone',
      formula: 'FPN: P_i = Conv(C_i) + Upsample(P_{i+1}) for i = 5,4,3,2',
      details: [
        'MobileNetV3 sebagai feature extractor backbone',
        'Feature Pyramid Network (FPN) untuk multi-scale detection',
        'Classification head: P(class) = softmax(FC(features))',
        'Regression head: bbox = FC(features) untuk bounding box prediction',
        'Anchor generation: 3 scales × 3 aspect ratios per location'
      ],
      icon: <Brain className="text-green-600" size={24} />
    },
    {
      id: 'loss-function',
      title: 'Multi-task Loss Function',
      description: 'Kombinasi classification dan regression loss untuk face detection',
      formula: 'L_total = λ₁L_cls + λ₂L_bbox + λ₃L_landmark',
      details: [
        'Classification Loss: L_cls = -Σ y_i log(p_i) (Cross-entropy)',
        'Bounding Box Loss: L_bbox = Σ smooth_L1(t_i - t_i*)',
        'Smooth L1: smooth_L1(x) = 0.5x² if |x| < 1, else |x| - 0.5',
        'Landmark Loss: L_landmark = Σ ||l_i - l_i*||₂',
        'Loss weights: λ₁ = 1.0, λ₂ = 1.0, λ₃ = 0.1'
      ],
      icon: <Calculator className="text-red-600" size={24} />
    },
    {
      id: 'optimization',
      title: 'Model Optimization & Training',
      description: 'Algoritma optimasi dan strategi training untuk konvergensi optimal',
      formula: 'Adam: m_t = β₁m_{t-1} + (1-β₁)g_t, v_t = β₂v_{t-1} + (1-β₂)g_t²',
      details: [
        'Adam Optimizer dengan β₁ = 0.9, β₂ = 0.999, ε = 1e-8',
        'Learning rate schedule: lr_t = lr_0 × γ^(epoch/step_size)',
        'Gradient clipping: ||g|| ≤ max_norm untuk stability',
        'Early stopping berdasarkan validation loss',
        'Model checkpoint saving untuk best validation mAP'
      ],
      icon: <BarChart3 className="text-orange-600" size={24} />
    },
    {
      id: 'evaluation',
      title: 'Model Evaluation Metrics',
      description: 'Metrik evaluasi komprehensif untuk mengukur performa model',
      formula: 'mAP = (1/n) Σ AP_i where AP_i = ∫₀¹ P(R) dR',
      details: [
        'Precision: P = TP / (TP + FP)',
        'Recall: R = TP / (TP + FN)',
        'F1-Score: F1 = 2 × (P × R) / (P + R)',
        'Average Precision: AP = Σ(R_n - R_{n-1}) × P_n',
        'IoU threshold: 0.5 untuk positive detection'
      ],
      icon: <BookOpen className="text-indigo-600" size={24} />
    }
  ];

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Tahapan Proses Modeling Detail
      </h2>
      
      <div className="space-y-4">
        {modelingSteps.map((step, index) => (
          <div key={step.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleStep(step.id)}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {index + 1}
                </div>
                {step.icon}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
              {expandedStep === step.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {expandedStep === step.id && (
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Formula Utama:</h4>
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                    {step.formula}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Detail Implementasi:</h4>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};