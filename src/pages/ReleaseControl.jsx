import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  FileText,
  Presentation,
  Image as ImageIcon,
  Play,
  FileCode,
  CheckCircle2,
  Trash2,
  UploadCloud,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReleaseControl() {
  const navigate = useNavigate();
  const { stages, publishRelease, versions, currentUser } = useApp();

  // Form State
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('v1.3');
  const [summary, setSummary] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
  const [newStageName, setNewStageName] = useState('');
  const [commit, setCommit] = useState('');
  const [notes, setNotes] = useState('');

  // Assets Upload State
  const [stagedFiles, setStagedFiles] = useState([]);

  // Dialog & Workflow States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentPipelineStep, setCurrentPipelineStep] = useState(-1);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [newlyCreatedStageId, setNewlyCreatedStageId] = useState('');

  // Validation state
  const [errors, setErrors] = useState({});

  // Release Pipeline Steps definition
  const pipelineSteps = [
    { name: "Validation", label: "Checking fields integrity..." },
    { name: "Metadata Verification", label: "Auditing version parameters..." },
    { name: "File Registration", label: "Staging package assets..." },
    { name: "Version Creation", label: "Compiling repository branch..." },
    { name: "Journey Update", label: "Adding milestone timeline nodes..." },
    { name: "Homepage Update", label: "Refreshing main catalog summary..." },
    { name: "Activity Update", label: "Logging recent activities..." },
    { name: "Release History Update", label: "Registering audit logs..." },
    { name: "Publication Complete", label: "Release is now live!" }
  ];

  // Helper to resolve file icons
  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return FileText;
      case 'ppt':
      case 'pptx': return Presentation;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'image': return ImageIcon;
      case 'mp4':
      case 'video': return Play;
      case 'md':
      case 'markdown': return FileCode;
      default: return FileText;
    }
  };

  // Stage drag-over drop handler
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const allowedFiles = [];
      const rejectedFiles = [];
      
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.size > 50 * 1024 * 1024) {
          rejectedFiles.push(file.name);
        } else {
          allowedFiles.push(file);
        }
      });

      if (rejectedFiles.length > 0) {
        alert(`The following file(s) exceed the maximum allowed size of 50 MB and were rejected:\n- ${rejectedFiles.join('\n- ')}`);
      }

      if (allowedFiles.length > 0) {
        // Upload each file to the backend uploads directory
        const uploadPromises = allowedFiles.map(async file => {
          try {
            const res = await api.uploadFile(file);
            return res.file;
          } catch (err) {
            alert(`Upload failed for "${file.name}": ${err.message}`);
            return null;
          }
        });
        const uploadedFiles = await Promise.all(uploadPromises);
        const validUploadedFiles = uploadedFiles.filter(Boolean);
        if (validUploadedFiles.length > 0) {
          setStagedFiles(prev => [...prev, ...validUploadedFiles]);
        }
      }
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files) {
      const allowedFiles = [];
      const rejectedFiles = [];

      Array.from(e.target.files).forEach(file => {
        if (file.size > 50 * 1024 * 1024) {
          rejectedFiles.push(file.name);
        } else {
          allowedFiles.push(file);
        }
      });

      if (rejectedFiles.length > 0) {
        alert(`The following file(s) exceed the maximum allowed size of 50 MB and were rejected:\n- ${rejectedFiles.join('\n- ')}`);
      }

      if (allowedFiles.length > 0) {
        const uploadPromises = allowedFiles.map(async file => {
          try {
            const res = await api.uploadFile(file);
            return res.file;
          } catch (err) {
            alert(`Upload failed for "${file.name}": ${err.message}`);
            return null;
          }
        });
        const uploadedFiles = await Promise.all(uploadPromises);
        const validUploadedFiles = uploadedFiles.filter(Boolean);
        if (validUploadedFiles.length > 0) {
          setStagedFiles(prev => [...prev, ...validUploadedFiles]);
        }
      }
    }
  };

  const removeStagedFile = (idx) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    
    // Version Validation
    const trimmedVer = version.trim();
    if (!trimmedVer) {
      newErrors.version = 'Version code is required.';
    } else {
      const versionRegex = /^v\d+\.\d+(\.\d+)?$/;
      if (!versionRegex.test(trimmedVer)) {
        newErrors.version = 'Version tag must follow standard format (e.g. v1.0, v1.2, or v1.2.3).';
      } else {
        const isDuplicate = versions.some(v => v.version.trim().toLowerCase() === trimmedVer.toLowerCase());
        if (isDuplicate) {
          newErrors.version = `Version tag "${trimmedVer}" has already been published.`;
        }
      }
    }

    // Commit Validation (Optional but must be 7-digit hex if present)
    const trimmedCommit = commit.trim();
    if (trimmedCommit !== '') {
      const commitRegex = /^[0-9a-fA-F]{7}$/;
      if (!commitRegex.test(trimmedCommit)) {
        newErrors.commit = 'Commit SHA must be exactly 7 hexadecimal characters.';
      }
    }

    if (!summary.trim()) newErrors.summary = 'Summary is required.';
    
    // Milestone Stage Name Validation
    const trimmedStage = newStageName.trim();
    if (!trimmedStage) {
      newErrors.stageName = 'Milestone stage target name is required.';
    } else {
      const isDuplicateStage = stages.some(s => s.name.trim().toLowerCase() === trimmedStage.toLowerCase());
      if (isDuplicateStage) {
        newErrors.stageName = `Milestone stage "${trimmedStage}" already exists in the Project Journey.`;
      }
    }

    if (stagedFiles.length === 0) newErrors.files = 'At least one asset is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerPublishFlow = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const confirmPublication = () => {
    setShowConfirmModal(false);
    setIsPublishing(true);
    setCurrentPipelineStep(0);

    // Animate the pipeline steps sequentially
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < pipelineSteps.length) {
        setCurrentPipelineStep(step);
      } else {
        clearInterval(interval);
        finalizePublication();
      }
    }, 450); // 450ms per step
  };

  const finalizePublication = async () => {
    const targetStageName = newStageName.trim();
    const finalStageId = `stage-${Date.now()}`;

    const formattedAssets = stagedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      path: file.path
    }));

    try {
      // Trigger atomic backend transaction publish
      const res = await publishRelease({
        title,
        version,
        author: currentUser?.name || '',
        stageName: targetStageName,
        changeSummary: summary,
        commit: commit || undefined,
        assets: formattedAssets
      });

      setNewlyCreatedStageId(res?.stageId || finalStageId);
      setIsPublishing(false);
      setPublishSuccess(true);
    } catch (err) {
      setIsPublishing(false);
      alert(`Publication failed: ${err.message}`);
    }
  };

  const handleReset = () => {
    setTitle('');
    setVersion('v1.3');
    setSummary('');
    setCommit('');
    setNotes('');
    setNewStageName('');
    setStagedFiles([]);
    setPublishSuccess(false);
    setCurrentPipelineStep(-1);
    setErrors({});
  };

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-32 lg:px-sp-48 py-sp-64 font-sans flex flex-col gap-sp-48">
      
      {/* Editorial Header */}
      <header className="border-b border-border pb-sp-32">
        <span className="text-[11px] font-mono font-semibold tracking-widest text-accent uppercase">
          Administration Console
        </span>
        <h1 className="text-page-title font-semibold text-text-primary mt-sp-8 leading-none tracking-tight">
          Release Control Center
        </h1>
        <p className="text-text-secondary text-body mt-sp-12">
          Stage, validate, and publish semester engineering deliverables and version tags.
        </p>
      </header>

      <AnimatePresence mode="wait">
        
        {/* Success Screen Overlay View */}
        {publishSuccess ? (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="border border-border bg-bg-surface rounded-container p-sp-48 flex flex-col items-center justify-center text-center max-w-xl mx-auto gap-sp-24 shadow-1 text-meta"
          >
            <CheckCircle2 className="w-16 h-16 text-status-success fill-status-success-surface" />
            <div className="flex flex-col gap-sp-4">
              <span className="text-section font-semibold text-text-primary tracking-tight">
                Release Published Successfully
              </span>
              <span className="font-mono text-accent font-semibold text-body mt-sp-4">
                Version Release {version} is now Live
              </span>
            </div>

            {/* Validation Checklists */}
            <div className="w-full bg-bg-secondary p-sp-24 border border-border rounded-card text-left flex flex-col gap-sp-12">
              <div className="flex items-center gap-sp-12 font-medium text-text-primary">
                <Check className="w-4 h-4 text-status-success stroke-[3px]" /> Journey Milestone Updated
              </div>
              <div className="flex items-center gap-sp-12 font-medium text-text-primary">
                <Check className="w-4 h-4 text-status-success stroke-[3px]" /> Activity Feed Audit Added
              </div>
              <div className="flex items-center gap-sp-12 font-medium text-text-primary">
                <Check className="w-4 h-4 text-status-success stroke-[3px]" /> Repository Releases Cataloged
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-sp-16 w-full mt-sp-8">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/journey/${newlyCreatedStageId}`)}
                className="flex-1"
              >
                View Release
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Return to Overview
              </Button>
            </div>
            
            <button 
              onClick={handleReset}
              className="text-text-muted hover:text-text-secondary text-meta font-medium underline transition-colors cursor-pointer select-none"
            >
              Draft Another Release
            </button>
          </motion.div>
        ) : (
          
          /* Form Content Split View */
          <motion.div
            key="release-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row gap-sp-48 items-start"
          >
            
            {/* Left Column (35% width): Form parameters */}
            <div className="w-full lg:w-[38%] flex flex-col gap-sp-24 bg-bg-surface border border-border rounded-container p-sp-24 font-sans text-meta">
              
              <div className="border-b border-border-subtle pb-sp-12">
                <span className="font-mono text-[10px] font-semibold text-text-secondary tracking-widest uppercase">
                  Release Parameters
                </span>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-sp-4">
                <label className="font-semibold text-text-primary">Release Title</label>
                <Input
                  placeholder="e.g. Planning Spec Baseline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />
              </div>

              {/* Version & Date split */}
              <div className="grid grid-cols-2 gap-sp-16">
                <div className="flex flex-col gap-sp-4">
                  <label className="font-semibold text-text-primary">Version Tag</label>
                  <Input
                    placeholder="e.g. v1.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    error={errors.version}
                  />
                </div>
                <div className="flex flex-col gap-sp-4">
                  <label className="font-semibold text-text-primary">Release Date</label>
                  <Input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Author Selector */}
              <div className="flex flex-col gap-sp-4">
                <label className="font-semibold text-text-primary">Author Account</label>
                <div className="bg-bg-secondary border border-border rounded-input px-sp-12 py-sp-8 text-text-secondary select-none">
                  <div className="font-medium text-text-primary">{currentUser?.name || 'Loading...'}</div>
                  <div className="text-[11px] font-mono text-text-muted">{currentUser?.email || ''}</div>
                </div>
              </div>

              {/* Related Journey Milestone */}
              <div className="flex flex-col gap-sp-4">
                <label className="font-semibold text-text-primary">Journey Milestone Target</label>
                <Input
                  placeholder="e.g. Planning V3"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  error={errors.stageName}
                />
              </div>

              {/* Commit SHA */}
              <div className="flex flex-col gap-sp-4">
                <label className="font-semibold text-text-primary flex items-center justify-between">
                  <span>Related Git Commit</span>
                  <span className="text-[10px] text-text-muted uppercase">Optional</span>
                </label>
                <Input
                  placeholder="e.g. 9c8b7a6"
                  value={commit}
                  onChange={(e) => setCommit(e.target.value)}
                  maxLength={7}
                  className="font-mono"
                  error={errors.commit}
                />
              </div>

              {/* Summary Description */}
              <div className="flex flex-col gap-sp-4">
                <label className="font-semibold text-text-primary">Changelog Summary</label>
                <textarea
                  placeholder="Write a clear editorial description summarizing changes..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className={`w-full bg-bg-surface border border-border rounded-input px-sp-12 py-sp-8 text-meta focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-surface)] min-h-[90px] text-text-primary transition-all duration-150 ${errors.summary ? 'border-status-error focus:border-status-error focus:shadow-[0_0_0_3px_var(--color-status-error-surface)]' : ''}`}
                />
                {errors.summary && <span className="text-meta font-medium text-status-error mt-sp-4">{errors.summary}</span>}
              </div>

            </div>

            {/* Right Column (62% width): Staged Assets Dropzone */}
            <div className="flex-1 w-full flex flex-col gap-sp-32">
              
              {/* Assets drop zone */}
              <div className="flex flex-col gap-sp-16">
                <span className="font-mono text-[10px] font-semibold text-text-secondary tracking-widest uppercase">
                  Deliverable Assets
                </span>
                
                {/* Upload drag drop panel */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-container p-sp-32 text-center bg-bg-surface flex flex-col items-center justify-center gap-sp-12 transition-colors duration-200 select-none relative ${errors.files ? 'border-status-error' : 'border-border hover:border-accent'}`}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg,.svg,.mp4,.md,.markdown"
                  />
                  <UploadCloud className="w-10 h-10 text-accent" />
                  <div className="flex flex-col gap-sp-4">
                    <span className="text-body font-medium text-text-primary">
                      Drag files here or click to stage
                    </span>
                    <span className="text-meta text-text-muted max-w-xs leading-normal">
                      Supported extensions: PDF, PPT/PPTX, PNG, JPG, SVG, MP4, Markdown notes.
                    </span>
                  </div>
                </div>
                {errors.files && <span className="text-[11px] text-status-error font-medium text-center">{errors.files}</span>}
              </div>

              {/* Staged Assets List */}
              <div className="flex flex-col gap-sp-16 text-meta">
                <span className="font-mono text-[10px] font-semibold text-text-secondary tracking-widest uppercase pb-sp-4 border-b border-border-subtle">
                  Staged Publication Packages ({stagedFiles.length})
                </span>

                <div className="flex flex-col border border-border rounded-card bg-bg-surface divide-y divide-border-subtle max-h-[300px] overflow-y-auto">
                  {stagedFiles.map((file, idx) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div key={idx} className="flex justify-between items-center p-sp-16 hover:bg-bg-secondary transition-colors duration-150">
                        <div className="flex items-center gap-sp-16 min-w-0">
                          <Icon className="w-5 h-5 text-text-muted shrink-0" />
                          <div className="flex flex-col truncate">
                            <span className="font-medium text-text-primary truncate max-w-[280px]">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono uppercase">
                              {file.type} • {file.size}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeStagedFile(idx)}
                          className="p-sp-8 rounded-button text-text-muted hover:text-status-error hover:bg-status-error-surface transition-colors cursor-pointer"
                          title="Remove staged asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                  {stagedFiles.length === 0 && (
                    <div className="p-sp-32 text-center text-text-muted">
                      No files staged yet. Drag deliverables packages into the dropzone.
                    </div>
                  )}
                </div>
              </div>

              {/* Publish Release action button */}
              <div className="flex justify-end pt-sp-16 border-t border-border-subtle mt-auto">
                <Button 
                  variant="primary" 
                  onClick={triggerPublishFlow}
                  className="!w-full sm:!w-auto !h-sp-button-h !px-sp-32"
                >
                  Publish Release
                </Button>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Publication Release"
      >
        <div className="flex flex-col gap-sp-16 font-sans text-meta text-text-secondary leading-relaxed">
          <div className="flex items-start gap-sp-12 bg-bg-elevated p-sp-12 rounded-card border border-border">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p>
              You are about to register version <strong className="text-text-primary">{version}</strong> into the project journey repository. This transaction cannot be undone.
            </p>
          </div>
          <div className="flex flex-col gap-sp-4">
            <span className="font-medium text-text-primary">Staged Release Target:</span>
            <p className="bg-bg-secondary p-sp-8 rounded-card border border-border-subtle font-mono text-[11px] text-text-primary">
              {title}
            </p>
          </div>
          <div className="flex gap-sp-16 justify-end pt-sp-12 border-t border-border-subtle">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmPublication}>
              Confirm Release
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sequential Release Pipeline Overlay Modal */}
      <Modal
        isOpen={isPublishing}
        onClose={() => {}} // Disallow close during active pipeline
        title="Sequential Release Pipeline"
        className="max-w-md"
      >
        <div className="flex flex-col gap-sp-24 font-sans text-meta">
          
          <div className="flex flex-col items-center justify-center py-sp-16 text-center gap-sp-8 border-b border-border-subtle">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
            <h3 className="font-medium text-text-primary mt-sp-8">Compiling and Publishing Deliverables</h3>
            <p className="text-[11px] text-text-muted">Do not close this panel. Evaluating release criteria...</p>
          </div>

          {/* Sequential Stages checklist nodes */}
          <div className="flex flex-col gap-sp-12 relative pl-sp-24 border-l border-border ml-sp-8 max-h-[300px] overflow-y-auto">
            {pipelineSteps.map((step, idx) => {
              const isFinished = idx < currentPipelineStep;
              const isCurrent = idx === currentPipelineStep;
              
              return (
                <div key={idx} className="flex items-start justify-between relative py-0.5">
                  
                  {/* Dot status indicators */}
                  <div className={`absolute -left-[30.5px] w-3 h-3 rounded-full border border-bg-surface mt-1 z-10 transition-all duration-200 ${
                    isFinished ? 'bg-status-success scale-105' : 
                    isCurrent ? 'bg-accent animate-pulse scale-105' : 
                    'bg-border'
                  }`} />

                  <div className="flex flex-col">
                    <span className={`font-medium ${isFinished ? 'text-text-primary' : isCurrent ? 'text-accent font-semibold' : 'text-text-muted'}`}>
                      {step.name}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{step.label}</span>
                  </div>

                  {isFinished && (
                    <Check className="w-3.5 h-3.5 text-status-success shrink-0 stroke-[3px]" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </Modal>

    </div>
  );
}
