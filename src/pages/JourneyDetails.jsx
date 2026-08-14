import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DocumentPreview } from '../components/ui/DocumentPreview';
import { SoftwareGridSection } from '../components/ui/SoftwareGridSection';
import { ArrowLeft, User, Calendar, GitCommit, Link as LinkIcon, Download, Trash2 } from 'lucide-react';

export default function JourneyDetails() {
  const { id } = useParams();
  const { stages, versions, currentUser, markStageComplete, deletePublication } = useApp();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkComplete = async () => {
    try {
      await markStageComplete(stage.id);
    } catch (err) {
      alert(`Error updating stage status: ${err.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePublication(stage.id);
      setShowDeleteModal(false);
      navigate('/journey');
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
      setIsDeleting(false);
    }
  };

  const stage = stages.find(s => s.id === id);

  if (!stage) {
    return (
      <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-96 text-center font-sans">
        <h2 className="text-section font-semibold text-text-primary tracking-tight">Milestone Not Found</h2>
        <p className="text-text-secondary text-body mt-sp-8">The requested project journey milestone does not exist.</p>
        <Link to="/journey" className="mt-sp-24 inline-block">
          <Button variant="secondary">Return to Project Journey</Button>
        </Link>
      </div>
    );
  }

  // Find other releases/versions associated with this owner or project for release history context
  const releaseHistory = versions.filter(v => v.author === stage.owner);

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 py-sp-48 font-sans flex flex-col gap-sp-40">
        
        {/* Back to Journey link */}
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/journey')}
            icon={ArrowLeft}
            className="!text-meta !text-text-secondary hover:!text-text-primary !h-8 !px-0"
          >
            Back to Project Journey
          </Button>
        </div>

        {/* Main Editorial Header */}
        <header className="border-b border-border pb-sp-32 flex flex-col sm:flex-row sm:items-end justify-between gap-sp-24">
          <div className="flex flex-col gap-sp-8">
            <div className="flex items-center gap-sp-12">
              <span className="font-mono text-meta font-semibold text-accent uppercase tracking-widest">
                Release Milestone
              </span>
              <Badge variant={stage.status === 'Completed' ? 'success' : 'accent'}>
                {stage.status === 'Completed' ? '✓ Completed' : 'In Progress'}
              </Badge>
            </div>
            <h1 className="text-page-title font-semibold text-text-primary mt-sp-4 leading-none tracking-tight">
              {stage.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-sp-12">
            {stage.assets && stage.assets.length > 0 && (
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading ${stage.assets.length} file assets package.`);
                }}
              >
                <Button variant="outline" icon={Download} className="!h-sp-32 !px-sp-12 !text-meta">
                  Download Original Files
                </Button>
              </a>
            )}
          </div>
        </header>

        {/* Grid Layout: Metadata Sidebar Left (30%), Document Content Right (70%) */}
        <div className="flex flex-col lg:flex-row gap-sp-48 items-start">
          
          {/* Left Column: Metadata Index Table (30%) */}
          <aside className="w-full lg:w-[30%] border border-border rounded-container bg-bg-surface overflow-hidden text-meta shrink-0">
            <div className="bg-bg-secondary px-sp-24 py-sp-12 border-b border-border-subtle">
              <span className="font-mono text-[10px] font-semibold text-text-muted tracking-widest uppercase">
                Publication Metadata
              </span>
            </div>
            <div className="divide-y divide-border-subtle">
              <div className="p-sp-16 flex flex-col gap-sp-4">
                <span className="text-text-muted flex items-center gap-sp-8"><User className="w-3.5 h-3.5" /> Author / Publisher</span>
                <span className="font-medium text-text-primary">{stage.owner || 'TBD'}</span>
              </div>
              <div className="p-sp-16 flex flex-col gap-sp-4">
                <span className="text-text-muted flex items-center gap-sp-8"><Calendar className="w-3.5 h-3.5" /> Date Published</span>
                <span className="font-medium text-text-primary">{stage.date}</span>
              </div>
              <div className="p-sp-16 flex flex-col gap-sp-4">
                <span className="text-text-muted flex items-center gap-sp-8"><GitCommit className="w-3.5 h-3.5" /> Release Version</span>
                <span className="font-mono font-semibold text-accent">{stage.version || 'N/A'}</span>
              </div>
              <div className="p-sp-16 flex flex-col gap-sp-4">
                <span className="text-text-muted flex items-center gap-sp-8"><LinkIcon className="w-3.5 h-3.5" /> Source Link</span>
                {stage.commit ? (
                  <span className="font-mono font-medium text-text-primary">
                    commit <span className="bg-bg-secondary px-1 border border-border rounded text-xs">{stage.commit}</span>
                  </span>
                ) : (
                  <span className="text-text-muted">No commit associated</span>
                )}
              </div>
              {currentUser && currentUser.role === 'admin' && (
                <div className="p-sp-16 border-t border-border-subtle flex flex-col gap-sp-8">
                  {stage.status === 'In Progress' && (
                    <Button 
                      variant="primary" 
                      className="w-full !h-sp-button-h"
                      onClick={handleMarkComplete}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  <Button 
                    variant="danger" 
                    icon={Trash2}
                    className="w-full"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Release & Stage
                  </Button>
                </div>
              )}
            </div>
          </aside>

          {/* Right Column: Documentation Details & Files (70%) */}
          <div className="flex-1 flex flex-col gap-sp-48 min-w-0">
            
            {stage.id === 'stage-2' || stage.name.toLowerCase().includes('software grid') ? (
              <SoftwareGridSection />
            ) : (
              <>
                {/* Section: Summary */}
                <section className="flex flex-col gap-sp-16">
                  <h3 className="text-card font-semibold text-text-primary tracking-tight">Summary Description</h3>
                  <p className="text-body text-text-secondary leading-relaxed">
                    {stage.summary || 'No summary available.'}
                  </p>
                </section>

                {/* Section: Changes Since Previous Release */}
                <section className="flex flex-col gap-sp-16 border-t border-border-subtle pt-sp-32">
                  <h3 className="text-card font-semibold text-text-primary tracking-tight">Changes Since Previous Release</h3>
                  <p className="text-body text-text-secondary leading-relaxed">
                    {stage.changes || 'Initial release for this project stage milestones.'}
                  </p>
                </section>

                {/* Section: Related Files & Document Preview */}
                <section className="flex flex-col gap-sp-24 border-t border-border-subtle pt-sp-32">
                  <div>
                    <h3 className="text-card font-semibold text-text-primary tracking-tight">Published Deliverable Assets</h3>
                    <p className="text-meta text-text-secondary mt-sp-4">
                      Interactive preview of the documents and slide presentations registered under version release {stage.version || 'v1.0'}.
                    </p>
                  </div>
                  
                  {/* Reusable Document Preview component loading the active assets */}
                  <DocumentPreview assets={stage.assets} />
                </section>
              </>
            )}

            {/* Section: Release History */}
            <section className="flex flex-col gap-sp-20 border-t border-border-subtle pt-sp-32">
              <h3 className="text-card font-semibold text-text-primary tracking-tight">Release History</h3>
              <div className="flex flex-col border border-border bg-bg-surface rounded-card overflow-hidden">
                {releaseHistory.map((h, i) => (
                  <div key={i} className="flex justify-between items-center p-sp-16 text-meta border-b border-border-subtle last:border-b-0">
                    <div className="flex items-center gap-sp-16">
                      <span className="font-mono font-semibold text-accent">{h.version}</span>
                      <span className="text-text-primary font-medium">{h.changeSummary}</span>
                    </div>
                    <div className="flex items-center gap-sp-12 text-text-muted">
                      <span>{h.author}</span>
                      <span>·</span>
                      <span className="font-mono text-xs">{h.date}</span>
                    </div>
                  </div>
                ))}
                {releaseHistory.length === 0 && (
                  <div className="p-sp-24 text-center text-text-muted text-meta">
                    No other releases cataloged for this owner.
                  </div>
                )}
              </div>
            </section>

          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!isDeleting) setShowDeleteModal(false);
        }}
        title="Delete this journey stage?"
      >
        <div className="flex flex-col gap-sp-16 text-meta text-text-secondary font-sans">
          <p className="leading-relaxed">
            Are you sure you want to delete this stage and its publication? This action will permanently remove:
          </p>
          <ul className="list-disc pl-sp-16 flex flex-col gap-sp-4 leading-normal">
            <li>The publication record and its registered files.</li>
            <li>The associated version/changelog record.</li>
            <li>The activities audit log entry for this version.</li>
            <li>This Project Journey stage milestone.</li>
          </ul>
          <p className="font-semibold text-text-primary">This action cannot be undone.</p>
          
          <div className="flex justify-end gap-sp-12 pt-sp-16 border-t border-border-subtle">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setShowDeleteModal(false)}
              className="!h-sp-button-h !px-sp-16"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="!h-sp-button-h !px-sp-16"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
