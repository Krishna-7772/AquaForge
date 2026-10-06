import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SurveyWorkspace } from './components/SurveyWorkspace';
import { MapView } from './components/MapView';
import { ReportsView } from './components/ReportsView';
import { ModelsView } from './components/ModelsView';
import { Survey } from './types';
import { DEMO_SURVEY } from './demoFixtureData';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isProcessingDemo, setIsProcessingDemo] = useState<boolean>(false);
  const [demoProgress, setDemoProgress] = useState<number>(0);
  const [demoStep, setDemoStep] = useState<string>('');

  const fetchSurveys = async () => {
    try {
      const res = await fetch('/api/surveys');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setSurveys(data);
          return;
        }
      }
    } catch (e) {
      console.warn("API not reachable, activating static demo mode:", e);
    }
    // Fallback to embedded demo survey
    setSurveys([DEMO_SURVEY as any]);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleRunDemo = async () => {
    try {
      setIsProcessingDemo(true);
      setDemoProgress(15);
      setDemoStep("Ingesting synthetic sonar waterfall & navigation metadata...");

      // Simulate client-side incremental progress updates while the backend processes
      const pInterval = setInterval(() => {
        setDemoProgress((prev) => {
          if (prev >= 85) return prev;
          if (prev === 15) setDemoStep("Applying TVG gain normalization, speckle suppression & CLAHE...");
          if (prev === 40) setDemoStep("Running neural detection on acoustic highlight-shadow pairs...");
          if (prev === 65) setDemoStep("Extracting multi-cue acoustic forensic profile & GLCM entropy...");
          return prev + 15;
        });
      }, 500);

      try {
        const res = await fetch('/api/demo/run', { method: 'POST' });
        clearInterval(pInterval);

        if (res.ok) {
          const data = await res.json();
          setDemoProgress(100);
          setDemoStep("Processing complete! Opening workspace...");
          await fetchSurveys();
          setTimeout(() => {
            setIsProcessingDemo(false);
            setDemoProgress(0);
            if (data.survey_id) {
              setSelectedSurveyId(data.survey_id);
              setCurrentTab('workspace');
            }
          }, 800);
          return;
        }
      } catch (err) {
        console.warn("Backend not available, completing demo simulation client-side:", err);
      }

      // Static fallback completion
      clearInterval(pInterval);
      setDemoProgress(100);
      setDemoStep("Processing complete! Opening workspace...");
      setTimeout(() => {
        setIsProcessingDemo(false);
        setDemoProgress(0);
        setSelectedSurveyId(DEMO_SURVEY.id);
        setCurrentTab('workspace');
      }, 800);
    } catch (e) {
      setIsProcessingDemo(false);
      console.error("Error running demo survey:", e);
    }
  };

  const handleSelectSurvey = (surveyId: number) => {
    setSelectedSurveyId(surveyId);
    setCurrentTab('workspace');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'workspace') setSelectedSurveyId(null);
        }}
        onRunDemo={handleRunDemo}
        isProcessingDemo={isProcessingDemo}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            surveys={surveys}
            onSelectSurvey={handleSelectSurvey}
            onRunDemo={handleRunDemo}
            isProcessingDemo={isProcessingDemo}
            demoProgress={demoProgress}
            demoStep={demoStep}
          />
        )}

        {currentTab === 'surveys' && (
          <Dashboard
            surveys={surveys}
            onSelectSurvey={handleSelectSurvey}
            onRunDemo={handleRunDemo}
            isProcessingDemo={isProcessingDemo}
            demoProgress={demoProgress}
            demoStep={demoStep}
          />
        )}

        {currentTab === 'workspace' && selectedSurveyId !== null && (
          <SurveyWorkspace
            surveyId={selectedSurveyId}
            onBack={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'map' && (
          <MapView
            surveys={surveys}
            onSelectSurvey={handleSelectSurvey}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            surveys={surveys}
            onSelectSurvey={handleSelectSurvey}
          />
        )}

        {currentTab === 'models' && (
          <ModelsView />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        <div>AQUAFORGE &bull; Smart India Hackathon SIH26057 &bull; Team PRAYAS</div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          Ministry of Earth Sciences (MoES) &bull; National Institute of Ocean Technology (NIOT) &bull; Operational Prototype v1.0.0
        </div>
      </footer>
    </div>
  );
};

export default App;
