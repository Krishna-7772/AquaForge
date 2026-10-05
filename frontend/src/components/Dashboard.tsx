import React from 'react';
import { 
  Activity, Compass, ShieldCheck, AlertTriangle, MapPin, 
  ArrowRight, FileCheck, Layers, Cpu, CheckCircle2, Clock
} from 'lucide-react';
import { Survey } from '../types';

interface DashboardProps {
  surveys: Survey[];
  onSelectSurvey: (surveyId: number) => void;
  onRunDemo: () => void;
  isProcessingDemo: boolean;
  demoProgress: number;
  demoStep: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  surveys,
  onSelectSurvey,
  onRunDemo,
  isProcessingDemo,
  demoProgress,
  demoStep
}) => {
  // Aggregate KPIs
  const totalSurveys = surveys.length;
  const totalContacts = surveys.reduce((acc, s) => acc + s.contact_count, 0);
  const totalHighPriority = surveys.reduce((acc, s) => acc + s.high_priority_count, 0);
  const totalNovel = surveys.reduce((acc, s) => acc + s.novel_count, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Scientific Principles & SIH Problem */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
              <span>National Institute of Ocean Technology (NIOT)</span>
              <span>&bull;</span>
              <span>Ministry of Earth Sciences</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
              Automated Side-Scan Sonar Marine Debris & Anomaly Detection
            </h1>
            <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
              Operational acoustic computer vision workstation engineered for hydrographers and autonomous underwater vehicles (AUVs).
              Couples real-time neural detection with multi-cue acoustic forensic profiling, WGS-84 uncertainty error bounds, and diagnostic next-best-scan guidance.
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Real Inference Active (CPU Edge ONNX)
            </span>
            <span className="text-[11px] text-gray-500 font-mono mt-1">
              Latency: ~43ms / ping cycle
            </span>
          </div>
        </div>

        {/* Demo Execution Callout / Progress Bar */}
        {isProcessingDemo ? (
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-blue-900 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 animate-spin text-blue-700" />
                Pipeline Processing: {demoStep || "Executing Survey perception"}
              </span>
              <span className="text-xs font-mono font-bold text-blue-900">{demoProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${demoProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-blue-700 mt-2 font-mono">
              <span>Ingestion</span>
              <span>TVG Preprocessing</span>
              <span>Acoustic Detection</span>
              <span>Forensics & Geolocation</span>
              <span>Report Ready</span>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Experience Full Verification Pipeline
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                Run the end-to-end pipeline on real dual-frequency sonar fixtures with ghost nets, shipwreck debris, and subsea pipelines.
              </div>
            </div>
            <button
              onClick={onRunDemo}
              className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-[#1E3E62] hover:bg-[#0B192C] text-white shadow-xs transition shrink-0"
            >
              <span>Run Demo Survey</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Surveys Processed</span>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-gray-900 font-mono">{totalSurveys}</div>
          <div className="mt-1 text-xs text-gray-500">Hydrographic survey missions</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contacts Cataloged</span>
            <div className="w-8 h-8 rounded bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-gray-900 font-mono">{totalContacts}</div>
          <div className="mt-1 text-xs text-gray-500">Acoustic highlight-shadow targets</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">High Priority Hazards</span>
            <div className="w-8 h-8 rounded bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-red-600 font-mono">{totalHighPriority}</div>
          <div className="mt-1 text-xs text-gray-500">Ghost nets & navigational threats</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Novel Acoustic Anomalies</span>
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-purple-700 font-mono">{totalNovel}</div>
          <div className="mt-1 text-xs text-gray-500">Out-of-distribution targets</div>
        </div>

      </div>

      {/* Surveys Overview Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900">Survey Operations Log</h2>
            <p className="text-xs text-gray-500 mt-0.5">Side-scan sonar acoustic survey files and analysis status</p>
          </div>
          <span className="text-xs font-mono text-gray-500">{surveys.length} survey(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Survey Code</th>
                <th className="px-6 py-3">Mission Name</th>
                <th className="px-6 py-3">Vessel & Sensor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Contacts</th>
                <th className="px-6 py-3">High Priority</th>
                <th className="px-6 py-3">Novel</th>
                <th className="px-6 py-3 text-right">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {surveys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No surveys ingested yet. Click <strong>"Run Demo Survey"</strong> to process the benchmark fixture.
                  </td>
                </tr>
              ) : (
                surveys.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => onSelectSurvey(s.id)}>
                    <td className="px-6 py-4 font-mono font-bold text-blue-900">
                      {s.survey_code}
                      {s.is_demo && (
                        <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-sans font-semibold">
                          DEMO FIXTURE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>{s.vessel_name}</div>
                      <div className="text-[11px] text-gray-400">{s.sensor_model} &bull; {s.frequency_khz} kHz</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        s.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{s.contact_count}</td>
                    <td className="px-6 py-4 font-mono font-bold text-red-600">{s.high_priority_count}</td>
                    <td className="px-6 py-4 font-mono font-bold text-purple-700">{s.novel_count}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectSurvey(s.id); }}
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-900"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
