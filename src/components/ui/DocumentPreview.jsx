import React, { useState } from 'react';
import { Eye, FileText, Play, Image as ImageIcon, Download, Presentation } from 'lucide-react';
import { Button } from './Button';

// A lightweight custom markdown formatter to render markdown deliverables cleanly
const MarkdownRenderer = ({ content = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const formattedElements = lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('###')) {
      return <h4 key={idx} className="text-card font-semibold text-text-primary mt-sp-16 mb-sp-8">{trimmed.replace('###', '').trim()}</h4>;
    }
    if (trimmed.startsWith('##')) {
      return <h3 key={idx} className="text-section font-semibold text-text-primary mt-sp-24 mb-sp-12">{trimmed.replace('##', '').trim()}</h3>;
    }
    if (trimmed.startsWith('#')) {
      return <h2 key={idx} className="text-page-title font-semibold text-text-primary mt-sp-32 mb-sp-16">{trimmed.replace('#', '').trim()}</h2>;
    }
    if (trimmed.startsWith('-')) {
      return (
        <li key={idx} className="ml-sp-16 list-disc text-body text-text-secondary mb-sp-4">
          {trimmed.substring(1).trim()}
        </li>
      );
    }
    if (trimmed === '') return <div key={idx} className="h-sp-8" />;
    return <p key={idx} className="text-body text-text-secondary leading-relaxed mb-sp-12">{trimmed}</p>;
  });

  return <div className="prose max-w-none">{formattedElements}</div>;
};

