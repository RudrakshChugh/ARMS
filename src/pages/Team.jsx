import React from 'react';
import { useApp } from '../context/AppContext';
import { NOVA_META, NOVA_TEAM_MEMBERS } from '../data/novaData';
import { Badge } from '../components/ui/Badge';

const getInitials = (member) => {
  if (member.initials) return member.initials;
  return (member.name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};

export default function Team() {
  const { teamMembers = [] } = useApp();

  const members = (teamMembers.length > 0 ? teamMembers : NOVA_TEAM_MEMBERS).map((member) => {
    const firstWord = (member.name || '').toLowerCase().split(' ')[0];
    const match = NOVA_TEAM_MEMBERS.find(
      (n) => n.id === member.id || n.name.toLowerCase().startsWith(firstWord)
    );
    return match
      ? {
          ...match,
          ...member,
          name: match.name,
          rollNumber: match.rollNumber,
          role: match.role,
          contribution: member.contribution || match.contribution
        }
      : member;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-48 font-sans flex flex-col gap-sp-48">
      {/* Header */}
      <header className="border-b border-border pb-sp-32 flex flex-col gap-sp-8">
        <span className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">
          {NOVA_META.course} · {NOVA_META.teamName} (Team ID: {NOVA_META.teamId}) · Subgroup {NOVA_META.subgroup}
        </span>
        <h1 className="text-page-title font-semibold text-text-primary leading-none tracking-tight">
          Team ARMS
        </h1>
        <p className="text-text-secondary text-body max-w-2xl leading-relaxed">
          {NOVA_META.program}, {NOVA_META.institution}. Submitted to {NOVA_META.instructor} ({NOVA_META.submissionDate}).
        </p>
      </header>

      {/* Editorial profiles listing */}
      <section className="flex flex-col gap-sp-24">
        {members.map((member, idx) => (
          <div
            key={member.id || member.name || idx}
            className="flex flex-col lg:flex-row lg:items-center gap-sp-24 pb-sp-24 border-b border-border-subtle last:border-b-0 last:pb-0"
          >
            {/* Left Col: Avatar + Name + Roll Number */}
            <div className="w-full lg:w-[36%] flex items-start gap-sp-16 shrink-0">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-18px select-none shrink-0"
                style={{ backgroundColor: member.color || 'var(--color-accent)' }}
              >
                {getInitials(member)}
              </div>
              <div className="flex flex-col gap-sp-4">
                <div className="flex flex-wrap items-center gap-sp-8">
                  <h3 className="text-card font-semibold text-text-primary leading-tight">
                    {member.name}
                  </h3>
                  {member.rollNumber && (
                    <span className="font-mono text-xs text-accent bg-accent-surface px-sp-8 py-[2px] border border-accent/20">
                      Roll No: {member.rollNumber}
                    </span>
                  )}
                </div>
                {member.role && (
                  <span className="text-meta font-medium text-text-secondary">{member.role}</span>
                )}
              </div>
            </div>

            {/* Right Col: Concise Contribution + Skills */}
            <div className="flex-1 flex flex-col gap-sp-8 text-meta text-text-secondary leading-relaxed">
              {member.contribution && (
                <p className="text-text-primary">{member.contribution}</p>
              )}
              {member.technicalSkills?.length > 0 && (
                <div className="flex flex-wrap gap-sp-6">
                  {member.technicalSkills.map((skill) => (
                    <Badge key={skill} variant="neutral" className="!px-sp-8 !py-[2px]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
