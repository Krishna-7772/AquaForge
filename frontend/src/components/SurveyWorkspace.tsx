import React, { useState, useEffect } from 'react';
import { 
  Compass, Eye, CheckCircle2, AlertTriangle, HelpCircle, 
  MapPin, Shield, Layers, FileDown, ArrowLeft, RefreshCw, ZoomIn, ZoomOut, Check, X, Tag
} from 'lucide-react';
import { Contact, Survey } from '../types';
import { DEMO_SURVEY, DEMO_CONTACTS } from '../demoFixtureData';

interface SurveyWorkspaceProps {
  surveyId: number;
  onBack: () => void;
}

export const SurveyWorkspace: React.FC<SurveyWorkspaceProps> = ({ surveyId, onBack }) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreprocessed, setShowPreprocessed] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Review state
  const [reviewerName, setReviewerName] = useState('Hydrographic Analyst');
  const [reclassifiedClass, setReclassifiedClass] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const sRes = await fetch(`/api/surveys/${surveyId}`);
      if (sRes.ok) {
        const sData = await sRes.json();
        setSurvey(sData);
      } else {
        setSurvey(DEMO_SURVEY as any);
      }

      const cRes = await fetch(`/api/surveys/${surveyId}/contacts`);
      if (cRes.ok) {
        const cData = await cRes.json();
        setContacts(cData);
        if (cData.length > 0) setSelectedContact(cData[0]);
      } else {
        setContacts(DEMO_CONTACTS as any);
        if (DEMO_CONTACTS.length > 0) setSelectedContact(DEMO_CONTACTS[0] as any);
      }
    } catch (err) {
      console.warn("API not reachable, activating embedded demo fixtures:", err);
      setSurvey(DEMO_SURVEY as any);
      setContacts(DEMO_CONTACTS as any);
      if (DEMO_CONTACTS.length > 0) setSelectedContact(DEMO_CONTACTS[0] as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, [surveyId]);

  const resolveAsset = (path: string | undefined | null) => {
    if (!path) return '';
    let clean = path.replace(/\\/g, '/');
    if (clean.startsWith('/')) {
      clean = clean.substring(1);
    }
    return './' + clean;
  };

  const handleReview = async (decision: string) => {
    if (!selectedContact) return;
    try {
      const res = await fetch(`/api/contacts/${selectedContact.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reviewer_name: reviewerName,
          reclassified_class: reclassifiedClass || undefined,
          notes: reviewNotes
        })
      });
      if (res.ok) {
        setReviewSuccessMsg(`Review recorded: ${decision}`);
        setTimeout(() => setReviewSuccessMsg(''), 4000);
        // Refresh contact list
        const cRes = await fetch(`/api/surveys/${surveyId}/contacts`);
        if (cRes.ok) {
          const cData = await cRes.json();
          setContacts(cData);
          const updated = cData.find((c: Contact) => c.id === selectedContact.id);
          if (updated) setSelectedContact(updated);
        }
        return;
      }
    } catch (err) {
      console.warn("Backend unavailable, applying in-memory review update:", err);
    }

    // In-memory fallback for static deployment
    const updatedReview = {
      id: Date.now(),
      contact_id: selectedContact.id,
      decision,
      reviewer_name: reviewerName || "Lead Hydrographer",
      reclassified_class: reclassifiedClass || null,
      notes: reviewNotes || "Operator confirmation recorded in offline/static workstation mode.",
      reviewed_at: new Date().toISOString()
    };
    const updatedContact = {
      ...selectedContact,
      review: updatedReview,
      review_status: decision,
      operator_confirmed_class: reclassifiedClass || (decision === 'CONFIRMED' ? selectedContact.detected_class : null),
      detected_class: reclassifiedClass || selectedContact.detected_class
    };
    setContacts(prev => prev.map(c => c.id === selectedContact.id ? updatedContact : c));
    setSelectedContact(updatedContact as any);
    setReviewSuccessMsg(`Review recorded: ${decision}`);
    setTimeout(() => setReviewSuccessMsg(''), 4000);
  };

  const handleExport = (format: 'geojson' | 'csv') => {
    if (!survey) return;
    if (format === 'geojson') {
      const geojson = {
        type: "FeatureCollection",
        survey_code: survey.survey_code,
        survey_name: survey.name,
        features: contacts.map(c => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [c.geolocation?.longitude || 80.2707, c.geolocation?.latitude || 13.0827]
          },
          properties: {
            contact_code: c.contact_code,
            detected_class: c.detected_class,
            priority_level: c.priority_level,
            confidence: c.calibrated_confidence,
            uncertainty_m: c.geolocation?.position_uncertainty_m || 8.0,
            acoustic_hypothesis: c.acoustic_hypothesis
          }
        }))
      };
      const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${survey.survey_code}_contacts.geojson`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = "contact_code,detected_class,priority_level,confidence,uncertainty_m,latitude,longitude,hypothesis\n";
      const rows = contacts.map(c => 
        `"${c.contact_code}","${c.detected_class}","${c.priority_level}",${c.calibrated_confidence},${c.geolocation?.position_uncertainty_m || 8.0},${c.geolocation?.latitude || 13.0827},${c.geolocation?.longitude || 80.2707},"${c.acoustic_hypothesis}"`
      ).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${survey.survey_code}_contacts.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (priorityFilter === 'ALL') return true;
    if (priorityFilter === 'HIGH') return c.priority_level === 'HIGH';
    if (priorityFilter === 'REVIEW') return c.priority_level === 'REVIEW' || c.is_novel_anomaly;
    if (priorityFilter === 'UNREVIEWED') return c.review_status === 'UNREVIEWED';
    return true;
  });

  if (loading || !survey) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#1E3E62]" />
          <span className="text-sm font-medium text-gray-600">Loading hydrographic acoustic survey...</span>
        </div>
      </div>
    );
  }

  const primaryFile = (survey as any).files?.[0];
  const waterfallUrl = primaryFile
    ? resolveAsset(showPreprocessed && primaryFile.preprocessed_url ? primaryFile.preprocessed_url : `artifacts/uploads/${primaryFile.filename}`)
    : null;

  return (
    <div className="space-y-4">
      
      {/* Workspace Header Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-extrabold text-lg text-gray-900">{survey.survey_code}</span>
              <span className="text-sm text-gray-500">&bull;</span>
              <span className="text-sm font-semibold text-gray-700">{survey.name}</span>
              {survey.is_demo && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Synthetic Demo Fixture
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Platform: {survey.vessel_name} &bull; Sensor: {survey.sensor_model} ({survey.frequency_khz} kHz) &bull; {contacts.length} Contacts
            </div>
          </div>
        </div>

        {/* Export Toolbar */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleExport('geojson')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 text-gray-800 transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 mr-1 text-gray-600" />
            <span>GeoJSON</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 text-gray-800 transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 mr-1 text-gray-600" />
            <span>CSV</span>
          </button>
          <a
            href="./report_demo.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#1E3E62] hover:bg-[#0B192C] text-white transition shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            <span>Official Report (HTML)</span>
          </a>
        </div>
      </div>

      {/* Main 3-Pane Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT PANE: Sonar Waterfall Viewer (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg flex flex-col shadow-xs overflow-hidden h-[760px]">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
              Sonar Waterfall Strip
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setShowPreprocessed(!showPreprocessed)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase transition ${
                  showPreprocessed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                title="Toggle CLAHE + TVG Sonar Preprocessing"
              >
                {showPreprocessed ? 'Preprocessed' : 'Raw'}
              </button>
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase transition ${
                  showBoxes ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                title="Toggle Detection Boxes"
              >
                Boxes
              </button>
            </div>
          </div>

          {/* Sonar Strip Scrollable Area with Interactive Overlay */}
          <div className="flex-1 overflow-auto bg-[#050B14] relative p-2 flex justify-center">
            {waterfallUrl ? (
              <div 
                className="relative inline-block border border-gray-800"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
              >
                <img 
                  src={waterfallUrl} 
                  alt="Sonar Waterfall" 
                  className="max-w-full h-auto block select-none"
                />

                {/* Nadir Water Column Indicator Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-r border-dashed border-cyan-500/40 pointer-events-none" />

                {/* Overlaid Contact Bounding Boxes */}
                {showBoxes && contacts.map((c) => {
                  const det = c.detection;
                  if (!det) return null;
                  const isSelected = selectedContact?.id === c.id;
                  const borderCol = c.priority_level === 'HIGH' ? 'border-red-500 bg-red-500/10' :
                                    c.is_novel_anomaly ? 'border-purple-500 bg-purple-500/10' :
                                    c.priority_level === 'MEDIUM' ? 'border-amber-500 bg-amber-500/10' :
                                    'border-teal-500 bg-teal-500/10';

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      className={`absolute cursor-pointer border-2 transition-all ${borderCol} ${
                        isSelected ? 'ring-2 ring-white z-20 scale-105' : 'opacity-85 hover:opacity-100 z-10'
                      }`}
                      style={{
                        left: `${det.x}px`,
                        top: `${det.y}px`,
                        width: `${det.width}px`,
                        height: `${det.height}px`
                      }}
                    >
                      <span className="absolute -top-5 left-0 bg-gray-900/90 text-white text-[9px] font-mono px-1 py-0.2 rounded whitespace-nowrap shadow-xs">
                        {c.contact_code} ({Math.round(c.calibrated_confidence * 100)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-400 text-xs flex items-center justify-center h-full">
                No sonar image available
              </div>
            )}
          </div>

          {/* Zoom & Channel Info Footer */}
          <div className="p-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-[11px] text-gray-500">
            <span className="font-mono">PORT &larr; NADIR &rarr; STARBOARD</span>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.2))} 
                className="p-1 hover:bg-gray-200 rounded"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs">{Math.round(zoomLevel * 100)}%</span>
              <button 
                onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.2))} 
                className="p-1 hover:bg-gray-200 rounded"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CENTER PANE: Explainable Evidence & Acoustic Forensics (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg flex flex-col shadow-xs overflow-y-auto h-[760px] p-5 space-y-5">
          {selectedContact ? (
            <>
              {/* Top Contact Identity Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-extrabold font-mono text-gray-900">
                        {selectedContact.contact_code}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        selectedContact.priority_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                        selectedContact.priority_level === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        selectedContact.priority_level === 'LOW' ? 'bg-teal-100 text-teal-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedContact.priority_level} Priority
                      </span>
                      {selectedContact.is_novel_anomaly && (
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Novel Contact
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Acoustic Pattern: <strong className="text-gray-800">{selectedContact.acoustic_hypothesis}</strong>
                    </div>
                  </div>

                  {/* Operator Review Status Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    selectedContact.review_status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                    selectedContact.review_status === 'RECLASSIFIED' ? 'bg-blue-100 text-blue-800' :
                    selectedContact.review_status === 'FALSE_POSITIVE' ? 'bg-gray-200 text-gray-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedContact.review_status}
                  </span>
                </div>
              </div>

              {/* High-Resolution Contact Patch Crop */}
              <div className="bg-gray-900 rounded-lg p-3 flex flex-col items-center justify-center">
                {selectedContact.crop_path ? (
                  <img 
                    src={resolveAsset(selectedContact.crop_path)} 
                    alt={selectedContact.contact_code}
                    className="max-h-48 rounded object-contain border border-gray-700" 
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-500 text-xs">
                    No crop available
                  </div>
                )}
                <div className="text-[11px] text-gray-400 mt-2 font-mono flex justify-between w-full px-2">
                  <span>Slant Range: {selectedContact.geolocation?.slant_range_m?.toFixed(1) || '0.0'}m</span>
                  <span>Side: {selectedContact.geolocation?.sonar_side || 'STARBOARD'}</span>
                  <span>Est Relief: ~{selectedContact.fingerprint?.shadow?.estimated_height_m?.toFixed(2) || '0.0'}m</span>
                </div>
              </div>

              {/* Classification Triad: Detected vs Hypothesis vs Operator */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200 text-center">
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-500">Detected Class</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">{selectedContact.detected_class}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Score: {selectedContact.model_score.toFixed(2)}
                  </div>
                </div>
                <div className="border-x border-gray-200 px-2">
                  <div className="text-[10px] font-bold uppercase text-gray-500">Acoustic Hypothesis</div>
                  <div className="text-xs font-bold text-blue-900 mt-0.5">{selectedContact.acoustic_hypothesis}</div>
                  <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                    Calibrated: {selectedContact.calibrated_confidence.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-500">Operator Review</div>
                  <div className="text-xs font-bold text-emerald-800 mt-0.5">
                    {selectedContact.operator_confirmed_class || 'Pending'}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{selectedContact.review_status}</div>
                </div>
              </div>

              {/* Multi-Cue Acoustic Forensic Radar/Stats */}
              {selectedContact.fingerprint && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase text-gray-800 tracking-wider flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
                    Acoustic Forensic Fingerprint
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                      <div className="text-[10px] font-semibold text-gray-500 uppercase">Echo Highlight Contrast</div>
                      <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                        {selectedContact.fingerprint.intensity.echo_contrast}x ambient
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Strength: {selectedContact.fingerprint.intensity.highlight_strength}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                      <div className="text-[10px] font-semibold text-gray-500 uppercase">Acoustic Shadow</div>
                      <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                        {selectedContact.fingerprint.shadow.shadow_length_m}m length
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Signature: {selectedContact.fingerprint.shadow.shadow_signature}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                      <div className="text-[10px] font-semibold text-gray-500 uppercase">GLCM Texture Entropy</div>
                      <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                        {selectedContact.fingerprint.texture.glcm_entropy}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Complexity: {selectedContact.fingerprint.texture.texture_complexity}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                      <div className="text-[10px] font-semibold text-gray-500 uppercase">Geometry & Compactness</div>
                      <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                        {selectedContact.fingerprint.geometry.physical_length_m}m x {selectedContact.fingerprint.geometry.physical_width_m}m
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Aspect: {selectedContact.fingerprint.geometry.aspect_ratio} &bull; {selectedContact.fingerprint.geometry.geometric_regularity}
                      </div>
                    </div>
                  </div>

                  {/* Explainable Evidence Bullets */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded p-3 text-xs">
                    <div className="font-bold text-blue-900 mb-1.5 uppercase text-[10px] tracking-wider">
                      Why Flagged (Acoustic Evidence)
                    </div>
                    <ul className="space-y-1 text-gray-700">
                      {selectedContact.fingerprint.evidence_bullets?.map((b, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-700 mr-1.5 font-bold">&bull;</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Next-Best-Scan Recommendation Card */}
              {selectedContact.recommendation && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                      Recommended Next Survey Action
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      {selectedContact.recommendation.urgency}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-amber-950">
                    {selectedContact.recommendation.recommended_action}
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    {selectedContact.recommendation.detailed_instruction}
                  </p>
                </div>
              )}

              {/* Operator Review Decision Form */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="text-xs font-bold uppercase text-gray-800 tracking-wider">
                  Human-in-the-Loop Analyst Verification
                </div>
                
                {reviewSuccessMsg && (
                  <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">
                    {reviewSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Analyst Name</label>
                    <input 
                      type="text" 
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Reclassify If Needed</label>
                    <select
                      value={reclassifiedClass}
                      onChange={(e) => setReclassifiedClass(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="">Keep Detected ({selectedContact.detected_class})</option>
                      <option value="DERELICT_GEAR">DERELICT_GEAR (Ghost Net/Trap)</option>
                      <option value="SHIPWRECK">SHIPWRECK (Vessel Hull)</option>
                      <option value="PIPELINE">PIPELINE (Linear Conduit)</option>
                      <option value="CYLINDRICAL_OBJECT">CYLINDRICAL_OBJECT (Drum)</option>
                      <option value="NATURAL_FORMATION">NATURAL_FORMATION (Rock)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    placeholder="Enter hydrographic audit comments..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleReview('ACCEPTED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition flex items-center"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Accept Detection
                  </button>
                  <button
                    onClick={() => handleReview('RECLASSIFIED')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition flex items-center"
                  >
                    <Tag className="w-3.5 h-3.5 mr-1" />
                    Reclassify
                  </button>
                  <button
                    onClick={() => handleReview('FALSE_POSITIVE')}
                    className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded transition flex items-center"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    False Alarm
                  </button>
                  <button
                    onClick={() => handleReview('FOLLOW_UP_REQUIRED')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded transition flex items-center"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Follow-Up
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              Select a contact to view acoustic evidence
            </div>
          )}
        </div>

        {/* RIGHT PANE: Priority Queue & Geolocation (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg flex flex-col shadow-xs overflow-hidden h-[760px]">
          
          {/* Priority Filter Header */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Contact Priority Queue
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              {['ALL', 'HIGH', 'REVIEW', 'UNREVIEWED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriorityFilter(filter)}
                  className={`py-1 rounded font-bold transition text-center ${
                    priorityFilter === filter 
                      ? 'bg-[#1E3E62] text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Cards List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredContacts.map((c) => {
              const isSelected = selectedContact?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className={`p-3 cursor-pointer transition ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-gray-900">{c.contact_code}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      c.priority_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                      c.priority_level === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                      c.priority_level === 'LOW' ? 'bg-teal-100 text-teal-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {c.priority_level}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-gray-800 mt-1">{c.detected_class}</div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                    <span>Conf: {Math.round(c.calibrated_confidence * 100)}%</span>
                    <span>{c.persistence_count} pings</span>
                    <span className="font-semibold text-gray-700">{c.review_status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Geolocation Telemetry Footer */}
          {selectedContact && selectedContact.geolocation && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs">
              <div className="font-bold text-gray-800 uppercase text-[10px] mb-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-blue-700" />
                Target Geolocation (WGS-84)
              </div>
              {selectedContact.geolocation.has_metadata && selectedContact.geolocation.latitude ? (
                <div className="font-mono text-[11px] space-y-0.5 text-gray-700">
                  <div>LAT: {selectedContact.geolocation.latitude.toFixed(6)}° N</div>
                  <div>LON: {selectedContact.geolocation.longitude?.toFixed(6)}° E</div>
                  <div className="text-red-700 font-bold">
                    Error Envelope: &plusmn;{selectedContact.geolocation.position_uncertainty_m}m
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-[11px] italic">
                  Navigation metadata unavailable in sonar file
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
