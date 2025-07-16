import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, HardDrive, Zap, Plus, Trash2, Download } from 'lucide-react';
import { ModelComparison as ModelComparisonType, OptimizationConfig } from '../types/optimization';

interface ModelComparisonProps {
  comparisons: ModelComparisonType[];
  onAddComparison: (config: OptimizationConfig) => void;
  onRemoveComparison: (id: string) => void;
  onDownloadModel: (id: string) => void;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({
  comparisons,
  onAddComparison,
  onRemoveComparison,
  onDownloadModel
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState<OptimizationConfig>({
    dataBalancing: {
      oversamplingTechnique: 'SMOTE',
      undersamplingTechnique: 'RandomUnderSampler',
      oversamplingRatio: 1.5,
      undersamplingRatio: 0.8
    },
    model: {
      learningRate: 0.001,
      batchSize: 32,
      epochs: 50,
      optimizer: 'Adam',
      architecture: 'MobileNetV3',
      inputSize: 416,
      augmentation: true
    },
    dataset: {
      trainSplit: 0.7,
      validationSplit: 0.2,
      testSplit: 0.1
    }
  });

  const handleAddComparison = () => {
    onAddComparison(newConfig);
    setShowAddForm(false);
  };

  const getMetricColor = (value: number, metric: string) => {
    const thresholds = {
      precision: { good: 0.9, fair: 0.8 },
      recall: { good: 0.85, fair: 0.75 },
      f1Score: { good: 0.87, fair: 0.8 },
      mAP: { good: 0.85, fair: 0.75 },
      accuracy: { good: 0.9, fair: 0.8 }
    };
    
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'text-gray-600';
    
    if (value >= threshold.good) return 'text-green-600';
    if (value >= threshold.fair) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBestModel = () => {
    if (comparisons.length === 0) return null;
    return comparisons.reduce((best, current) => 
      current.results.f1Score > best.results.f1Score ? current : best
    );
  };

  const bestModel = getBestModel();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          Model Comparison & Analysis
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Model
        </button>
      </div>

      {/* Best Model Highlight */}
      {bestModel && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🏆 Best Performing Model</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(bestModel.results.f1Score * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">F1-Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(bestModel.results.mAP * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">mAP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {bestModel.results.inferenceTime.toFixed(1)}ms
              </div>
              <div className="text-sm text-green-600">Inference</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(bestModel.results.modelSize / 1024 / 1024).toFixed(1)}MB
              </div>
              <div className="text-sm text-green-600">Size</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Model Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Model Configuration</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Rate</label>
              <input
                type="number"
                step="0.0001"
                value={newConfig.model.learningRate}
                onChange={(e) => setNewConfig({
                  ...newConfig,
                  model: { ...newConfig.model, learningRate: parseFloat(e.target.value) }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
              <select
                value={newConfig.model.batchSize}
                onChange={(e) => setNewConfig({
                  ...newConfig,
                  model: { ...newConfig.model, batchSize: parseInt(e.target.value) }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Epochs</label>
              <input
                type="number"
                value={newConfig.model.epochs}
                onChange={(e) => setNewConfig({
                  ...newConfig,
                  model: { ...newConfig.model, epochs: parseInt(e.target.value) }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Optimizer</label>
              <select
                value={newConfig.model.optimizer}
                onChange={(e) => setNewConfig({
                  ...newConfig,
                  model: { ...newConfig.model, optimizer: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Adam">Adam</option>
                <option value="SGD">SGD</option>
                <option value="RMSprop">RMSprop</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddComparison}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Model
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {comparisons.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-left font-semibold">Model</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">Precision</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">Recall</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">F1-Score</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">mAP</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">Accuracy</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">Training Time</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">Model Size</th>
                <th className="border border-gray-200 p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comparison) => (
                <tr key={comparison.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3">
                    <div>
                      <div className="font-semibold">{comparison.name}</div>
                      <div className="text-sm text-gray-600">
                        {comparison.config.model.optimizer} | LR: {comparison.config.model.learningRate}
                      </div>
                    </div>
                  </td>
                  <td className={`border border-gray-200 p-3 text-center font-semibold ${getMetricColor(comparison.results.precision, 'precision')}`}>
                    {(comparison.results.precision * 100).toFixed(1)}%
                  </td>
                  <td className={`border border-gray-200 p-3 text-center font-semibold ${getMetricColor(comparison.results.recall, 'recall')}`}>
                    {(comparison.results.recall * 100).toFixed(1)}%
                  </td>
                  <td className={`border border-gray-200 p-3 text-center font-semibold ${getMetricColor(comparison.results.f1Score, 'f1Score')}`}>
                    {(comparison.results.f1Score * 100).toFixed(1)}%
                  </td>
                  <td className={`border border-gray-200 p-3 text-center font-semibold ${getMetricColor(comparison.results.mAP, 'mAP')}`}>
                    {(comparison.results.mAP * 100).toFixed(1)}%
                  </td>
                  <td className={`border border-gray-200 p-3 text-center font-semibold ${getMetricColor(comparison.results.accuracy, 'accuracy')}`}>
                    {(comparison.results.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={16} className="text-gray-500" />
                      {Math.round(comparison.results.trainingTime)}min
                    </div>
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <HardDrive size={16} className="text-gray-500" />
                      {(comparison.results.modelSize / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onDownloadModel(comparison.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Download Model"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => onRemoveComparison(comparison.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove Model"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No models to compare yet. Add your first model to get started!</p>
        </div>
      )}

      {/* Performance Chart */}
      {comparisons.length > 1 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Comparison Chart</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* F1-Score Comparison */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">F1-Score Comparison</h4>
                <div className="space-y-2">
                  {comparisons.map((comparison, index) => (
                    <div key={comparison.id} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600 truncate">
                        {comparison.name}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${comparison.results.f1Score * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-semibold text-gray-700">
                        {(comparison.results.f1Score * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inference Time Comparison */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Inference Time Comparison</h4>
                <div className="space-y-2">
                  {comparisons.map((comparison) => {
                    const maxTime = Math.max(...comparisons.map(c => c.results.inferenceTime));
                    return (
                      <div key={comparison.id} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-gray-600 truncate">
                          {comparison.name}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-gradient-to-r from-green-500 to-red-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${(comparison.results.inferenceTime / maxTime) * 100}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm font-semibold text-gray-700">
                          {comparison.results.inferenceTime.toFixed(1)}ms
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};