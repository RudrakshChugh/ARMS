import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { Calendar, User, GitBranch, ArrowRight, Check } from 'lucide-react';

export default function Journey() {
  const { stages } = useApp();
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress') return 'accent';
    return 'default';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-48 font-sans flex flex-col gap-sp-48">
      
      {/* Header */}
      <header className="border-b border-border pb-sp-32">
        <span className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">
          Semester Milestones
        </span>
        <h1 className="text-page-title font-semibold text-text-primary mt-sp-8 leading-none tracking-tight">
          Project Journey
        </h1>
        <p className="text-text-secondary text-body mt-sp-12">
          A progression roadmap linking course stages and published deliverables.
        </p>
      </header>

      {/* Horizontal timeline rail (Desktop view) */}
      <div className="hidden lg:flex flex-col gap-sp-24 border border-border bg-bg-secondary p-sp-48 rounded-container overflow-x-auto select-none">
        <div className="flex items-center min-w-[900px] justify-between relative py-sp-8">
          
          {/* Connector Rail line */}
          <div className="absolute left-12 right-12 top-[28px] h-[1px] bg-border z-0" />

          {stages.map((stage, idx) => {
            const isCompleted = stage.status === 'Completed';
            const isInProgress = stage.status === 'In Progress';

            return (
              <div 
                key={stage.id} 
                onClick={() => navigate(`/journey/${stage.id}`)}
                className="flex flex-col items-center gap-sp-12 z-10 cursor-pointer group relative w-28 text-center"
              >
                {/* Milestone circular node */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'border-status-success bg-status-success-surface group-hover:scale-105'
                      : isInProgress
                      ? 'border-accent bg-accent-surface group-hover:scale-105'
                      : 'border-border bg-bg-surface group-hover:border-text-muted group-hover:scale-105'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-status-success" />
                  ) : (
                    <span className={`text-meta font-mono font-semibold ${
                      isInProgress ? 'text-accent' : 'text-text-muted'
                    }`}>
                      0{idx + 1}
                    </span>
                  )}
                </div>

                {/* Milestone details */}
                <div className="flex flex-col items-center">
                  <span className="text-meta font-medium text-text-primary group-hover:text-accent transition-colors duration-150 truncate max-w-[110px] block">
                    {stage.name}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono mt-0.5">
                    {stage.version || 'v0.0'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical list of milestones (Mobile view / fallback) */}
      <div className="lg:hidden flex flex-col gap-sp-24 relative">
        <div className="absolute left-[21px] top-4 bottom-4 w-[1px] bg-border" />
        
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === 'Completed';
          const isInProgress = stage.status === 'In Progress';

          return (
            <div key={stage.id} className="flex gap-sp-16 z-10 text-meta">
              
              {/* Vertical Node */}
              <div 
                onClick={() => navigate(`/journey/${stage.id}`)}
                className={`w-11 h-11 rounded-full flex items-center justify-center border-2 cursor-pointer shrink-0 transition-all duration-200 ${
                  isCompleted ? 'border-status-success bg-status-success-surface' : 
                  isInProgress ? 'border-accent bg-accent-surface' : 
                  'border-border bg-bg-surface'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-status-success" />
                ) : (
                  <span className="font-mono font-semibold text-text-secondary">0{idx + 1}</span>
                )}
              </div>

              {/* Mobile details block */}
              <Card 
                onClick={() => navigate(`/journey/${stage.id}`)}
                className="flex-1 cursor-pointer hover:border-accent/30 transition-all duration-150"
              >
                <CardBody className="!py-sp-16 !px-sp-16 flex items-center justify-between">
                  <div className="flex flex-col gap-sp-4">
                    <div className="flex items-center gap-sp-8">
                      <span className="font-medium text-text-primary text-body">{stage.name}</span>
                      <Badge variant={getStatusVariant(stage.status)}>{stage.status}</Badge>
                    </div>
                    <span className="text-meta text-text-muted">{stage.date} · {stage.owner}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted" />
                </CardBody>
              </Card>

            </div>
          );
        })}
      </div>

      {/* Structured Roadmap Matrix list */}
      <section className="flex flex-col gap-sp-20 border-t border-border-subtle pt-sp-48 text-meta">
        <h3 className="text-meta font-semibold text-text-secondary uppercase tracking-wider">
          Journey Deliverable Inventory
        </h3>
        <div className="border border-border bg-bg-surface rounded-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary border-b border-border font-mono uppercase text-[10px] tracking-wider text-text-muted">
                  <th className="p-sp-16 font-semibold">Milestone</th>
                  <th className="p-sp-16 font-semibold">Status</th>
                  <th className="p-sp-16 font-semibold">Owner</th>
                  <th className="p-sp-16 font-semibold">Release</th>
                  <th className="p-sp-16 font-semibold">Assets Count</th>
                  <th className="p-sp-16 font-semibold">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {stages.map((stage) => (
                  <tr 
                    key={stage.id} 
                    onClick={() => navigate(`/journey/${stage.id}`)}
                    className="hover:bg-bg-secondary transition-colors duration-150 cursor-pointer"
                  >
                    <td className="p-sp-16 font-medium text-text-primary">{stage.name}</td>
                    <td className="p-sp-16">
                      <Badge variant={getStatusVariant(stage.status)}>{stage.status}</Badge>
                    </td>
                    <td className="p-sp-16 text-text-secondary">{stage.owner || 'TBD'}</td>
                    <td className="p-sp-16 font-mono font-semibold text-accent">{stage.version || 'v0.0'}</td>
                    <td className="p-sp-16 text-text-secondary font-mono">{stage.assets?.length || 0} files</td>
                    <td className="p-sp-16 text-text-secondary font-mono">{stage.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
