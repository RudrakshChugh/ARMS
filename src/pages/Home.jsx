import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { GitBranch, Clock, User, Award, ArrowUpRight } from 'lucide-react';

export default function Home() {
  const { stages, versions, activities, teamMembers } = useApp();
  const navigate = useNavigate();

  // Find active or completed stages to locate Current Stage
  const currentStage = stages.find(s => s.status === 'In Progress') || stages.find(s => s.status === 'Completed') || stages[0];
  const completedStages = stages.filter(s => s.status === 'Completed');

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-48 font-sans flex flex-col gap-sp-48">
      
      {/* Editorial Page Header */}
      <header className="pb-sp-32 border-b border-border">
        <span className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">
          UCS503 Software Engineering Workspace
        </span>
        <h1 className="text-page-title font-semibold text-text-primary mt-sp-8 leading-none tracking-tight">
          Semester Release Repository
        </h1>
        <p className="text-text-secondary text-body mt-sp-12 max-w-xl leading-relaxed">
          A versioned record tracking development logs, architecture planning documents, code proposal grids, and academic deliverables.
        </p>
      </header>

      {/* Main Documentation Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-sp-48 items-start">
        
        {/* Main Left Content Panel (65%) */}
        <div className="w-full lg:w-[65%] flex flex-col gap-sp-48">
          
          {/* Section: Current Status */}
          <section className="flex flex-col gap-sp-20">
            <h2 className="text-section font-semibold text-text-primary tracking-tight">
              Current Project Stage
            </h2>
            
            {/* Status Card */}
            <div className="border border-border rounded-container bg-bg-surface overflow-hidden text-meta font-sans">
              <div className="bg-bg-secondary px-sp-24 py-sp-12 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-sp-12">
                  <span className="font-mono font-semibold text-accent uppercase tracking-wider text-xs">
                    STAGE 0{stages.indexOf(currentStage) + 1}
                  </span>
                  <span className="text-body font-semibold text-text-primary">
                    {currentStage?.name}
                  </span>
                </div>
                <Badge variant={currentStage?.status === 'Completed' ? 'success' : 'accent'}>
                  {currentStage?.status || 'In Progress'}
                </Badge>
              </div>

              <div className="divide-y divide-border-subtle">
                <div className="grid grid-cols-3 p-sp-16">
                  <span className="text-text-muted flex items-center gap-sp-8"><User className="w-3.5 h-3.5" /> Stage Owner</span>
                  <span className="col-span-2 font-medium text-text-primary">{currentStage?.owner || 'TBD'}</span>
                </div>
                <div className="grid grid-cols-3 p-sp-16">
                  <span className="text-text-muted flex items-center gap-sp-8"><Clock className="w-3.5 h-3.5" /> Published Target</span>
                  <span className="col-span-2 font-medium text-text-primary">{currentStage?.date}</span>
                </div>
                <div className="grid grid-cols-3 p-sp-16">
                  <span className="text-text-muted flex items-center gap-sp-8"><GitBranch className="w-3.5 h-3.5" /> Release Branch</span>
                  <span className="col-span-2 font-mono font-semibold text-accent">{currentStage?.version || 'v0.0'}</span>
                </div>
                <div className="p-sp-16 flex flex-col gap-sp-8">
                  <span className="text-text-muted block">Summary Description</span>
                  <p className="text-text-secondary leading-relaxed font-sans">
                    {currentStage?.summary || 'Plan and configure initial project repository details.'}
                  </p>
                </div>
              </div>
              
              {/* Navigate Detail button */}
              <div className="bg-bg-secondary p-sp-16 border-t border-border-subtle flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/journey/${currentStage?.id}`)}
                  className="!h-8 !px-sp-12 !text-meta"
                >
                  View Release Manifest
                </Button>
              </div>
            </div>
          </section>

          {/* Section: Project Journey Roadmap */}
          <section className="flex flex-col gap-sp-20 border-t border-border-subtle pt-sp-48">
            <div className="flex items-center justify-between">
              <h2 className="text-section font-semibold text-text-primary tracking-tight">
                Project Journey Map
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/journey')}
                className="!text-meta !text-accent !h-8 !px-0"
                icon={ArrowUpRight}
                iconPosition="right"
              >
                Expand Roadmap
              </Button>
            </div>
            
            {/* Journey Rail List */}
            <div className="flex flex-col border border-border rounded-container bg-bg-surface overflow-hidden">
              {stages.map((stage, idx) => {
                const isCompleted = stage.status === 'Completed';
                const isInProgress = stage.status === 'In Progress';

                return (
                  <div 
                    key={stage.id}
                    onClick={() => navigate(`/journey/${stage.id}`)}
                    className="flex items-center justify-between py-sp-12 px-sp-16 border-b border-border-subtle last:border-b-0 hover:bg-bg-secondary transition-colors duration-150 cursor-pointer group select-none text-meta"
                  >
                    <div className="flex items-center gap-sp-12">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-mono ${
                        isCompleted ? 'bg-status-success-surface border-status-success text-status-success' : 
                        isInProgress ? 'bg-accent-surface border-accent text-accent font-bold' : 
                        'bg-bg-surface border-border text-text-muted'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="font-medium text-text-primary group-hover:text-accent transition-colors duration-150">
                        {stage.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-sp-12 text-text-muted text-right">
                      <span className="font-mono">{stage.version || 'v0.0'}</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline">{stage.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Sidebar Section (35%) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-sp-40 border-t lg:border-t-0 lg:border-l border-border-subtle pt-sp-48 lg:pt-0 lg:pl-sp-48 shrink-0">
          
          {/* Section: Recent Releases */}
          <div className="flex flex-col gap-sp-16">
            <h3 className="text-meta font-semibold text-text-secondary uppercase tracking-wider">
              Recent Releases
            </h3>
            <div className="flex flex-col gap-sp-12 divide-y divide-border-subtle">
              {versions.slice(0, 3).map((ver) => (
                <div key={ver.version} className="pt-sp-12 first:pt-0 flex flex-col gap-sp-4 text-meta">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-text-primary hover:text-accent cursor-pointer transition-colors duration-150" onClick={() => navigate(`/versions`)}>
                      {ver.version}
                    </span>
                    <span className="text-text-muted text-xs">{ver.date}</span>
                  </div>
                  <p className="text-text-secondary line-clamp-2 leading-relaxed">
                    {ver.changeSummary}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-sp-4 pt-sp-8 border-t border-border-subtle flex justify-end">
              <Button
                variant="ghost"
                onClick={() => navigate('/versions')}
                className="!text-meta !text-accent !h-sp-24 !px-0"
                icon={ArrowUpRight}
                iconPosition="right"
              >
                View full version history
              </Button>
            </div>
          </div>

          {/* Section: Recent Activities */}
          <div className="flex flex-col gap-sp-16 border-t border-border-subtle pt-sp-32">
            <h3 className="text-meta font-semibold text-text-secondary uppercase tracking-wider">
              Workspace Activity
            </h3>
            <div className="flex flex-col gap-sp-12 text-meta text-text-secondary">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-sp-12 py-1 border-b border-border-subtle last:border-b-0 pb-sp-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-text-primary leading-normal">{act.action}</span>
                    <span className="text-[10px] text-text-muted mt-0.5">{act.person} · {act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Team Directory */}
          <div className="flex flex-col gap-sp-16 border-t border-border-subtle pt-sp-32">
            <h3 className="text-meta font-semibold text-text-secondary uppercase tracking-wider">
              Team Accounts
            </h3>
            <div className="flex flex-col gap-sp-12 text-meta">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-sp-12">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-12px shrink-0 select-none"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-text-primary">{member.name}</span>
                    <span className="text-text-muted text-xs">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
