import React from 'react';
import { FileText, Download, ExternalLink, ShieldCheck, Calendar, Layers } from 'lucide-react';
import { Survey } from '../types';

interface ReportsViewProps {
  surveys: Survey[];
  onSelectSurvey: (surveyId: number) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ surveys, onSelectSurvey }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-xl font-extrabold text-gray-900">Hydrographic Survey Reports & Archival Exports</h1>
        <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
          Standardized screening documentation conforming to hydrographic survey and disaster management auditing requirements.
          Every report incorporates acquisition telemetry, acoustic forensic profiles, WGS-84 coordinate uncertainties, and analyst decisions.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {surveys.map((s) => (
          <div key={s.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-blue-900">{s.survey_code}</span>
                    {s.is_demo && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                        Demo
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mt-1">{s.name}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  {s.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded text-center text-xs">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Contacts</div>
                  <div className="font-bold text-gray-900 font-mono mt-0.5">{s.contact_count}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">High Priority</div>
                  <div className="font-bold text-red-600 font-mono mt-0.5">{s.high_priority_count}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Novel Contacts</div>
                  <div className="font-bold text-purple-700 font-mono mt-0.5">{s.novel_count}</div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div>Platform: <strong className="text-gray-700">{s.vessel_name}</strong></div>
                <div>Acoustic Sensor: <strong className="text-gray-700">{s.sensor_model} ({s.frequency_khz} kHz)</strong></div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <a
                href={`/api/surveys/${s.id}/report`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-900"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                <span>Open Full HTML Report</span>
              </a>

              <div className="flex items-center space-x-2">
                <a
                  href={`/api/surveys/${s.id}/export?format=geojson`}
                  download
                  className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                >
                  GeoJSON
                </a>
                <a
                  href={`/api/surveys/${s.id}/export?format=csv`}
                  download
                  className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                >
                  CSV
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
