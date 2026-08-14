import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { planningData } from '../data/planning';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { ChevronDown, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Planning() {
  const [selectedVer, setSelectedVer] = useState("v2.0");
  const [collapsedSections, setCollapsedSections] = useState({});
  const [activeSection, setActiveSection] = useState("overview");
  
  const currentDoc = planningData[selectedVer];
  const isV2 = selectedVer === "v2.0";

  // IntersectionObserver for scrollspy
  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-15% 0px -75% 0px"
    });

    const targetSections = document.querySelectorAll('section[id]');
    targetSections.forEach((sec) => observer.observe(sec));

    return () => {
      targetSections.forEach((sec) => observer.unobserve(sec));
    };
  }, [selectedVer]);

  const toggleSection = (id) => {
    setCollapsedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90; // offset for nav height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Derive Evolution Log dynamically by comparing V2 vs V1
  const getEvolutionLog = () => {
    const log = [];
    const docV1 = planningData["v1.0"];
    const docV2 = planningData["v2.0"];

    if (!docV1 || !docV2) return log;

    // Compare sections
    docV2.sections.forEach(s2 => {
      const s1 = docV1.sections.find(s => s.id === s2.id);
      if (!s1) {
        log.push({ type: 'added', text: `Added section: ${s2.title}` });
      } else {
        // Compare bullets length
        if (s2.bullets && s1.bullets && s2.bullets.length > s1.bullets.length) {
          log.push({ type: 'added', text: `Added target details in ${s2.title}` });
        }
        // Compare requirements
        if (s2.id === 'requirements') {
          if (s2.functional.length > s1.functional.length) {
            log.push({ type: 'added', text: `Added functional spec: FR-03 & FR-04` });
          }
          if (s2.nonfunctional.length > s1.nonfunctional.length) {
            log.push({ type: 'added', text: `Added accessibility NFR requirements` });
          }
        }
        // Compare architecture components
        if (s2.id === 'architecture' && s2.components.length > s1.components.length) {
          log.push({ type: 'added', text: `Added DocumentPreview component architectural specifications` });
        }
      }
    });

    return log;
  };

  const evolutionLog = getEvolutionLog();

  const getPriorityVariant = (pri) => {
    if (pri === 'Critical') return 'error';
    if (pri === 'High') return 'warning';
    return 'default';
  };

  const getStatusVariant = (stat) => {
    if (stat === 'Completed') return 'success';
    if (stat === 'In Progress') return 'accent';
    return 'default';
  };

  const sidebarLinks = [
    { id: "overview", name: "Overview" },
    { id: "problem", name: "Problem Statement" },
    { id: "users", name: "Target Users" },
    { id: "requirements", name: "System Requirements" },
    { id: "architecture", name: "System Architecture" },
    { id: "data", name: "Data Models" },
    { id: "security", name: "Security Protocols" },
    { id: "testing", name: "Testing Strategy" },
    { id: "timeline", name: "Development Timeline" },
    { id: "risks", name: "Risk Analysis" },
    { id: "deployment", name: "Deployment Plan" }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-32 lg:px-sp-48 py-sp-64 font-sans flex flex-col gap-sp-48">
      
      {/* Header with selector */}
      <header className="border-b border-border pb-sp-32 flex flex-col md:flex-row md:items-end justify-between gap-sp-24">
        <div className="flex flex-col gap-sp-8">
          <span className="text-[11px] font-mono font-semibold tracking-widest text-accent uppercase">
            Technical Documentation
          </span>
          <h1 className="text-page-title font-semibold text-text-primary mt-sp-4 leading-none tracking-tight">
            Planning Specification
          </h1>
        </div>

        {/* Dynamic Version Selector */}
        <div className="flex items-center gap-sp-12">
          <span className="text-meta text-text-secondary">Release version:</span>
          <div className="relative">
            <select
              value={selectedVer}
              onChange={(e) => setSelectedVer(e.target.value)}
              className="bg-bg-surface border border-border rounded-input text-meta font-medium px-sp-12 py-sp-8 pr-sp-32 appearance-none cursor-pointer text-text-primary focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-surface)] transition-all duration-150"
            >
              <option value="v2.0">Planning V2.0 (Active)</option>
              <option value="v1.0">Planning V1.0 (Baseline)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-sp-12 text-text-muted">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-sp-48 items-start">
        
        {/* Sticky Sidebar Navigation Left (22%) */}
        <aside className="w-full lg:w-[22%] lg:sticky lg:top-[90px] h-fit shrink-0 flex flex-col gap-sp-16 border-b lg:border-b-0 lg:border-r border-border-subtle pb-sp-24 lg:pb-0 lg:pr-sp-24 text-meta font-sans">
          <span className="font-mono text-[10px] font-semibold text-text-secondary tracking-widest uppercase">
            Document Index
          </span>
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-sp-8 pb-sp-8 lg:pb-0">
            {sidebarLinks.map((link) => {
              const isCurrent = link.id === activeSection;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-sp-12 py-sp-8 rounded-button text-left font-medium cursor-pointer shrink-0 transition-colors duration-150 border ${
                    isCurrent 
                      ? 'bg-accent-surface text-accent border-accent/20 font-semibold' 
                      : 'border-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Document Right (78%) */}
        <div className="flex-1 min-w-0 max-w-[780px]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVer}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col gap-sp-48"
            >
              
              {/* Release Metadata index bar */}
              <div className="flex flex-wrap gap-sp-24 text-meta text-text-secondary bg-bg-secondary p-sp-16 rounded border border-border">
                <div className="flex items-center gap-sp-8"><span>Author: <strong className="text-text-primary">{currentDoc.author}</strong></span></div>
                <div className="flex items-center gap-sp-8"><span>Published: <strong className="text-text-primary">{currentDoc.date}</strong></span></div>
                <div className="flex items-center gap-sp-8"><span>Commit: <kbd className="bg-bg-surface px-1 border border-border rounded font-mono text-[11px] text-text-primary">{currentDoc.commit}</kbd></span></div>
              </div>

              {/* Dynamic Project Evolution log */}
              {isV2 && evolutionLog.length > 0 && (
                <div className="border border-accent/20 bg-accent-surface p-sp-24 rounded-container flex flex-col gap-sp-12 text-meta">
                  <h4 className="font-semibold text-accent flex items-center gap-sp-8">
                    <Info className="w-4 h-4" /> Technical Evolution Log (v2.0 vs v1.0)
                  </h4>
                  <ul className="flex flex-col gap-sp-8 text-text-primary font-medium">
                    {evolutionLog.map((log, idx) => (
                      <li key={idx} className="flex items-start gap-sp-8">
                        <span className="text-accent font-bold">✓</span>
                        <span>{log.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sections renders */}
              {currentDoc.sections.map((sec) => {
                const isCollapsed = collapsedSections[sec.id];
                
                return (
                  <section 
                    key={sec.id} 
                    id={sec.id}
                    className="flex flex-col gap-sp-16 scroll-mt-24 border-b border-border-subtle pb-sp-32 last:border-b-0"
                  >
                    
                    {/* Collapsible Section Header bar */}
                    <div 
                      onClick={() => toggleSection(sec.id)}
                      className="flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-sp-12">
                        {isCollapsed ? (
                          <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                        )}
                        <h2 className="text-section font-semibold text-text-primary group-hover:text-accent transition-colors duration-150">
                          {sec.title}
                        </h2>
                      </div>
                      
                      {/* Section metadata */}
                      <div className="hidden sm:flex items-center gap-sp-12 text-meta text-text-muted">
                        <span>Modified: {sec.lastModified}</span>
                        <span>•</span>
                        <Badge variant="default">{sec.status}</Badge>
                      </div>
                    </div>

                    {/* Section details */}
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-sp-16 pl-sp-32 pt-sp-8">
                            <p className="text-body text-text-secondary leading-relaxed max-w-[700px]">
                              {sec.text}
                            </p>

                            {/* Section Bullets rendering if exist */}
                            {sec.bullets && (
                              <ul className="flex flex-col gap-sp-8 text-body text-text-secondary list-disc pl-sp-16 max-w-[700px]">
                                {sec.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx}>{bullet}</li>
                                ))}
                              </ul>
                            )}

                            {/* Section Requirements lists if requirements section */}
                            {sec.id === 'requirements' && (
                              <div className="flex flex-col gap-sp-24 mt-sp-16 text-meta">
                                
                                {/* Functional */}
                                <div className="flex flex-col gap-sp-12">
                                  <h4 className="font-semibold text-text-primary uppercase tracking-wider text-[11px]">
                                    Functional Requirements
                                  </h4>
                                  <div className="border border-border rounded-container overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="bg-bg-secondary border-b border-border font-mono uppercase text-[10px] tracking-wider text-text-muted">
                                          <th className="p-sp-12 font-semibold w-16">ID</th>
                                          <th className="p-sp-12 font-semibold">Requirement</th>
                                          <th className="p-sp-12 font-semibold w-24">Priority</th>
                                          <th className="p-sp-12 font-semibold w-28">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border-subtle bg-bg-surface">
                                        {sec.functional.map((fr) => (
                                          <tr key={fr.id} className="hover:bg-bg-secondary transition-colors duration-150">
                                            <td className="p-sp-12 font-mono font-medium text-text-primary">{fr.id}</td>
                                            <td className="p-sp-12 text-text-secondary">{fr.desc}</td>
                                            <td className="p-sp-12"><Badge variant={getPriorityVariant(fr.priority)}>{fr.priority}</Badge></td>
                                            <td className="p-sp-12"><Badge variant={getStatusVariant(fr.status)}>{fr.status}</Badge></td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Non-Functional */}
                                <div className="flex flex-col gap-sp-12 mt-sp-8">
                                  <h4 className="font-semibold text-text-primary uppercase tracking-wider text-[11px]">
                                    Non-Functional Requirements (NFR)
                                  </h4>
                                  <div className="border border-border rounded-container overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="bg-bg-secondary border-b border-border font-mono uppercase text-[10px] tracking-wider text-text-muted">
                                          <th className="p-sp-12 font-semibold w-16">ID</th>
                                          <th className="p-sp-12 font-semibold w-28">Category</th>
                                          <th className="p-sp-12 font-semibold">Description</th>
                                          <th className="p-sp-12 font-semibold w-24">Priority</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border-subtle bg-bg-surface">
                                        {sec.nonfunctional.map((nfr) => (
                                          <tr key={nfr.id} className="hover:bg-bg-secondary transition-colors duration-150">
                                            <td className="p-sp-12 font-mono font-medium text-text-primary">{nfr.id}</td>
                                            <td className="p-sp-12 font-medium text-text-secondary">{nfr.category}</td>
                                            <td className="p-sp-12 text-text-muted">{nfr.desc}</td>
                                            <td className="p-sp-12"><Badge variant={getPriorityVariant(nfr.priority)}>{nfr.priority}</Badge></td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                              </div>
                            )}

                            {/* Section Architecture cards */}
                            {sec.id === 'architecture' && (
                              <div className="flex flex-col gap-sp-24 mt-sp-16 text-meta">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-sp-16">
                                  {sec.components.map((comp, cIdx) => (
                                    <Card key={cIdx} className="!bg-bg-secondary">
                                      <CardBody className="!py-sp-16 !px-sp-16 flex flex-col gap-sp-8">
                                        <span className="font-medium text-text-primary">{comp.name}</span>
                                        <p className="text-text-secondary leading-normal">{comp.desc}</p>
                                      </CardBody>
                                    </Card>
                                  ))}
                                </div>
                                
                                {/* Blueprint Placeholder */}
                                <div className="border border-dashed border-border bg-bg-secondary p-sp-32 rounded-container text-center flex flex-col items-center justify-center gap-sp-12 text-meta text-text-muted select-none">
                                  <AlertCircle className="w-6 h-6 text-text-muted" />
                                  <span className="font-medium text-text-primary">Architecture System Diagram</span>
                                  <p className="max-w-xs leading-normal">
                                    Canvas blueprint draft empty. Layout image uploads will serve as backgrounds in final reviews.
                                  </p>
                                </div>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </section>
                );
              })}

            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
