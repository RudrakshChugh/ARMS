import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GitCommit, Plus, Minus, Edit, ChevronDown, ChevronRight, HelpCircle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Versions() {
  const { versions, stages } = useApp();
  
  // States for timeline collapses
  const [expandedVer, setExpandedVer] = useState("v1.2");

  // States for comparisons
  const [verA, setVerA] = useState("v1.2");
  const [verB, setVerB] = useState("v1.0");

  const getMilestoneName = (ver) => {
    const matched = stages.find(s => s.version === ver);
    return matched ? matched.name : 'Staging / Development Release';
  };

  // Compute Delta between verA and verB
  // It combines added, removed, and modified changes between the two version metrics
  const getComparisonDiff = () => {
    // Collect version details
    const vList = [...versions].reverse(); // oldest first
    const idxA = vList.findIndex(v => v.version === verA);
    const idxB = vList.findIndex(v => v.version === verB);

    if (idxA === -1 || idxB === -1 || idxA === idxB) {
      return { added: [], removed: [], modified: [] };
    }

    // Traverse from oldest selected index to newest selected index
    const startIdx = Math.min(idxA, idxB);
    const endIdx = Math.max(idxA, idxB);
    
    const targetVersions = vList.slice(startIdx + 1, endIdx + 1);

    const diff = {
      added: [],
      removed: [],
      modified: []
    };

    targetVersions.forEach(v => {
      diff.added.push(...(v.added || []));
      diff.removed.push(...(v.removed || []));
      diff.modified.push(...(v.modified || []));
    });

    return diff;
  };

  const diffResult = getComparisonDiff();
  const hasChanges = diffResult.added.length > 0 || diffResult.removed.length > 0 || diffResult.modified.length > 0;

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-32 lg:px-sp-48 py-sp-64 font-sans flex flex-col gap-sp-64">
      
      {/* Header */}
      <header className="border-b border-border pb-sp-32">
        <span className="text-[11px] font-mono font-semibold tracking-widest text-accent uppercase">
          Workspace Auditing
        </span>
        <h1 className="text-page-title font-semibold text-text-primary mt-sp-8 leading-none tracking-tight">
          Release History
        </h1>
        <p className="text-text-secondary text-body mt-sp-12">
          Every change leaves a trace. Track baseline spec migrations and system increments.
        </p>
      </header>

      {/* Grid Layout: Main History Timeline Left (65%), Comparison Workspace Right (35%) */}
      <div className="flex flex-col lg:flex-row gap-sp-48 items-start">
        
        {/* Release History Timeline List (65%) */}
        <div className="w-full lg:w-[65%] flex flex-col gap-sp-32 relative pl-sp-24 border-l border-border-subtle ml-sp-8">
          
          {versions.map((ver, idx) => {
            const isExpanded = ver.version === expandedVer;
            const milestone = getMilestoneName(ver.version);

            return (
              <div key={ver.version} className="relative flex flex-col gap-sp-12 text-meta">
                
                {/* Timeline node dot */}
                <div 
                  onClick={() => setExpandedVer(ver.version)}
                  className={`absolute -left-[33px] top-1.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                    isExpanded ? 'border-accent bg-bg-surface' : 'border-border bg-bg-surface hover:border-text-secondary'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-accent' : 'bg-border'}`} />
                </div>

                {/* Entry Header */}
                <div 
                  onClick={() => setExpandedVer(ver.version)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-sp-8 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-sp-12">
                    <span className="font-mono text-body font-medium text-text-primary group-hover:text-accent transition-colors duration-150">
                      {ver.version}
                    </span>
                    <Badge variant={idx === 0 ? 'accent' : 'default'}>
                      {idx === 0 ? 'Latest' : 'Stable'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-sp-12 text-text-muted font-mono text-[11px]">
                    <span>{ver.date}</span>
                    <span>•</span>
                    <span>{ver.author}</span>
                  </div>
                </div>

                {/* Summary text */}
                <p className="text-text-secondary text-body leading-relaxed max-w-xl">
                  {ver.changeSummary}
                </p>

                {/* Meta details list */}
                <div className="flex flex-wrap gap-sp-16 text-text-muted mt-sp-4">
                  <div className="flex items-center gap-sp-4">
                    <GitCommit className="w-3.5 h-3.5" /> 
                    <span>commit <kbd className="bg-bg-secondary px-1 border border-border rounded font-mono text-[11px] text-text-primary">{ver.commit}</kbd></span>
                  </div>
                  <div className="flex items-center gap-sp-4">
                    <Layers className="w-3.5 h-3.5" /> 
                    <span>Milestone: <strong className="text-text-secondary font-medium">{milestone}</strong></span>
                  </div>
                </div>

                {/* Expand / Collapse toggle trigger */}
                <div className="mt-sp-8">
                  <button 
                    onClick={() => setExpandedVer(isExpanded ? null : ver.version)}
                    className="flex items-center gap-sp-4 text-accent font-medium hover:text-accent-hover transition-colors duration-150 cursor-pointer select-none"
                  >
                    {isExpanded ? (
                      <><span>Hide Details</span><ChevronDown className="w-3.5 h-3.5" /></>
                    ) : (
                      <><span>View Files Changed ({ver.filesChanged?.length || 0})</span><ChevronRight className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>

                {/* Expanded Details Section lists */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden bg-bg-secondary border border-border rounded-container px-sp-16 py-sp-16 flex flex-col gap-sp-12 mt-sp-8"
                    >
                      {/* Files list */}
                      <div className="flex flex-col gap-sp-4">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-text-secondary">Files Changed</span>
                        <ul className="flex flex-col gap-sp-4 font-mono text-[11px] text-text-secondary">
                          {ver.filesChanged?.map(file => (
                            <li key={file} className="truncate">• {file}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Split details if present */}
                      {(ver.added?.length > 0 || ver.removed?.length > 0 || ver.modified?.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sp-12 border-t border-border-subtle pt-sp-12 mt-sp-8">
                          
                          {/* Added */}
                          <div className="flex flex-col gap-sp-8">
                            <span className="flex items-center gap-sp-4 text-status-success font-semibold uppercase tracking-wider text-[9px]"><Plus className="w-3 h-3" /> Added</span>
                            <ul className="flex flex-col gap-sp-4 text-text-secondary leading-normal">
                              {ver.added?.map((a, i) => <li key={i}>{a}</li>)}
                              {ver.added?.length === 0 && <li className="text-text-muted italic">None</li>}
                            </ul>
                          </div>

                          {/* Modified */}
                          <div className="flex flex-col gap-sp-8">
                            <span className="flex items-center gap-sp-4 text-status-warning font-semibold uppercase tracking-wider text-[9px]"><Edit className="w-3 h-3" /> Modified</span>
                            <ul className="flex flex-col gap-sp-4 text-text-secondary leading-normal">
                              {ver.modified?.map((m, i) => <li key={i}>{m}</li>)}
                              {ver.modified?.length === 0 && <li className="text-text-muted italic">None</li>}
                            </ul>
                          </div>

                          {/* Removed */}
                          <div className="flex flex-col gap-sp-8">
                            <span className="flex items-center gap-sp-4 text-status-error font-semibold uppercase tracking-wider text-[9px]"><Minus className="w-3 h-3" /> Removed</span>
                            <ul className="flex flex-col gap-sp-4 text-text-secondary leading-normal">
                              {ver.removed?.map((r, i) => <li key={i}>{r}</li>)}
                              {ver.removed?.length === 0 && <li className="text-text-muted italic">None</li>}
                            </ul>
                          </div>

                        </div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}

        </div>

        {/* Release Comparison Workspace Right (35%) */}
        <aside className="w-full lg:w-[35%] lg:sticky lg:top-[90px] h-fit shrink-0 flex flex-col gap-sp-24 border-t lg:border-t-0 lg:border-l border-border-subtle pt-sp-32 lg:pt-0 lg:pl-sp-32 text-meta">
          <div>
            <h3 className="font-semibold text-text-primary tracking-tight">Compare Releases</h3>
            <p className="text-text-secondary mt-sp-4">Select two versions to automatically derive the incremental technical diff.</p>
          </div>

          {/* Selectors */}
          <div className="flex flex-col gap-sp-12 bg-bg-secondary p-sp-16 border border-border rounded-container">
            
            {/* Version A */}
            <div className="flex flex-col gap-sp-4">
              <label htmlFor="verA-select" className="text-[10px] text-text-secondary font-mono uppercase tracking-wider">Version A (New)</label>
              <select
                id="verA-select"
                value={verA}
                onChange={(e) => setVerA(e.target.value)}
                className="bg-bg-surface border border-border rounded-input px-sp-12 py-sp-8 text-meta cursor-pointer focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-surface)] text-text-primary transition-all duration-150"
              >
                {versions.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
              </select>
            </div>

            {/* Version B */}
            <div className="flex flex-col gap-sp-4">
              <label htmlFor="verB-select" className="text-[10px] text-text-secondary font-mono uppercase tracking-wider">Version B (Base)</label>
              <select
                id="verB-select"
                value={verB}
                onChange={(e) => setVerB(e.target.value)}
                className="bg-bg-surface border border-border rounded-input px-sp-12 py-sp-8 text-meta cursor-pointer focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-surface)] text-text-primary transition-all duration-150"
              >
                {versions.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
              </select>
            </div>

          </div>

          {/* Comparison Results wrapper */}
          <div className="border border-border rounded-container bg-bg-surface p-sp-24 flex flex-col gap-sp-16 min-h-[220px]">
            <h4 className="font-semibold text-text-primary border-b border-border-subtle pb-sp-8 uppercase text-[10px] tracking-wider">
              Comparison Diff ({verA} vs {verB})
            </h4>

            <AnimatePresence mode="wait">
              {verA === verB ? (
                <motion.div
                  key="no-changes-same"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center p-sp-24 text-text-muted gap-sp-8 flex-1"
                >
                  <HelpCircle className="w-8 h-8 text-text-muted" />
                  <span className="font-medium text-text-primary">Same Version Selected</span>
                  <p className="text-[11px] leading-normal">Please select two distinct versions to compute release diffs.</p>
                </motion.div>
              ) : !hasChanges ? (
                <motion.div
                  key="no-changes-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center p-sp-24 text-text-muted gap-sp-8 flex-1"
                >
                  <HelpCircle className="w-8 h-8 text-text-muted" />
                  <span className="font-medium text-text-primary">No Incremental Changes</span>
                  <p className="text-[11px] leading-normal">No logs detected between version {verA} and version {verB}.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${verA}-${verB}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-sp-16 flex-1 text-meta"
                >
                  
                  {/* Added list */}
                  {diffResult.added.length > 0 && (
                    <div className="flex flex-col gap-sp-4">
                      <span className="font-mono text-[9px] font-bold text-status-success uppercase tracking-wider">Added Features</span>
                      <ul className="flex flex-col gap-sp-4 text-text-secondary text-[11px]">
                        {diffResult.added.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-sp-8">
                            <span className="text-status-success font-bold">+</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Modified list */}
                  {diffResult.modified.length > 0 && (
                    <div className="flex flex-col gap-sp-4 border-t border-border-subtle pt-sp-12">
                      <span className="font-mono text-[9px] font-bold text-status-warning uppercase tracking-wider">Modified Features</span>
                      <ul className="flex flex-col gap-sp-4 text-text-secondary text-[11px]">
                        {diffResult.modified.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-sp-8">
                            <span className="text-status-warning font-bold">~</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Removed list */}
                  {diffResult.removed.length > 0 && (
                    <div className="flex flex-col gap-sp-4 border-t border-border-subtle pt-sp-12">
                      <span className="font-mono text-[9px] font-bold text-status-error uppercase tracking-wider">Removed Features</span>
                      <ul className="flex flex-col gap-sp-4 text-text-secondary text-[11px]">
                        {diffResult.removed.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-sp-8">
                            <span className="text-status-error font-bold">-</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

      </div>

    </div>
  );
}
