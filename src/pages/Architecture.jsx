import React from 'react';
import {
  NOVA_META,
  NOVA_TECH_STACK,
  NOVA_API_ENDPOINTS,
  NOVA_DB_ENTITIES,
  NOVA_SETUP_GUIDE
} from '../data/novaData';
import { SystemArchitectureDiagram, PipelineFlowDiagram } from '../components/diagrams/NovaDiagrams';
import { Badge } from '../components/ui/Badge';
import { ExternalLink, Layers, Server, Database, Terminal } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-48 font-sans flex flex-col gap-sp-48">
      {/* Header */}
      <header className="border-b border-border pb-sp-32 flex flex-col lg:flex-row lg:items-end justify-between gap-sp-24">
        <div className="flex flex-col gap-sp-8">
          <span className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">
            Technical Design · {NOVA_META.testedVersion}
          </span>
          <h1 className="text-page-title font-semibold text-text-primary leading-none tracking-tight">
            System Architecture &amp; Setup
          </h1>
          <p className="text-text-secondary text-body max-w-2xl leading-relaxed">
            Four-tier architecture, module pipeline, REST API surface, PostgreSQL + pgvector schema, and local setup for {NOVA_META.title}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-sp-12">
          <a
            href={NOVA_META.novaLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-sp-8 px-sp-16 py-sp-8 bg-accent text-bg-primary hover:bg-accent-hover text-meta font-semibold uppercase tracking-wider transition-colors w-max"
          >
            NOVA Website <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={NOVA_META.novaRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-sp-8 px-sp-16 py-sp-8 border border-border bg-bg-surface hover:bg-bg-secondary text-meta font-medium text-text-primary transition-colors w-max"
          >
            NOVA Repository <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </a>
        </div>
      </header>

      {/* 1. System Diagrams */}
      <section className="flex flex-col gap-sp-24">
        <div className="flex flex-col gap-sp-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
            01 · Architecture &amp; Pipeline Diagrams
          </span>
          <h2 className="text-section font-semibold text-text-primary tracking-tight">
            Module Connections &amp; Workflow
          </h2>
        </div>
        <SystemArchitectureDiagram />
        <PipelineFlowDiagram />
      </section>

      {/* 2. Tech Stack */}
      <section className="border-t border-border-subtle pt-sp-48 flex flex-col gap-sp-20">
        <div className="flex flex-col gap-sp-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
            02 · Technology Stack
          </span>
          <h2 className="text-section font-semibold text-text-primary tracking-tight flex items-center gap-sp-12">
            <Layers className="w-5 h-5 text-accent" /> Stack &amp; Dependencies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sp-16">
          {NOVA_TECH_STACK.map((item) => (
            <div key={item.layer} className="border border-border bg-bg-surface p-sp-16 flex flex-col gap-sp-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                {item.layer}
              </span>
              <h3 className="text-body font-semibold text-text-primary">{item.technology}</h3>
              <p className="text-meta text-text-secondary leading-relaxed">{item.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core API & Database Overview */}
      <section className="border-t border-border-subtle pt-sp-48 grid grid-cols-1 lg:grid-cols-2 gap-sp-32 items-start">
        {/* Key API Endpoints */}
        <div className="flex flex-col gap-sp-16">
          <h2 className="text-card font-semibold text-text-primary tracking-tight flex items-center gap-sp-8">
            <Server className="w-4 h-4 text-accent" /> FastAPI Endpoints (12 Routers)
          </h2>
          <div className="border border-border bg-bg-surface divide-y divide-border-subtle text-meta">
            {NOVA_API_ENDPOINTS.slice(0, 8).map((ep) => (
              <div key={`${ep.method}-${ep.route}`} className="p-sp-12 flex items-center justify-between gap-sp-12">
                <span className="font-mono text-[12px] text-text-primary truncate">
                  <span className="text-accent font-semibold mr-sp-6">{ep.method}</span>
                  {ep.route}
                </span>
                <Badge variant={ep.scope === 'Public' ? 'neutral' : 'accent'}>{ep.scope}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Database & Storage */}
        <div className="flex flex-col gap-sp-16">
          <h2 className="text-card font-semibold text-text-primary tracking-tight flex items-center gap-sp-8">
            <Database className="w-4 h-4 text-accent" /> PostgreSQL + pgvector Schema
          </h2>
          <div className="border border-border bg-bg-surface divide-y divide-border-subtle text-meta">
            {NOVA_DB_ENTITIES.map((ent) => (
              <div key={ent.name} className="p-sp-12 flex flex-col gap-sp-2">
                <span className="font-mono font-semibold text-accent">{ent.name}</span>
                <p className="text-text-secondary text-[12px] leading-relaxed">{ent.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quick Setup & Deployment */}
      <section className="border-t border-border-subtle pt-sp-48 flex flex-col gap-sp-20">
        <div className="flex flex-col gap-sp-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
            03 · Installation &amp; Deployment
          </span>
          <h2 className="text-section font-semibold text-text-primary tracking-tight flex items-center gap-sp-12">
            <Terminal className="w-5 h-5 text-accent" /> Quick Run Guide
          </h2>
        </div>

        <div className="border border-border bg-bg-surface p-sp-20 flex flex-col gap-sp-12">
          <p className="text-meta text-text-secondary">
            <strong>Prerequisites:</strong> Python 3.14+, Node.js 20+ LTS, PostgreSQL 16+ with <code className="font-mono">pgvector</code>, and Docker 24+.
          </p>
          <pre className="bg-bg-secondary border border-border-subtle p-sp-16 text-[12px] font-mono text-text-primary overflow-x-auto leading-relaxed">
            <code>{NOVA_SETUP_GUIDE.installSteps.map((s) => `# ${s.step}\n${s.cmd}`).join('\n\n')}</code>
          </pre>
          <p className="text-meta text-text-muted">
            Packaged via multi-stage <code className="font-mono">Dockerfile</code> and deployed using <code className="font-mono">render.yaml</code> (FastAPI), Neon PostgreSQL (<code className="font-mono">pgvector</code>), and <code className="font-mono">wrangler.jsonc</code> (Cloudflare Worker CDN).
          </p>
        </div>
      </section>
    </div>
  );
}
