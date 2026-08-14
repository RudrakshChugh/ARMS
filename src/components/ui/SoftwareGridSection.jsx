import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardBody } from './Card';
import { Badge } from './Badge';
import { Check, ShieldAlert, Zap, Award, Target, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SoftwareGridSection() {
  const { projectIdeas, responsibilityMatrix } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState('idea-3'); // Default to CollabSync (idea-3)

  // Pre-configured comparison columns and metric rows
  const comparisonMatrix = {
    columns: ["CollabSync (Selected)", "LabLock", "PeerCode", "GradeWise"],
    rows: [
      { metric: "Core Technical Complexity", values: ["High (Real-time Websockets + Sandbox compiler)", "Medium (Hardware IoT scheduling integration)", "Medium (Docker compiler environment)", "Low (Relational database queries)"] },
      { metric: "Course Validation Feasibility", values: ["Excellent (Easy local peer demonstration)", "Hard (Requires RFID lock readers)", "Medium (Requires TA review workflows)", "Medium (Requires historical grading pools)"] },
      { metric: "Course Curriculum Relevance", values: ["High (System design, sync architecture, multi-user)", "Medium (Web portal + hardware scheduling)", "High (Developer audit reviews)", "Low (Simple data CRUD sheet)"] },
      { metric: "Deployment Verification Risk", values: ["Low (Standard hosting containers)", "High (Physical lab installation)", "Medium (Docker container execution safety)", "Low (Static web hosting details)"] }
    ]
  };

  const activeProject = projectIdeas.find(p => p.id === selectedProjectId);

  const getFeasibilityVariant = (val) => {
    if (val === 'High' || val === 'Excellent') return 'success';
    if (val === 'Medium') return 'warning';
    return 'error';
  };

  const getRiskVariant = (val) => {
    if (val === 'Low') return 'success';
    if (val === 'Medium') return 'warning';
    return 'error';
  };

  return (
    <div className="font-sans flex flex-col gap-sp-48 min-w-0">
      
      {/* Editorial Headline */}
      <div>
        <h3 className="text-card font-semibold text-text-primary tracking-tight">Software Grid Matrix</h3>
        <p className="text-meta text-text-secondary mt-sp-4">
          Four course projects evaluated. One pursuing primary system focus.
        </p>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-sp-16">
        {projectIdeas.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          const isSelectedNo1 = proj.is_primary;

          return (
            <Card
              key={proj.id}
              hoverable
              onClick={() => setSelectedProjectId(proj.id)}
              className={`flex flex-col h-full relative transition-all cursor-pointer ${
                isSelected 
                  ? 'border-accent-primary ring-2 ring-accent-light' 
                  : isSelectedNo1
                  ? 'border-accent-primary/60 bg-accent-light/5'
                  : ''
              }`}
            >
              {isSelectedNo1 && (
                <div className="absolute top-sp-12 right-sp-12 text-accent-primary" title="Selected Primary Project">
                  <Award className="w-4 h-4 fill-accent-light" />
                </div>
              )}
              
              <CardBody className="flex flex-col gap-sp-12 flex-1 justify-between text-meta p-sp-16">
                <div className="flex flex-col gap-sp-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-text-secondary uppercase">
                      {proj.tag}
                    </span>
                    <Badge variant={proj.is_primary ? 'accent' : 'default'}>
                      {proj.is_primary ? 'Selected' : 'Candidate'}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-text-primary mt-sp-4 leading-snug">
                    {proj.title}
                  </h4>
                  
                  <p className="text-[11px] text-text-secondary line-clamp-3 leading-normal">
                    {proj.subtitle}
                  </p>
                </div>

                <div className="border-t border-border-subtle pt-sp-12 mt-sp-12 flex flex-col gap-sp-4">
                  <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Expanded project details container */}
      <AnimatePresence mode="wait">
        {activeProject && (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Card className="border border-accent-primary/30 shadow-subtle bg-white overflow-hidden text-meta">
              
              <div className="bg-bg-elevated border-b border-border-subtle p-sp-16 flex flex-col sm:flex-row sm:items-center justify-between gap-sp-12">
                <div className="flex flex-col gap-sp-2">
                  <div className="flex items-center gap-sp-8">
                    <span className="font-mono text-[10px] font-bold text-accent-primary uppercase">EVALUATION SPECIFICATION</span>
                    {activeProject.is_primary && <Badge variant="accent">Pursuing Project</Badge>}
                  </div>
                  <h4 className="font-semibold text-text-primary text-body">{activeProject.title}</h4>
                </div>
              </div>

              <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-sp-24 p-sp-24 border-b border-border-subtle leading-relaxed">
                <div className="flex flex-col gap-sp-16">
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Problem Statement</span>
                    <p className="text-text-secondary">{activeProject.problem}</p>
                  </div>
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Target Audience</span>
                    <p className="text-text-secondary">{activeProject.target_audience}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-sp-16">
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Technical Stack Stack</span>
                    <div className="flex flex-wrap gap-sp-8 mt-sp-4">
                      {activeProject.technical_stack && JSON.parse(JSON.stringify(activeProject.technical_stack)).map((tech, idx) => (
                        <span key={idx} className="bg-bg-secondary px-sp-8 py-sp-4 border border-border-default rounded text-[11px] font-mono text-text-primary">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Mitigation Fallback</span>
                    <p className="text-text-secondary">{activeProject.risk_mitigation}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Matrix */}
      <div className="flex flex-col gap-sp-16 border-t border-border-subtle pt-sp-32">
        <div>
          <h4 className="font-semibold text-text-primary text-body">Comparison Matrix Table</h4>
          <p className="text-meta text-text-secondary mt-sp-4">
            Granular rating evaluating ideas against course constraints.
          </p>
        </div>

        <div className="border border-border-default bg-white rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-meta text-left border-collapse">
              <thead>
                <tr className="bg-bg-elevated border-b border-border-default font-mono uppercase tracking-wider text-[10px] text-text-secondary">
                  <th className="p-sp-12 font-semibold min-w-[150px]">Metric</th>
                  {comparisonMatrix.columns.map((col, idx) => (
                    <th key={idx} className="p-sp-12 font-semibold text-center">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {comparisonMatrix.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-bg-main/35 transition-colors">
                    <td className="p-sp-12 font-medium text-text-primary">{row.metric}</td>
                    {row.values.map((val, cIdx) => {
                      const isNo1Column = cIdx === 0;
                      return (
                        <td 
                          key={cIdx} 
                          className={`p-sp-12 text-center text-text-secondary ${
                            isNo1Column ? 'font-semibold text-accent-primary bg-accent-light/10' : ''
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
