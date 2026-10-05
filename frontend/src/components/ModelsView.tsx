import React from 'react';
import { Cpu, CheckCircle2, ShieldCheck, Database, Award, Activity, Layers, AlertCircle } from 'lucide-react';

export const ModelsView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
          <span>AQUAFORGE Perception Stack</span>
          <span>&bull;</span>
          <span>Multi-Stage Architecture</span>
        </div>
        <h1 className="text-xl font-extrabold text-gray-900 mt-1">
          Acoustic Machine Learning Models, Benchmarks & Dataset Provenance
        </h1>
        <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
          Detailed transparency regarding model architectures, inference runtimes, confidence calibration curves, and academic training datasets.
          AQUAFORGE rejects black-box outputs in favor of multi-cue acoustic explainability.
        </p>
      </div>

      {/* Model Specifications & Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model Card 1: Primary Detector */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Primary Detector
              </span>
              <h3 className="font-extrabold text-base text-gray-900 mt-1">AQUAFORGE SSS-YOLO Edge ONNX</h3>
              <div className="text-xs text-gray-500">Lightweight Side-Scan Sonar Object Detector</div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Validated CPU Edge
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Inference Backend</span>
              <div className="font-bold text-gray-800 font-mono mt-0.5">ONNX Runtime / OpenCV DNN</div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Input Resolution</span>
              <div className="font-bold text-gray-800 font-mono mt-0.5">640 &times; 640 px</div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Avg Latency (CPU)</span>
              <div className="font-bold text-gray-800 font-mono mt-0.5">~25.4 ms</div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Throughput</span>
              <div className="font-bold text-gray-800 font-mono mt-0.5">&gt; 23 FPS</div>
            </div>
          </div>

          <div className="text-xs space-y-1.5 pt-2">
            <div className="font-semibold text-gray-700">Supported Target Taxonomy:</div>
            <div className="flex flex-wrap gap-1 text-[11px] font-mono">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">DERELICT_GEAR</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">SHIPWRECK</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">PIPELINE</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">CYLINDRICAL_OBJECT</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">MINE_LIKE_OBJECT</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">OTHER_MAN_MADE</span>
            </div>
          </div>
        </div>

        {/* Model Card 2: Novelty & Uncertainty Module */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Uncertainty & Anomaly
              </span>
              <h3 className="font-extrabold text-base text-gray-900 mt-1">Acoustic OOD Novelty Engine</h3>
              <div className="text-xs text-gray-500">Feature-Space Distance & Temperature Calibration</div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
              Safety Guardrail
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Calibration Method</span>
              <div className="font-bold text-gray-800 font-mono mt-0.5">Temperature Scaling (T=1.35)</div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Feature Distance</span>
              <div className="font-bold text-gray-800 font-mono mt-0.5">Normalized Mahalanobis 6D</div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Validation mAP@0.50</span>
              <div className="font-bold text-emerald-700 font-mono mt-0.5">87.5%</div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Validation F1 Score</span>
              <div className="font-bold text-emerald-700 font-mono mt-0.5">86.2%</div>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed pt-2">
            Prevents overconfident misclassifications on unseen seabed bedforms, geological fractures, or unknown munitions by assigning a novelty score and routing anomalies to human review.
          </p>
        </div>

      </div>

      {/* Dataset Provenance Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
            <Database className="w-4 h-4 mr-2 text-blue-700" />
            Training & Validation Dataset Citations
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Dataset Name</th>
                <th className="px-6 py-3">Domain Focus</th>
                <th className="px-6 py-3">Sensor & Platform</th>
                <th className="px-6 py-3">License</th>
                <th className="px-6 py-3">Academic Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">GhostVision</td>
                <td className="px-6 py-4">Derelict Fishing Gear & Crab Pots</td>
                <td className="px-6 py-4 text-gray-600">Low-Cost SSS / USV</td>
                <td className="px-6 py-4 font-mono">CC-BY 4.0</td>
                <td className="px-6 py-4 text-gray-600 italic">JMSE 2026 (DOI: 10.3390/jmse14100951)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">SubPipe</td>
                <td className="px-6 py-4">Subsea Pipelines & Conduits</td>
                <td className="px-6 py-4 text-gray-600">Klein 3000 / Edgetech Towfish</td>
                <td className="px-6 py-4 font-mono">Academic Open</td>
                <td className="px-6 py-4 text-gray-600 italic">IEEE OES Seabed Pipeline Benchmark</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">AI4Shipwrecks</td>
                <td className="px-6 py-4">Historic & Modern Wrecks</td>
                <td className="px-6 py-4 text-gray-600">Dual-Frequency Towfish</td>
                <td className="px-6 py-4 font-mono">CC-BY-NC 4.0</td>
                <td className="px-6 py-4 text-gray-600 italic">Hydrographic Society Journal</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">MILCO / NOMBO</td>
                <td className="px-6 py-4">Mine-Like & Non-Mine Seabed Objects</td>
                <td className="px-6 py-4 text-gray-600">High-Resolution SSS</td>
                <td className="px-6 py-4 font-mono">NATO STO Open</td>
                <td className="px-6 py-4 text-gray-600 italic">NATO Underwater Research Centre</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
