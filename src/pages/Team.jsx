import React from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { User, Shield, Briefcase, Zap, HelpCircle } from 'lucide-react';

export default function Team() {
  const { teamMembers, responsibilityMatrix } = useApp();

  const getStatusVariant = (stat) => {
    if (stat === 'Completed') return 'success';
    if (stat === 'In Progress') return 'accent';
    return 'default';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-48 font-sans flex flex-col gap-sp-48">

      {/* Header */}
      <header className="border-b border-border pb-sp-32">
        <span className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">
          Accounts Directory
        </span>
        <h1 className="text-page-title font-semibold text-text-primary mt-sp-8 leading-none tracking-tight">
          Team ARMS
        </h1>
        <p className="text-text-secondary text-body mt-sp-12">
          Project builders and account responsibilities catalog.
        </p>
      </header>

      {/* Editorial profiles listing */}
      <section className="flex flex-col gap-sp-48">
        {teamMembers.map((member, idx) => (
          <div
            key={member.id}
            className="flex flex-col lg:flex-row gap-sp-32 pb-sp-48 border-b border-border-subtle last:border-b-0 last:pb-0"
          >

            {/* Left Col: Avatar + Basic Info (30%) */}
            <div className="w-full lg:w-[30%] flex items-start gap-sp-16 shrink-0">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-18px select-none shrink-0"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <div className="flex flex-col gap-sp-4">
                <h3 className="text-card font-semibold text-text-primary leading-tight">
                  {member.name}
                </h3>
                <span className="text-meta text-text-secondary">{member.role}</span>
                <div className="mt-sp-8">
                  <Badge variant="default" className="font-mono text-[10px]">
                    SPRINT: {member.currentSprint}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Col: Details (70%) */}
            <div className="flex-1 flex flex-col gap-sp-16 text-meta text-text-secondary leading-relaxed">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-sp-24">
                <div className="flex flex-col gap-sp-4">
                  <span className="text-text-muted font-mono uppercase tracking-wider text-[9px]">Primary Responsibility</span>
                  <p className="text-text-primary font-medium">{member.primaryResponsibility}</p>
                </div>
                <div className="flex flex-col gap-sp-4">
                  <span className="text-text-muted font-mono uppercase tracking-wider text-[9px]">Technical Skills</span>
                  <div className="flex flex-wrap gap-sp-6 mt-sp-4">
                    {member.technicalSkills?.map(skill => (
                      <Badge key={skill} variant="neutral" className="!px-sp-8 !py-[2px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-sp-24 border-t border-border-subtle pt-sp-16 mt-sp-4">
                <div className="flex flex-col gap-sp-4">
                  <span className="text-text-muted font-mono uppercase tracking-wider text-[9px] flex items-center gap-sp-4"><Briefcase className="w-3.5 h-3.5" /> Current Task</span>
                  <p>{member.currentTask}</p>
                </div>
                <div className="flex flex-col gap-sp-4">
                  <span className="text-text-muted font-mono uppercase tracking-wider text-[9px] flex items-center gap-sp-4"><Zap className="w-3.5 h-3.5" /> Current Focus</span>
                  <p className="text-text-primary font-medium">{member.currentFocus}</p>
                </div>
              </div>

            </div>

          </div>
        ))}
      </section>

      {/* Responsibility Matrix */}
      <section className="flex flex-col gap-sp-20 border-t border-border-subtle pt-sp-48">
        <div>
          <h2 className="text-section font-semibold text-text-primary tracking-tight">
            Responsibility Matrix
          </h2>
          <p className="text-text-secondary text-meta mt-sp-4">
            System account owner mappings across core courses project areas.
          </p>
        </div>

        <div className="border border-border bg-bg-surface rounded-container overflow-hidden text-meta">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary border-b border-border font-mono uppercase text-[10px] tracking-wider text-text-muted">
                  <th className="p-sp-16 font-semibold">Area</th>
                  <th className="p-sp-16 font-semibold">Primary Owner</th>
                  <th className="p-sp-16 font-semibold">Secondary Owner</th>
                  <th className="p-sp-16 font-semibold">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {responsibilityMatrix.map((matrix) => (
                  <tr key={matrix.id} className="hover:bg-bg-secondary transition-colors duration-150">
                    <td className="p-sp-16 font-medium text-text-primary">{matrix.area}</td>
                    <td className="p-sp-16 text-text-secondary">{matrix.primaryOwner}</td>
                    <td className="p-sp-16 text-text-secondary">{matrix.secondaryOwner}</td>
                    <td className="p-sp-16">
                      <Badge variant={getStatusVariant(matrix.status)}>{matrix.status}</Badge>
                    </td>
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
