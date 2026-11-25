import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  NOVA_META,
  NOVA_PROBLEMS,
  NOVA_USERS,
  NOVA_SCOPE
} from '../data/novaData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  GitBranch,
  Clock,
  User,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Users,
  Layers
} from 'lucide-react';

export default function Home() {
  const { stages = [], versions = [], activities = [], teamMembers = [] } = useApp();
  const navigate = useNavigate();

  const currentStage =
    stages.find((s) => s.status === 'In Progress') ||
    stages[stages.length - 1] ||
    stages[0];

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-48 font-sans flex flex-col gap-sp-48">
      {/* Editorial Page Header */}
      <header className="pb-sp-32 border-b border-border flex flex-col gap-sp-16">
        <div className="flex flex-wrap items-center gap-sp-12">
          <span className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">
            {NOVA_META.course} · {NOVA_META.teamName} (ID: {NOVA_META.teamId}) · Subgroup {NOVA_META.subgroup}
          </span>
          <Badge variant="success">Release {NOVA_META.testedVersion}</Badge>
        </div>

        <h1 className="text-page-title font-semibold text-text-primary leading-none tracking-tight">
          {NOVA_META.title}
        </h1>

        <p className="text-text-secondary text-body max-w-3xl leading-relaxed">
          {NOVA_META.subtitle}. Developed for {NOVA_META.program} at {NOVA_META.institution} under the guidance of{' '}
          <strong className="text-text-primary font-medium">{NOVA_META.instructor}</strong> ({NOVA_META.submissionDate}).
        </p>

        {/* Evaluator Quick Links */}
        <div className="flex flex-wrap items-center gap-sp-12 pt-sp-8">
          <a
            href={NOVA_META.novaLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-sp-6 h-sp-32 px-sp-16 bg-accent text-bg-primary hover:bg-accent-hover text-meta font-semibold uppercase tracking-wider transition-colors"
          >
            Live NOVA Website <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link to="/architecture">
            <Button variant="outline" icon={Layers} className="!h-sp-32 !px-sp-16 !text-meta">
              Architecture &amp; Setup
            </Button>
          </Link>
          <a
            href={NOVA_META.novaRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-sp-6 h-sp-32 px-sp-12 border border-border bg-bg-surface hover:bg-bg-secondary text-meta font-medium text-text-primary transition-colors"
          >
            NOVA Source Repo <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </a>
          <a
            href={NOVA_META.portalRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-sp-6 h-sp-32 px-sp-12 border border-border bg-bg-surface hover:bg-bg-secondary text-meta font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Portal Repo <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>
        </div>
      </header>

      {/* Main Documentation Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-sp-48 items-start">
        {/* Main Left Content Panel (65%) */}
        <div className="w-full lg:w-[65%] flex flex-col gap-sp-48">
          {/* Section: Problem Statement */}
          <section className="flex flex-col gap-sp-20">
            <h2 className="text-section font-semibold text-text-primary tracking-tight">
              Problem &amp; Engineering Motivation
            </h2>
            <p className="text-body text-text-secondary leading-relaxed">
              Under Outcome-Based Education (OBE), every examination question must map to an accredited Course Outcome and Bloom cognitive level. Manual paper setting repeatedly breaks down across three systematic failure modes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-sp-16">
              {NOVA_PROBLEMS.map((prob) => (
                <div key={prob.id} className="border border-border bg-bg-surface p-sp-16 flex flex-col gap-sp-8">
                  <h3 className="text-body font-semibold text-text-primary">{prob.title}</h3>
                  <p className="text-meta text-text-secondary leading-relaxed">{prob.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Intended Users */}
          <section className="flex flex-col gap-sp-20 border-t border-border-subtle pt-sp-48">
            <h2 className="text-section font-semibold text-text-primary tracking-tight flex items-center gap-sp-12">
              <Users className="w-5 h-5 text-accent" /> Intended Users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sp-16">
              {NOVA_USERS.map((u) => (
                <div key={u.role} className="border border-border bg-bg-secondary p-sp-16 flex flex-col gap-sp-8">
                  <div className="flex items-center justify-between gap-sp-6">
                    <span className="font-semibold text-meta text-text-primary">{u.role}</span>
                    <Badge variant="neutral">{u.scope}</Badge>
                  </div>
                  <p className="text-meta text-text-secondary leading-relaxed">{u.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Delivered Scope */}
          <section className="flex flex-col gap-sp-20 border-t border-border-subtle pt-sp-48">
            <h2 className="text-section font-semibold text-text-primary tracking-tight">
              Delivered Scope &amp; Boundary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sp-16">
              <div className="border border-border bg-bg-surface p-sp-20 flex flex-col gap-sp-12">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-status-success flex items-center gap-sp-6">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Scope (Delivered)
                </span>
                <ul className="flex flex-col gap-sp-8 text-meta text-text-secondary list-disc pl-sp-16 leading-relaxed">
                  {NOVA_SCOPE.inScope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-border bg-bg-surface p-sp-20 flex flex-col gap-sp-12">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-sp-6">
                  <XCircle className="w-3.5 h-3.5" /> Out of Scope (Explicit Boundary)
                </span>
                <ul className="flex flex-col gap-sp-8 text-meta text-text-secondary list-disc pl-sp-16 leading-relaxed">
                  {NOVA_SCOPE.outOfScope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Current Status */}
          {currentStage && (
            <section className="flex flex-col gap-sp-20 border-t border-border-subtle pt-sp-48">
              <h2 className="text-section font-semibold text-text-primary tracking-tight">
                Latest Project Milestone
              </h2>
              <div className="border border-border bg-bg-surface overflow-hidden text-meta font-sans">
                <div className="bg-bg-secondary px-sp-24 py-sp-12 border-b border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-sp-12">
                    <span className="font-mono font-semibold text-accent uppercase tracking-wider text-xs">
                      STAGE 0{stages.indexOf(currentStage) + 1}
                    </span>
                    <span className="text-body font-semibold text-text-primary">{currentStage.name}</span>
                  </div>
                  <Badge variant={currentStage.status === 'Completed' ? 'success' : 'accent'}>
                    {currentStage.status}
                  </Badge>
                </div>

                <div className="divide-y divide-border-subtle">
                  <div className="grid grid-cols-3 p-sp-16">
                    <span className="text-text-muted flex items-center gap-sp-8">
                      <User className="w-3.5 h-3.5" /> Stage Owner
                    </span>
                    <span className="col-span-2 font-medium text-text-primary">{currentStage.owner || 'Team ARMS'}</span>
                  </div>
                  <div className="grid grid-cols-3 p-sp-16">
                    <span className="text-text-muted flex items-center gap-sp-8">
                      <Clock className="w-3.5 h-3.5" /> Release Date
                    </span>
                    <span className="col-span-2 font-medium text-text-primary">{currentStage.date}</span>
                  </div>
                  <div className="grid grid-cols-3 p-sp-16">
                    <span className="text-text-muted flex items-center gap-sp-8">
                      <GitBranch className="w-3.5 h-3.5" /> Release Version
                    </span>
                    <span className="col-span-2 font-mono font-semibold text-accent">{currentStage.version}</span>
                  </div>
                  <div className="p-sp-16 flex flex-col gap-sp-8">
                    <span className="text-text-muted block">Summary</span>
                    <p className="text-text-secondary leading-relaxed">{currentStage.summary}</p>
                  </div>
                </div>

                <div className="bg-bg-secondary p-sp-16 border-t border-border-subtle flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/journey/${currentStage.id}`)}
                    className="!h-8 !px-sp-12 !text-meta"
                  >
                    View Release Manifest
                  </Button>
                </div>
              </div>
            </section>
          )}

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

            <div className="flex flex-col border border-border bg-bg-surface overflow-hidden">
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
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-mono ${
                          isCompleted
                            ? 'bg-status-success-surface border-status-success text-status-success'
                            : isInProgress
                            ? 'bg-accent-surface border-accent text-accent font-bold'
                            : 'bg-bg-surface border-border text-text-muted'
                        }`}
                      >
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
          {/* Deployment & Access Card */}
          <div className="border border-border bg-bg-secondary p-sp-20 flex flex-col gap-sp-10 text-meta">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
              Deployment &amp; Access
            </span>
            <p className="text-text-primary font-medium leading-relaxed">{NOVA_META.deploymentTopology}</p>
            <p className="text-text-secondary text-[12px] leading-relaxed">{NOVA_META.deploymentNote}</p>
            <div className="flex flex-wrap items-center gap-sp-12 pt-sp-4">
              <a
                href={NOVA_META.novaLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-sp-4 text-accent font-semibold hover:underline"
              >
                Open Live App <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-border">·</span>
              <Link to="/architecture" className="text-text-primary font-medium hover:text-accent hover:underline">
                Architecture &amp; Run Guide →
              </Link>
            </div>
          </div>

          {/* Section: Recent Releases */}
          <div className="flex flex-col gap-sp-16">
            <h3 className="text-meta font-semibold text-text-secondary uppercase tracking-wider">
              Recent Releases
            </h3>
            <div className="flex flex-col gap-sp-12 divide-y divide-border-subtle">
              {versions.slice(0, 3).map((ver) => (
                <div key={ver.version} className="pt-sp-12 first:pt-0 flex flex-col gap-sp-4 text-meta">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono font-semibold text-text-primary hover:text-accent cursor-pointer transition-colors duration-150"
                      onClick={() => navigate('/versions')}
                    >
                      {ver.version}
                    </span>
                    <span className="text-text-muted text-xs">{ver.date}</span>
                  </div>
                  <p className="text-text-secondary line-clamp-2 leading-relaxed">{ver.changeSummary}</p>
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
                    <span className="text-[10px] text-text-muted mt-0.5">
                      {act.person} · {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Team Directory */}
          <div className="flex flex-col gap-sp-16 border-t border-border-subtle pt-sp-32">
            <div className="flex items-center justify-between">
              <h3 className="text-meta font-semibold text-text-secondary uppercase tracking-wider">
                Team ARMS · Members
              </h3>
              <Link to="/team" className="text-meta text-accent hover:underline">
                Details →
              </Link>
            </div>
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
                    <span className="font-medium text-text-primary">
                      {member.name}
                      {member.rollNumber && !String(member.name).includes(member.rollNumber) && (
                        <span className="font-mono text-xs text-text-muted ml-sp-6">({member.rollNumber})</span>
                      )}
                    </span>
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
