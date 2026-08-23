import React from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';

// Team details are hand-maintained in the backend controller, so tolerate a member
// object with fields missing or misspelled rather than rendering a broken card.
const getInitials = (member) => {
  if (member.initials) return member.initials;
  return (member.name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
};

export default function Team() {
  const { teamMembers } = useApp();

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
      <section className="flex flex-col gap-sp-32">
        {teamMembers.length === 0 && (
          <p className="text-text-secondary text-meta">
            No team members are currently listed.
          </p>
        )}

        {teamMembers.map((member, idx) => (
          <div
            key={member.id || member.name || idx}
            className="flex flex-col lg:flex-row lg:items-center gap-sp-24 pb-sp-32 border-b border-border-subtle last:border-b-0 last:pb-0"
          >

            {/* Left Col: Avatar + Basic Info */}
            <div className="w-full lg:w-[38%] flex items-start gap-sp-16 shrink-0">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-18px select-none shrink-0"
                style={{ backgroundColor: member.color || 'var(--color-accent)' }}
              >
                {getInitials(member)}
              </div>
              <div className="flex flex-col gap-sp-4">
                <h3 className="text-card font-semibold text-text-primary leading-tight">
                  {member.name}
                </h3>
                {member.role && (
                  <span className="text-meta text-text-secondary">{member.role}</span>
                )}
              </div>
            </div>

            {/* Right Col: Skills */}
            {member.technicalSkills?.length > 0 && (
              <div className="flex-1 flex flex-col gap-sp-4 text-meta text-text-secondary leading-relaxed">
                <span className="text-text-muted font-mono uppercase tracking-wider text-[9px]">Technical Skills</span>
                <div className="flex flex-wrap gap-sp-6 mt-sp-4">
                  {member.technicalSkills.map(skill => (
                    <Badge key={skill} variant="neutral" className="!px-sp-8 !py-[2px]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </section>

    </div>
  );
}
