import React, { useState, useRef } from 'react';
import { Upload, Play, Download, Eye, Clock, Target, Image as ImageIcon, Trash2 } from 'lucide-react';
import { TestResult, BoundingBox } from '../types/optimization';

export const ModelTesting: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('best-model');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample test images from Pexels
  const sampleImages = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];

  const simulateDetection = async (imageUrl: string): Promise<TestResult> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Generate random detection results
    const numDetections = Math.floor(Math.random() * 3) + 1;
    const detections: BoundingBox[] = [];

    for (let i = 0; i < numDetections; i++) {
      detections.push({
        x: Math.random() * 400,
        y: Math.random() * 300,
        width: 80 + Math.random() * 120,
        height: 100 + Math.random() * 150,
        confidence: 0.7 + Math.random() * 0.3,
        label: 'face'
      });
    }

    return {
      id: `test_${Date.now()}_${Math.random()}`,
      imageUrl,
      originalImage: imageUrl,
      detections,
      processingTime: 15 + Math.random() * 35,
      confidence: detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length,
      timestamp: new Date()
    };
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    await processImage(imageUrl);
  };

  const handleSampleImageTest = async (imageUrl: string) => {
    await processImage(imageUrl);
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const result = await simulateDetection(imageUrl);
      setTestResults(prev => [result, ...prev]);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const downloadResults = () => {
    const data = {
      model: selectedModel,
      timestamp: new Date().toISOString(),
      results: testResults
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `face-detection-results-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <Eye className="text-purple-600" />
        Model Testing & Evaluation
      </h2>

      {/* Model Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Model for Testing</h3>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="best-model">Best Model (F1: 89.2%)</option>
          <option value="model-1">Model 1 - Adam Optimizer</option>
          <option value="model-2">Model 2 - SGD Optimizer</option>
          <option value="model-3">Model 3 - High Learning Rate</option>
        </select>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Test Images</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* File Upload */}
          <div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-2">Click to upload image</p>
              <p className="text-sm text-gray-500">Supports JPG, PNG, WebP</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Sample Images */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Or test with sample images:</h4>
            <div className="grid grid-cols-2 gap-2">
              {sampleImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleImageTest(imageUrl)}
                  disabled={isProcessing}
                  className="relative group overflow-hidden rounded-lg border border-gray-200 hover:border-purple-500 transition-colors disabled:opacity-50"
                >
                  <img 
                    src={imageUrl} 
                    alt={`Sample ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">Processing image... This may take a few seconds.</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      {testResults.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Test Results ({testResults.length})</h3>
            <div className="flex gap-2">
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={16} />
                Download Results
              </button>
              <button
                onClick={clearResults}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {testResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image with Detections */}
                  <div>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={result.imageUrl} 
                        alt="Test result"
                        className="w-full h-64 object-cover"
                      />
                      
                      {/* Detection Overlays */}
                      <svg 
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 600 400"
                        preserveAspectRatio="none"
                      >
                        {result.detections.map((detection, idx) => (
                          <g key={idx}>
                            <rect
                              x={detection.x}
                              y={detection.y}
                              width={detection.width}
                              height={detection.height}
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="3"
                            />
                            <rect
                              x={detection.x}
                              y={detection.y - 25}
                              width={detection.width}
                              height="25"
                              fill="#8b5cf6"
                              fillOpacity="0.8"
                            />
                            <text
                              x={detection.x + 5}
                              y={detection.y - 8}
                              fill="white"
                              fontSize="12"
                              fontWeight="bold"
                            >
                              {detection.label} {(detection.confidence * 100).toFixed(0)}%
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Detection Details */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Detection Results</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="text-purple-600" size={16} />
                          <span className="text-sm font-medium text-purple-800">Faces Detected</span>
                        </div>
                        <div className="text-xl font-bold text-purple-900">
                          {result.detections.length}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="text-blue-600" size={16} />
                          <span className="text-sm font-medium text-blue-800">Processing Time</span>
                        </div>
                        <div className="text-xl font-bold text-blue-900">
                          {result.processingTime.toFixed(1)}ms
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-800">Average Confidence</span>
                      </div>
                      <div className="text-xl font-bold text-green-900">
                        {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    {/* Individual Detections */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Individual Detections:</h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {result.detections.map((detection, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>Face {idx + 1}</span>
                            <span className="font-semibold text-purple-600">
                              {(detection.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Tested at: {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">How to Use the Model</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-700 mb-2">Testing Process:</h4>
            <ul className="space-y-1 text-sm text-purple-600">
              <li>• Upload your test images or use sample images</li>
              <li>• Model processes image and detects faces</li>
              <li>• Results show bounding boxes with confidence scores</li>
              <li>• Processing time and accuracy metrics are displayed</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-2">Evaluation Metrics:</h4>
            <ul className="space-y-1 text-sm text-purple-600">
              <li>• <strong>Confidence:</strong> Model's certainty in detection</li>
              <li>• <strong>Processing Time:</strong> Inference speed per image</li>
              <li>• <strong>Bounding Box:</strong> Face location coordinates</li>
              <li>• <strong>Detection Count:</strong> Number of faces found</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};