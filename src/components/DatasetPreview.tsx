import React, { useState } from 'react';
import { Eye, Image, Users, BarChart3, RefreshCw } from 'lucide-react';
import { DatasetSample } from '../types/optimization';

export const DatasetPreview: React.FC = () => {
  const [currentSample, setCurrentSample] = useState(0);
  
  // Sample dataset dengan gambar dari Pexels
  const datasetSamples: DatasetSample[] = [
    {
      id: '1',
      imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      label: 'face',
      annotations: [
        { x: 120, y: 80, width: 160, height: 200, confidence: 0.95, label: 'face' }
      ],
      metadata: { width: 400, height: 300, faces: 1 }
    },
    {
      id: '2',
      imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      label: 'face',
      annotations: [
        { x: 100, y: 60, width: 140, height: 180, confidence: 0.92, label: 'face' }
      ],
      metadata: { width: 400, height: 300, faces: 1 }
    },
    {
      id: '3',
      imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      label: 'face',
      annotations: [
        { x: 80, y: 70, width: 120, height: 150, confidence: 0.88, label: 'face' }
      ],
      metadata: { width: 400, height: 300, faces: 1 }
    },
    {
      id: '4',
      imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      label: 'face',
      annotations: [
        { x: 150, y: 90, width: 100, height: 130, confidence: 0.91, label: 'face' }
      ],
      metadata: { width: 400, height: 300, faces: 1 }
    }
  ];

  const datasetStats = {
    totalImages: 15420,
    trainImages: 10794,
    valImages: 3084,
    testImages: 1542,
    totalFaces: 18650,
    avgFacesPerImage: 1.21,
    classDistribution: {
      face: 18650,
      background: 45230
    }
  };

  const nextSample = () => {
    setCurrentSample((prev) => (prev + 1) % datasetSamples.length);
  };

  const prevSample = () => {
    setCurrentSample((prev) => (prev - 1 + datasetSamples.length) % datasetSamples.length);
  };

  const sample = datasetSamples[currentSample];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <Image className="text-blue-600" />
        Dataset Preview & Statistics
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Dataset Sample Viewer */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sample Images</h3>
          
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={sample.imageUrl} 
              alt={`Sample ${sample.id}`}
              className="w-full h-64 object-cover"
            />
            
            {/* Bounding Box Overlay */}
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
            >
              {sample.annotations.map((annotation, idx) => (
                <g key={idx}>
                  <rect
                    x={annotation.x}
                    y={annotation.y}
                    width={annotation.width}
                    height={annotation.height}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <text
                    x={annotation.x}
                    y={annotation.y - 5}
                    fill="#ef4444"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {annotation.label} ({(annotation.confidence * 100).toFixed(0)}%)
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prevSample}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Previous
            </button>
            
            <div className="text-center">
              <span className="text-gray-600">
                {currentSample + 1} of {datasetSamples.length}
              </span>
            </div>
            
            <button
              onClick={nextSample}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Image Metadata:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Dimensions: {sample.metadata.width}×{sample.metadata.height}</div>
              <div>Faces detected: {sample.metadata.faces}</div>
              <div>Label: {sample.label}</div>
              <div>Annotations: {sample.annotations.length}</div>
            </div>
          </div>
        </div>

        {/* Dataset Statistics */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Dataset Statistics</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Image className="text-blue-600" size={20} />
                <span className="font-semibold text-blue-800">Total Images</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {datasetStats.totalImages.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-700">
                  {datasetStats.trainImages.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Training</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <div className="text-lg font-bold text-yellow-700">
                  {datasetStats.valImages.toLocaleString()}
                </div>
                <div className="text-sm text-yellow-600">Validation</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-700">
                  {datasetStats.testImages.toLocaleString()}
                </div>
                <div className="text-sm text-purple-600">Testing</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-gray-600" size={20} />
                <span className="font-semibold text-gray-800">Face Statistics</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total faces:</span>
                  <span className="font-semibold">{datasetStats.totalFaces.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg faces per image:</span>
                  <span className="font-semibold">{datasetStats.avgFacesPerImage}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="text-gray-600" size={20} />
                <span className="font-semibold text-gray-800">Class Distribution</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Face</span>
                    <span>{datasetStats.classDistribution.face.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${(datasetStats.classDistribution.face / (datasetStats.classDistribution.face + datasetStats.classDistribution.background)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Background</span>
                    <span>{datasetStats.classDistribution.background.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ 
                        width: `${(datasetStats.classDistribution.background / (datasetStats.classDistribution.face + datasetStats.classDistribution.background)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <RefreshCw size={20} />
              Refresh Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};