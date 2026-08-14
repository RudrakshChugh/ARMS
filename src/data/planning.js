export const planningData = {
  "v1.0": {
    version: "v1.0",
    date: "Aug 26, 2026",
    author: "Manya Kedia",
    commit: "a82fc21",
    status: "Published",
    sections: [
      {
        id: "overview",
        title: "Overview",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "The UCS503 engineering portal is a document-first release catalog mapping student code proposals, deliverables, and release audits over the course of the academic semester.",
        bullets: [
          "Establishes a single source of truth for team responsibilities.",
          "Verifies pipeline uploads reactively without manual refresh rules."
        ]
      },
      {
        id: "problem",
        title: "Problem Statement",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "Remote undergraduate teams experience project drift due to uncoordinated documentation, broken deployment configurations, and subjective grading practices.",
        bullets: [
          "Loss of historical planning revisions during the semester.",
          "Lack of traceable links between code commits and deliverables."
        ]
      },
      {
        id: "users",
        title: "Target Users",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "Primarily targets course instructors grading milestones, student developers syncing workflows, and external technical reviewers auditing code quality.",
        bullets: [
          "Course Coordinator (Admin review access).",
          "Student Engineers (Document and release publisher permissions)."
        ]
      },
      {
        id: "requirements",
        title: "System Requirements",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "Initial specifications outlining core functional operations for staging page renders and tracking timeline progression rails.",
        functional: [
          { id: "FR-01", desc: "Interactive timeline rail rendering milestone nodes.", priority: "Critical", status: "Completed" },
          { id: "FR-02", desc: "Release catalog representing published documents.", priority: "High", status: "Completed" }
        ],
        nonfunctional: [
          { id: "NFR-01", desc: "Page loads must complete in under 1 second.", category: "Performance", priority: "High", status: "Completed" },
          { id: "NFR-02", desc: "Responsive rendering supporting mobile/tablet sizes.", category: "Accessibility", priority: "Critical", status: "Completed" }
        ]
      },
      {
        id: "architecture",
        title: "System Architecture",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "High-level client-server split leveraging React single-page setups and state-sharing frameworks.",
        components: [
          { name: "Frontend Interface", desc: "React + Tailwind CSS design systems rendering primitives." },
          { name: "Global State Provider", desc: "React Context binding release pipelines." }
        ]
      },
      {
        id: "data",
        title: "Data Models",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "In-memory state records linking milestones, changelogs, publications, and activity markers.",
        bullets: [
          "Stage model containing author, status, and related assets array.",
          "Publication schema listing release validation steps log."
        ]
      },
      {
        id: "security",
        title: "Security Protocols",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "Client-side routing guards restricting dashboard publishing triggers to authenticated administrators.",
        bullets: [
          "Secure admin login interface.",
          "Local storage token persistence."
        ]
      },
      {
        id: "testing",
        title: "Testing Strategy",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Draft",
        text: "Baseline focus on UI primitive rendering verification and compilation health scripts.",
        bullets: [
          "Verify production compilation scripts build in under 5 seconds."
        ]
      },
      {
        id: "timeline",
        title: "Development Timeline",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "Standard semester mapping starting with idea exploration and concluding with production presentation logs.",
        bullets: [
          "Weeks 1-4: Project design grids and planning documentation.",
          "Weeks 5-8: Midterm core synchronization code prototypes."
        ]
      },
      {
        id: "risks",
        title: "Risk Analysis",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "Identified campus network latency issues disrupting collaborative operational sync hooks.",
        bullets: [
          "Websocket connection dropout risk under high campus loads."
        ]
      },
      {
        id: "deployment",
        title: "Deployment Plan",
        lastModified: "Aug 26, 2026",
        version: "v1.0",
        status: "Baseline",
        text: "Automated compiler distribution loading files directly into Vercel staging networks.",
        bullets: [
          "GitHub actions pipeline compiling and staging releases."
        ]
      }
    ]
  },
  "v2.0": {
    version: "v2.0",
    date: "Sep 10, 2026",
    author: "Rohan Varma",
    commit: "9c8b7a6",
    status: "Revision",
    sections: [
      {
        id: "overview",
        title: "Overview",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "The UCS503 engineering portal is an auditable workspace tracking project journey stages, publication logs, and multi-asset document previews.",
        bullets: [
          "Establishes a single source of truth for team responsibilities.",
          "Verifies pipeline uploads reactively without manual refresh rules.",
          "Supports multiple deliverables per stage (PDF, PPT, images, notes)."
        ]
      },
      {
        id: "problem",
        title: "Problem Statement",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Remote undergraduate teams experience project drift due to uncoordinated documentation, broken deployment configurations, and subjective grading practices.",
        bullets: [
          "Loss of historical planning revisions during the semester.",
          "Lack of traceable links between code commits and deliverables.",
          "Inability to review multiple associated deliverable types side-by-side."
        ]
      },
      {
        id: "users",
        title: "Target Users",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Primarily targets course instructors grading milestones, student developers syncing workflows, and external technical reviewers auditing code quality.",
        bullets: [
          "Course Coordinator (Admin review access).",
          "Student Engineers (Document and release publisher permissions)."
        ]
      },
      {
        id: "requirements",
        title: "System Requirements",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Refined specifications incorporating multi-asset selectors, release pipeline animations, and version comparators.",
        functional: [
          { id: "FR-01", desc: "Interactive timeline rail rendering milestone nodes.", priority: "Critical", status: "Completed" },
          { id: "FR-02", desc: "Release catalog representing published documents.", priority: "High", status: "Completed" },
          { id: "FR-03", desc: "Interactive slideshow previewer for presentation assets.", priority: "Medium", status: "Completed" },
          { id: "FR-04", desc: "Sequential publication progress pipeline loader.", priority: "High", status: "Completed" }
        ],
        nonfunctional: [
          { id: "NFR-01", desc: "Page loads must complete in under 1 second.", category: "Performance", priority: "High", status: "Completed" },
          { id: "NFR-02", desc: "Responsive rendering supporting mobile/tablet sizes.", category: "Accessibility", priority: "Critical", status: "Completed" },
          { id: "NFR-03", desc: "Visible focus outlines on form controls.", category: "Accessibility", priority: "High", status: "Completed" }
        ]
      },
      {
        id: "architecture",
        title: "System Architecture",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Client-server architecture utilizing Vite React, Tailwind CSS v4 variables theme, and Framer Motion pipelines.",
        components: [
          { name: "Frontend Interface", desc: "React + Tailwind CSS design systems rendering primitives." },
          { name: "Global State Provider", desc: "React Context binding release pipelines." },
          { name: "DocumentPreview Primitive", desc: "Selector component managing PDF, PPT slideshows, images, and Markdown notes." }
        ]
      },
      {
        id: "data",
        title: "Data Models",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "In-memory state records linking milestones, changelogs, publications, and activity markers.",
        bullets: [
          "Stage model containing author, status, and related assets array.",
          "Publication schema listing release validation steps log.",
          "Asset schema mapping name, type, and source path parameters."
        ]
      },
      {
        id: "security",
        title: "Security Protocols",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Access control protocols protecting publication triggers with credentials validation.",
        bullets: [
          "Secure admin login interface.",
          "Local storage token persistence.",
          "Route guard protection on admin paths."
        ]
      },
      {
        id: "testing",
        title: "Testing Strategy",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Comprehensive QA verification consisting of unit tests, build checks, and manual responsive reviews.",
        bullets: [
          "Verify production compilation scripts build in under 5 seconds.",
          "Manual UI validation checking 375px, 768px, and 1440px viewports."
        ]
      },
      {
        id: "timeline",
        title: "Development Timeline",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Refined developmental milestones focusing on integration, testing, and cd logs.",
        bullets: [
          "Weeks 1-4: Project design grids and planning documentation.",
          "Weeks 5-8: Midterm core synchronization code prototypes.",
          "Weeks 9-12: Full integration, validation checks, and presentation."
        ]
      },
      {
        id: "risks",
        title: "Risk Analysis",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Identified campus network latency issues disrupting collaborative operational sync hooks.",
        bullets: [
          "Websocket connection dropout risk under high campus loads.",
          "Browser file preview failures under older engines."
        ]
      },
      {
        id: "deployment",
        title: "Deployment Plan",
        lastModified: "Sep 10, 2026",
        version: "v2.0",
        status: "Active",
        text: "Automated compiler distribution loading files directly into Vercel staging networks.",
        bullets: [
          "GitHub actions pipeline compiling and staging releases.",
          "Production builds deployed onto AWS S3 and served via CloudFront."
        ]
      }
    ]
  }
};
