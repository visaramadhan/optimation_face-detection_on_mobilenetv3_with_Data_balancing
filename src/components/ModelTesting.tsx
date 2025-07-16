import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Play, Download, Eye, Clock, Target, Image as ImageIcon, Trash2, Camera, StopCircle, RefreshCw, Zap, BarChart3 } from 'lucide-react';
import { TestResult, BoundingBox } from '../types/optimization';

interface DetectionMetrics {
  totalDetections: number;
  averageConfidence: number;
  processingTime: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export const ModelTesting: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('best-model');
  const [testingMode, setTestingMode] = useState<'upload' | 'camera'>('upload');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [metrics, setMetrics] = useState<DetectionMetrics | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample test images from Pexels
  const sampleImages = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];

  const simulateDetection = async (imageUrl: string): Promise<TestResult> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500));

    // Generate random detection results
    const numDetections = Math.floor(Math.random() * 4) + 1;
    const detections: BoundingBox[] = [];

    for (let i = 0; i < numDetections; i++) {
      detections.push({
        x: Math.random() * 400,
        y: Math.random() * 300,
        width: 60 + Math.random() * 140,
        height: 80 + Math.random() * 170,
        confidence: 0.65 + Math.random() * 0.35,
        label: 'face'
      });
    }

    return {
      id: `test_${Date.now()}_${Math.random()}`,
      imageUrl,
      originalImage: imageUrl,
      detections,
      processingTime: 12 + Math.random() * 28,
      confidence: detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length,
      timestamp: new Date()
    };
  };

  const calculateMetrics = useCallback((results: TestResult[]): DetectionMetrics => {
    if (results.length === 0) {
      return {
        totalDetections: 0,
        averageConfidence: 0,
        processingTime: 0,
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0
      };
    }

    const totalDetections = results.reduce((sum, r) => sum + r.detections.length, 0);
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;
    
    // Simulate accuracy metrics based on confidence and detection count
    const accuracy = Math.min(0.95, avgConfidence * 0.9 + Math.random() * 0.1);
    const precision = Math.min(0.92, avgConfidence * 0.85 + Math.random() * 0.1);
    const recall = Math.min(0.88, avgConfidence * 0.82 + Math.random() * 0.1);
    const f1Score = (2 * precision * recall) / (precision + recall);

    return {
      totalDetections,
      averageConfidence: avgConfidence,
      processingTime: avgProcessingTime,
      accuracy,
      precision,
      recall,
      f1Score
    };
  }, []);

  useEffect(() => {
    const newMetrics = calculateMetrics(testResults);
    setMetrics(newMetrics);
  }, [testResults, calculateMetrics]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      setStream(mediaStream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const captureFromCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Convert canvas to blob and create URL
    canvas.toBlob(async (blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        await processImage(imageUrl);
      }
    });
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
    setMetrics(null);
  };

  const downloadResults = () => {
    const data = {
      model: selectedModel,
      timestamp: new Date().toISOString(),
      metrics,
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

  const downloadModel = () => {
    // Simulate model download
    const modelData = {
      modelName: selectedModel,
      version: '1.0.0',
      architecture: 'RetinaFace-Ghost MobileNetV3',
      size: '15.2 MB',
      downloadUrl: 'https://example.com/model-download',
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(modelData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedModel}-model-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <Eye className="text-purple-600" />
        Model Testing & Real-time Detection
      </h2>

      {/* Model Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Model Configuration</h3>
          <button
            onClick={downloadModel}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download size={16} />
            Download Model
          </button>
        </div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="best-model">Best Model (F1: 89.2%, mAP: 85.7%)</option>
          <option value="model-1">Model 1 - Adam Optimizer (F1: 87.1%)</option>
          <option value="model-2">Model 2 - SGD Optimizer (F1: 84.3%)</option>
          <option value="model-3">Model 3 - High Learning Rate (F1: 82.9%)</option>
          <option value="model-4">Model 4 - Data Augmented (F1: 88.5%)</option>
        </select>
      </div>

      {/* Testing Mode Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-4 p-2 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              setTestingMode('upload');
              if (isCameraActive) stopCamera();
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              testingMode === 'upload'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Upload size={20} />
            Image Upload
          </button>
          <button
            onClick={() => setTestingMode('camera')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              testingMode === 'camera'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Camera size={20} />
            Camera Testing
          </button>
        </div>
      </div>

      {/* Testing Interface */}
      <div className="mb-8">
        {testingMode === 'upload' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Upload Test Images</h4>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-2">Click to upload image</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WebP (Max 10MB)</p>
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
              <h4 className="font-semibold text-gray-800 mb-3">Sample Test Images</h4>
              <div className="grid grid-cols-3 gap-2">
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
                      className="w-full h-16 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-4">Camera Testing</h4>
            
            {!isCameraActive ? (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-600 mb-4">Start camera to begin real-time face detection</p>
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mx-auto"
                >
                  <Camera size={20} />
                  Start Camera
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '640px' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                    <button
                      onClick={captureFromCamera}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      <Target size={16} />
                      {isProcessing ? 'Processing...' : 'Capture & Detect'}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <StopCircle size={16} />
                      Stop Camera
                    </button>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              Processing image with {selectedModel}... Analyzing faces and calculating metrics.
            </span>
          </div>
        </div>
      )}

      {/* Metrics Dashboard */}
      {metrics && testResults.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
            <BarChart3 className="text-purple-600" />
            Testing Metrics Overview
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalDetections}</div>
              <div className="text-sm text-purple-700">Total Faces</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.processingTime.toFixed(1)}ms</div>
              <div className="text-sm text-blue-700">Avg Processing</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{(metrics.averageConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-green-700">Avg Confidence</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{testResults.length}</div>
              <div className="text-sm text-orange-700">Images Tested</div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Accuracy</span>
                <span className="text-lg font-bold text-green-600">{(metrics.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.accuracy * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Precision</span>
                <span className="text-lg font-bold text-blue-600">{(metrics.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.precision * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Recall</span>
                <span className="text-lg font-bold text-purple-600">{(metrics.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.recall * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">F1-Score</span>
                <span className="text-lg font-bold text-red-600">{(metrics.f1Score * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.f1Score * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {testResults.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Detection Results ({testResults.length} images tested)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={16} />
                Export Results
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

          <div className="space-y-6 max-h-96 overflow-y-auto">
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
                              width={Math.max(detection.width, 80)}
                              height="25"
                              fill="#8b5cf6"
                              fillOpacity="0.9"
                            />
                            <text
                              x={detection.x + 5}
                              y={detection.y - 8}
                              fill="white"
                              fontSize="12"
                              fontWeight="bold"
                            >
                              Face {idx + 1}: {(detection.confidence * 100).toFixed(0)}%
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Detection Details */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Detection Analysis</h4>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="text-purple-600" size={16} />
                          <span className="text-sm font-medium text-purple-800">Faces</span>
                        </div>
                        <div className="text-xl font-bold text-purple-900">
                          {result.detections.length}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="text-blue-600" size={16} />
                          <span className="text-sm font-medium text-blue-800">Time</span>
                        </div>
                        <div className="text-xl font-bold text-blue-900">
                          {result.processingTime.toFixed(1)}ms
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="text-green-600" size={16} />
                          <span className="text-sm font-medium text-green-800">Confidence</span>
                        </div>
                        <div className="text-xl font-bold text-green-900">
                          {(result.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="text-orange-600" size={16} />
                          <span className="text-sm font-medium text-orange-800">Quality</span>
                        </div>
                        <div className="text-xl font-bold text-orange-900">
                          {result.confidence > 0.8 ? 'High' : result.confidence > 0.6 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </div>

                    {/* Individual Detections */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Detection Details:</h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {result.detections.map((detection, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>Face {idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                {Math.round(detection.width)}×{Math.round(detection.height)}
                              </span>
                              <span className="font-semibold text-purple-600">
                                {(detection.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Tested: {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Guide */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">Testing Guide & Metrics Explanation</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-700 mb-2">How to Test:</h4>
            <ul className="space-y-1 text-sm text-purple-600">
              <li>• <strong>Image Upload:</strong> Upload images or use samples</li>
              <li>• <strong>Camera Testing:</strong> Real-time face detection</li>
              <li>• <strong>Model Selection:</strong> Choose different trained models</li>
              <li>• <strong>Batch Testing:</strong> Test multiple images sequentially</li>
              <li>• <strong>Results Export:</strong> Download detailed results</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-2">Metrics Explained:</h4>
            <ul className="space-y-1 text-sm text-purple-600">
              <li>• <strong>Accuracy:</strong> Overall correctness of detections</li>
              <li>• <strong>Precision:</strong> True positives / (True + False positives)</li>
              <li>• <strong>Recall:</strong> True positives / (True positives + False negatives)</li>
              <li>• <strong>F1-Score:</strong> Harmonic mean of precision and recall</li>
              <li>• <strong>Confidence:</strong> Model's certainty in each detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};