// Local slideshow mockup for PPT presentation previewing
const SlideshowPreview = ({ assetName }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const slides = [
    { title: "Project Overview", bullet1: "Problem Statement: Collaborative workspace synchrony.", bullet2: "Goal: Browser sandbox compiler execution pipelines." },
    { title: "System Architecture", bullet1: "Frontend: React, Tailwind CSS v4, Framer Motion.", bullet2: "Backend: WebSockets sync broker and Go execution API." },
    { title: "Risk Mitigation", bullet1: "High Wi-Fi latency fallbacks.", bullet2: "Local browser WebAssembly sandboxes." },
    { title: "Timeline Milestones", bullet1: "Planning spec completion.", bullet2: "Midterm prototype compilation schedules." }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
  };

  const activeSlide = slides[currentSlide - 1];

  return (
    <div className="flex flex-col border border-border-default rounded-card overflow-hidden bg-bg-main">
      {/* Slide Canvas */}
      <div className="flex flex-col items-center justify-center p-sp-48 text-center min-h-[320px] bg-white border-b border-border-subtle relative select-none">
        <span className="absolute top-sp-16 left-sp-24 text-[10px] font-mono text-text-muted font-bold tracking-widest uppercase">
          {assetName} (MOCK)
        </span>
        <h4 className="text-section font-bold text-accent-primary tracking-tight mb-sp-24">
          {activeSlide.title}
        </h4>
        <div className="flex flex-col gap-sp-8 text-body text-text-secondary max-w-md">
          <p>• {activeSlide.bullet1}</p>
          <p>• {activeSlide.bullet2}</p>
        </div>
      </div>
      {/* Slide Controls */}
      <div className="flex items-center justify-between px-sp-24 py-sp-12 bg-bg-elevated font-sans">
        <span className="text-meta text-text-secondary font-mono">
          Slide {currentSlide} of {slides.length}
        </span>
        <div className="flex gap-sp-8">
          <Button variant="outline" onClick={handlePrev} disabled={currentSlide === 1} className="!h-8 !px-sp-8 !text-meta">
            Prev
          </Button>
          <Button variant="outline" onClick={handleNext} disabled={currentSlide === slides.length} className="!h-8 !px-sp-8 !text-meta">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
const resolveAssetPath = (asset) => {
  if (!asset) return '#';
  
  const backendUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'https://rudraksh.alwaysdata.net';

  if (asset.id) {
    return `${backendUrl}/api/files/${asset.id}`;
  }

  const path = asset.path;
  if (!path) return '#';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/uploads')) {
    return `${backendUrl}${path}`;
  }
  return path;
};


export const DocumentPreview = ({ assets = [], className = '' }) => {
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [fileMissing, setFileMissing] = useState(false);

  if (!assets || assets.length === 0) {
    return (
      <div className="border border-dashed border-border-default rounded-card p-sp-48 text-center bg-bg-elevated flex flex-col items-center justify-center gap-sp-12 font-sans select-none">
        <FileText className="w-8 h-8 text-text-muted" />
        <h4 className="text-card font-semibold text-text-primary">No Assets Published</h4>
        <p className="text-meta text-text-secondary max-w-xs">
          Draft milestone document in preparation. Published assets will appear here once release compile runs.
        </p>
      </div>
    );
  }

  const activeAsset = assets[activeAssetIndex] || assets[0];

  React.useEffect(() => {
    setFileMissing(false);
    if (!activeAsset || !activeAsset.path || activeAsset.path === '#') {
      setFileMissing(true);
      return;
    }
    
    // Query file header to check if Vite fallback index.html is returned (indicating a 404 route)
    fetch(resolveAssetPath(activeAsset), { method: 'HEAD' })
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (res.status === 404 || contentType.includes('text/html')) {
          setFileMissing(true);
        }
      })
      .catch(() => {
        setFileMissing(true);
      });
  }, [activeAsset]);

  const getAssetIcon = (type) => {
    const t = type ? type.toLowerCase() : '';
    if (t === 'pdf') return FileText;
    if (t === 'ppt' || t === 'pptx') return Presentation;
    if (t === 'image' || t === 'png' || t === 'jpg' || t === 'jpeg' || t === 'svg') return ImageIcon;
    if (t === 'video' || t === 'mp4') return Play;
    return FileText;
  };

  const renderPreview = () => {
    const t = activeAsset.type ? activeAsset.type.toLowerCase() : '';
    const isImage = t === 'image' || t === 'png' || t === 'jpg' || t === 'jpeg' || t === 'svg';
    const isVideo = t === 'video' || t === 'mp4';
    
    if (fileMissing && (t === 'pdf' || isImage || isVideo)) {
      return (
        <div className="border border-dashed border-border-default rounded-card p-sp-48 text-center bg-bg-elevated flex flex-col items-center justify-center gap-sp-12 font-sans select-none min-h-[350px]">
          <FileText className="w-8 h-8 text-accent-primary" />
          <h4 className="text-card font-semibold text-text-primary">{activeAsset.name}</h4>
          <p className="text-meta text-text-secondary max-w-xs">
            This asset file is staged for release. Once the release pipeline completes and files deploy to production hosting, the live document preview will render here.
          </p>
        </div>
      );
    }

    switch (activeAsset.type) {
      case 'pdf':
        return (
          <div className="flex flex-col gap-sp-12">
            <iframe
              src={resolveAssetPath(activeAsset)}
              title={activeAsset.name}
              className="w-full h-[550px] border border-border-default rounded-card bg-white"
            />
            <div className="flex justify-between items-center bg-bg-secondary p-sp-12 rounded border border-border-default text-meta">
              <span className="text-text-secondary truncate font-mono">{activeAsset.path}</span>
              <a 
                href={resolveAssetPath(activeAsset)} 
                target="_blank" 
                rel="noopener noreferrer" 
                download 
                className="flex items-center gap-sp-8 text-accent-primary font-semibold hover:text-accent-hover transition-colors"
              >
                <Eye className="w-4 h-4" /> Open PDF / View Deliverable (.pdf)
              </a>
            </div>
          </div>
        );
      case 'ppt':
      case 'pptx':
        return (
          <div className="flex flex-col gap-sp-16">
            <SlideshowPreview assetName={activeAsset.name} />
            <div className="flex justify-between items-center bg-bg-secondary p-sp-12 rounded border border-border-default text-meta">
              <span className="text-text-secondary font-mono">{activeAsset.name}</span>
              <a 
                href={resolveAssetPath(activeAsset)} 
                target="_blank" 
                rel="noopener noreferrer" 
                download 
                className="flex items-center gap-sp-8 text-accent-primary font-semibold hover:text-accent-hover transition-colors"
              >
                <Eye className="w-4 h-4" /> Open PPT File / View Deliverable (.pptx)
              </a>
            </div>
          </div>
        );
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return (
          <div className="flex flex-col gap-sp-12">
            <div className="border border-border-default rounded-card bg-white p-sp-16 flex items-center justify-center min-h-[320px]">
              {/* Geometric fallback image block with CSS token coloring */}
              <div className="w-full h-72 border border-border-subtle rounded-card bg-bg-main relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-accent-light/10 border-2 border-dashed border-accent-primary/20 rounded-card m-sp-16 flex flex-col items-center justify-center gap-sp-12 text-center">
                  <ImageIcon className="w-8 h-8 text-accent-primary" />
                  <span className="text-meta font-semibold text-text-primary">{activeAsset.name}</span>
                  <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Image preview placeholder</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-bg-secondary p-sp-12 rounded border border-border-default text-meta">
              <span className="text-text-secondary truncate font-mono">{activeAsset.name}</span>
              <a 
                href={resolveAssetPath(activeAsset)} 
                target="_blank" 
                rel="noopener noreferrer" 
                download 
                className="flex items-center gap-sp-8 text-accent-primary font-semibold hover:text-accent-hover transition-colors"
              >
                <Download className="w-4 h-4" /> Download Image Asset
              </a>
            </div>
          </div>
        );
      case 'video':
      case 'mp4':
        return (
          <div className="flex flex-col gap-sp-12">
            <div className="border border-border-default rounded-card bg-white p-sp-8 flex items-center justify-center min-h-[320px]">
              <div className="w-full h-72 bg-[#1C1C1C] rounded-card flex flex-col items-center justify-center text-white gap-sp-16 relative">
                <Play className="w-12 h-12 text-accent-primary fill-accent-primary" />
                <span className="text-meta text-text-muted">{activeAsset.name}</span>
                <span className="absolute bottom-sp-12 right-sp-16 text-[10px] text-text-muted font-mono tracking-widest uppercase">HTML5 player sandbox</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-bg-secondary p-sp-12 rounded border border-border-default text-meta">
              <span className="text-text-secondary truncate font-mono">{activeAsset.name}</span>
              <a 
                href={resolveAssetPath(activeAsset)} 
                target="_blank" 
                rel="noopener noreferrer" 
                download 
                className="flex items-center gap-sp-8 text-accent-primary font-semibold hover:text-accent-hover transition-colors"
              >
                <Download className="w-4 h-4" /> Download Video File (.mp4)
              </a>
            </div>
          </div>
        );
      case 'markdown':
        return (
          <div className="border border-border-default rounded-card bg-white p-sp-32 min-h-[320px]">
            <MarkdownRenderer content={activeAsset.content} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row gap-sp-24 font-sans ${className}`}>
      
      {/* Left side File Tab Selector List */}
      <div className="w-full lg:w-1/4 shrink-0 flex flex-row lg:flex-col overflow-x-auto gap-sp-8 border-b lg:border-b-0 lg:border-r border-border-subtle pb-sp-16 lg:pb-0 lg:pr-sp-16">
        {assets.map((asset, i) => {
          const Icon = getAssetIcon(asset.type);
          const isActive = i === activeAssetIndex;

          return (
            <button
              key={i}
              onClick={() => setActiveAssetIndex(i)}
              className={`flex items-center gap-sp-12 px-sp-12 py-sp-8 rounded-button text-meta font-medium cursor-pointer text-left transition-all truncate shrink-0 ${
                isActive 
                  ? 'bg-accent-light text-accent-primary border border-accent-primary/20' 
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[120px] lg:max-w-none">{asset.name}</span>
            </button>
          );
        })}
      </div>

      {/* Right side Preview Window Canvas */}
      <div className="flex-1 min-w-0">
        {renderPreview()}
      </div>

    </div>
  );
};
