import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NOVA_BID_CANDIDATES, NOVA_COMPARISON_MATRIX } from '../../data/novaData';
import { Card, CardBody } from './Card';
import { Badge } from './Badge';
import { Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SoftwareGridSection() {
  const { projectIdeas } = useApp();
  const candidates =
    projectIdeas &&
    projectIdeas.length > 0 &&
    projectIdeas.some((p) => p.title === 'NOVA')
      ? projectIdeas
      : NOVA_BID_CANDIDATES;

  const [selectedProjectId, setSelectedProjectId] = useState(
    candidates.find((p) => p.is_primary)?.id || candidates[0]?.id || 'idea-1'
  );

  const activeProject =
    candidates.find((p) => p.id === selectedProjectId) || candidates[0];

  return (
    <div className="font-sans flex flex-col gap-sp-48 min-w-0">
      <div>
        <h3 className="text-card font-semibold text-text-primary tracking-tight">
          Software Bid &amp; Selection Matrix
        </h3>
        <p className="text-meta text-text-secondary mt-sp-4">
          Four candidate projects evaluated in UCS503; NOVA was approved as the primary system.
        </p>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-sp-16">
        {candidates.map((proj) => {
          const isSelected = proj.id === activeProject?.id;
          const isPrimary = proj.is_primary;

          return (
            <Card
              key={proj.id}
              hoverable
              onClick={() => setSelectedProjectId(proj.id)}
              className={`flex flex-col h-full relative transition-all cursor-pointer ${
                isSelected
                  ? 'border-accent ring-2 ring-accent/20'
                  : isPrimary
                  ? 'border-accent/60 bg-accent-surface/30'
                  : ''
              }`}
            >
              {isPrimary && (
                <div className="absolute top-sp-12 right-sp-12 text-accent" title="Approved Primary Project">
                  <Award className="w-4 h-4" />
                </div>
              )}

              <CardBody className="flex flex-col gap-sp-12 flex-1 justify-between text-meta p-sp-16">
                <div className="flex flex-col gap-sp-8">
                  <div className="flex items-center justify-between gap-sp-6 pr-sp-20">
                    <span className="font-mono text-[10px] font-bold text-text-secondary uppercase">
                      {proj.tag}
                    </span>
                    <Badge variant={proj.is_primary ? 'accent' : 'default'}>
                      {proj.is_primary ? 'Approved' : 'Candidate'}
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
            <Card className="border border-accent/30 bg-bg-surface overflow-hidden text-meta">
              <div className="bg-bg-secondary border-b border-border-subtle p-sp-16 flex flex-col sm:flex-row sm:items-center justify-between gap-sp-12">
                <div className="flex flex-col gap-sp-4">
                  <div className="flex items-center gap-sp-8">
                    <span className="font-mono text-[10px] font-bold text-accent uppercase">
                      BID SPECIFICATION
                    </span>
                    {activeProject.is_primary && <Badge variant="accent">Approved System</Badge>}
                  </div>
                  <h4 className="font-semibold text-text-primary text-body">{activeProject.title}</h4>
                </div>
              </div>

              <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-sp-24 p-sp-24 leading-relaxed">
                <div className="flex flex-col gap-sp-16">
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Problem Statement</span>
                    <p className="text-text-secondary">{activeProject.problem}</p>
                  </div>
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Target Users</span>
                    <p className="text-text-secondary">{activeProject.target_audience}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-sp-16">
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Technical Stack</span>
                    <div className="flex flex-wrap gap-sp-8 mt-sp-4">
                      {Array.isArray(activeProject.technical_stack) &&
                        activeProject.technical_stack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-bg-secondary px-sp-8 py-sp-4 border border-border rounded text-[11px] font-mono text-text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-sp-4">
                    <span className="font-bold text-text-primary">Mitigation &amp; Feasibility</span>
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
            Evaluation of candidate proposals against UCS503 feasibility and engineering rigor criteria.
          </p>
        </div>

        <div className="border border-border bg-bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-meta text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary border-b border-border font-mono uppercase tracking-wider text-[10px] text-text-secondary">
                  <th className="p-sp-12 font-semibold min-w-[150px]">Metric</th>
                  {NOVA_COMPARISON_MATRIX.columns.map((col, idx) => (
                    <th key={idx} className="p-sp-12 font-semibold text-center">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {NOVA_COMPARISON_MATRIX.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-bg-secondary/40 transition-colors">
                    <td className="p-sp-12 font-medium text-text-primary">{row.metric}</td>
                    {row.values.map((val, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-sp-12 text-center text-text-secondary ${
                          cIdx === 0 ? 'font-semibold text-accent bg-accent-surface/30' : ''
                        }`}
                      >
                        {val}
                      </td>
                    ))}
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
