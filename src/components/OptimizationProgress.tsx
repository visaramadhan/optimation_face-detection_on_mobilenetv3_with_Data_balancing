import React from 'react';
import { OptimizationSession } from '../types/optimization';
import { CheckCircle, Clock, AlertCircle, Play, Square } from 'lucide-react';

interface OptimizationProgressProps {
  session: OptimizationSession;
  onStop: () => void;
}

export const OptimizationProgress: React.FC<OptimizationProgressProps> = ({ session, onStop }) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-500" size={20} />;
      case 'running': return <Play className="text-blue-500 animate-pulse" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'running': return 'border-blue-200 bg-blue-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const overallProgress = Math.round(
    (session.steps.filter(s => s.status === 'completed').length / session.steps.length) * 100
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Progress Optimasi</h3>
        {session.status === 'running' && (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Square size={16} />
            Hentikan
          </button>
        )}
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium text-gray-700">Progress Keseluruhan</span>
          <span className="text-lg font-bold text-gray-900">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {session.steps.map((step, index) => (
          <div key={step.id} className={`border rounded-lg p-4 ${getStepColor(step.status)}`}>
            <div className="flex items-center gap-3 mb-2">
              {getStepIcon(step.status)}
              <h4 className="font-semibold text-gray-800">{step.name}</h4>
              {step.status === 'running' && (
                <span className="text-sm text-blue-600 font-medium">{step.progress}%</span>
              )}
            </div>

            {step.status === 'running' && (
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            )}

            {step.logs.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto">
                {step.logs.slice(-5).map((log, logIndex) => (
                  <div key={logIndex} className="text-sm text-green-400 font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {step.error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
                Error: {step.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results */}
      {session.results && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Hasil Optimasi</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(session.results.precision * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">Precision</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(session.results.recall * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">Recall</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(session.results.f1Score * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">F1-Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(session.results.mAP * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">mAP</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};