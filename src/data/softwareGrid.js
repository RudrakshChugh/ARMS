export const projectIdeas = [
  {
    id: 1,
    ideaNumber: "01",
    projectName: "EduTrace: Lab Access & Asset Auditing",
    oneLineProblem: "Decentralized laboratory equipment tracking leading to asset leakage and poor utilization.",
    primaryUser: "Lab Assistants & Department Head",
    feasibility: "High",
    risk: "Low",
    innovation: "Moderate",
    ranking: "3",
    isPrimary: false,
    expanded: {
      problem: "Currently, university lab assets (FPGA boards, oscilloscopes, sensors) are manually signed out on paper logs. This causes lost inventory, untraceable damage, and double-booking conflicts.",
      targetUsers: "Lab administrators, student researchers, and department auditing teams.",
      existingAlternatives: "Paper sign-out books and static Excel spreadsheets hosted on local network shares.",
      whatWeDoBetter: "Real-time check-in/out via RFID scanning, automated reservation scheduling, and hardware status history reporting.",
      engineeringChallenge: "Ensuring offline reliability of the scanner nodes and handling concurrent reservation disputes.",
      systemComponents: "RFID listener endpoint, scheduling engine, and asset registry database.",
      requiredTechnology: "React, Node.js, Express, PostgreSQL, WebSockets.",
      validationStrategy: "Run a pilot sign-out trial with 20 students in the Microcontroller Lab for one week.",
      risks: "Hardware reader network disconnects or student badges fail to scan.",
      fallbackPlan: "Provide manual code entry via the mobile web portal as a secondary sign-out method.",
      rankingJustification: "Highly feasible but solves a localized administrative issue rather than providing deep software-engineering learning opportunities."
    }
  },
  {
    id: 2,
    ideaNumber: "02",
    projectName: "PeerReview: Automated Peer Code Critique",
    oneLineProblem: "Manual peer review in programming classes is disorganized, lacks anonymity, and delays feedback.",
    primaryUser: "Course Instructors & TAs",
    feasibility: "Medium",
    risk: "Medium",
    innovation: "High",
    ranking: "2",
    isPrimary: false,
    expanded: {
      problem: "Students in coding classes need peer feedback to grow, but sharing files manually leads to bias, unformatted code reviews, and missed deadlines.",
      targetUsers: "Teaching assistants grading submissions and students reviewing peer code repositories.",
      existingAlternatives: "GitHub pull requests (requires manual setup per student group) or submission portals like Moodle.",
      whatWeDoBetter: "Automated distribution of student repositories with double-blind review channels, inline markdown review syntax, and rubric-based rating scales.",
      engineeringChallenge: "Safely sandboxing and rendering student repositories directly in the browser while protecting private identity meta-data.",
      systemComponents: "Code rendering engine, reviewer matching scheduler, grading pipeline, and identity blinding filter.",
      requiredTechnology: "React, Docker sandbox, Go backend, PostgreSQL database.",
      validationStrategy: "Deploy a small pilot reviews environment for a CSE class of 50 students.",
      risks: "Malicious code uploaded in student packages could compromise sandbox nodes.",
      fallbackPlan: "Downgrade browser-level file inspection to plain-text rendering and restrict script execution during pilot.",
      rankingJustification: "Highly relevant but has security sandboxing complexities that might extend past the semester deadline."
    }
  },
  {
    id: 3,
    ideaNumber: "03",
    projectName: "CollabSync: Real-time Live Code Editor & Sandbox",
    oneLineProblem: "Programming students struggle with collaborative pair-programming and environment mismatch during remote team assignments.",
    primaryUser: "CS Students & Team Leaders",
    feasibility: "High",
    risk: "Medium",
    innovation: "High",
    ranking: "1",
    isPrimary: true, // Selected #1 Project
    expanded: {
      problem: "Collaborative tools like VS Code Live Share are heavy, require installation, and fail to enforce local workspace consistency across different student platforms.",
      targetUsers: "Undergraduate programming teams collaborating on remote semester assignments.",
      existingAlternatives: "VS Code Live Share, Replit, static git repositories.",
      whatWeDoBetter: "Lightweight browser-based operational transformation (OT) editor syncing in real-time, coupled with instant Node/Python execution sandboxes directly linked to project portals.",
      engineeringChallenge: "Resolving synchronization conflicts reliably (Operational Transformation / CRDTs) and securing remote script execution containers from infinite loops or memory depletion.",
      systemComponents: "Real-time sync broker (WebSockets), virtual sandbox executors, file tree coordinator, and revision manager.",
      requiredTechnology: "React, Vite, Tailwind v4, Socket.io, Express, Docker sandbox containers.",
      validationStrategy: "Test execution speed and collaboration delays with 5 simultaneous users editing a multi-file Python codebase.",
      risks: "High websocket latency under campus Wi-Fi networks or container memory leaks.",
      fallbackPlan: "Implement high-frequency polling auto-save structures and fallback to local browser-level execution (WebAssembly) if containers crash.",
      rankingJustification: "Combines high engineering depth, clear containerized architecture, immediate value to peer students, and matches the semester timeline."
    }
  },
  {
    id: 4,
    ideaNumber: "04",
    projectName: "GradingFlow: Canvas Automated Grade Predictor",
    oneLineProblem: "Undergraduates suffer from academic stress due to lack of visibility into final grade scenarios based on current assignments.",
    primaryUser: "Students seeking grade forecasting",
    feasibility: "Medium",
    risk: "Low",
    innovation: "Medium",
    ranking: "4",
    isPrimary: false,
    expanded: {
      problem: "University LMS portals (like Canvas) only show completed assignments, neglecting future weighted scenarios, custom scaling rules, or passing threshold warnings.",
      targetUsers: "Undergraduates planning course distributions across multiple terms.",
      existingAlternatives: "Canvas default 'What-if' grade module (lacks predictive scaling and cross-class analytics).",
      whatWeDoBetter: "Predictive scaling based on historical class averages, goal-backtracking calculation (showing precisely what grade is needed on remaining items), and workload distribution schedules.",
      engineeringChallenge: "Accurately scraping Canvas data structures without formal administrator API tokens or credentials.",
      systemComponents: "API wrapper proxy, Monte Carlo simulation model, and target optimization database.",
      requiredTechnology: "React, Python, SQLite database, Flask server proxy.",
      validationStrategy: "Manually contrast predictor models with actual syllabus grades of 10 volunteer students.",
      risks: "LMS structures change mid-semester, breaking API parser integrations.",
      fallbackPlan: "Enable raw Excel grade definition importing as a manual fallback structure.",
      rankingJustification: "Highly prone to API breaking changes and lacks technical complexity in core backend services compared to CollabSync."
    }
  }
];

export const comparisonMatrix = {
  columns: ["CollabSync (Selected #1)", "PeerReview", "EduTrace", "GradingFlow"],
  rows: [
    { metric: "Problem Severity", values: ["Critical", "High", "Moderate", "Low"] },
    { metric: "Novelty", values: ["High", "High", "Low", "Moderate"] },
    { metric: "Engineering Depth", values: ["Extremely High", "High", "Moderate", "Low"] },
    { metric: "Feasibility", values: ["High", "Medium", "High", "Medium"] },
    { metric: "Data Availability", values: ["Instant", "Mocked", "Hardware-dependent", "API restricted"] },
    { metric: "Security Complexity", values: ["Medium", "High", "Low", "Low"] },
    { metric: "Integration Risk", values: ["Moderate", "High", "Low", "High"] },
    { metric: "Testing Potential", values: ["High", "High", "Medium", "Low"] },
    { metric: "Semester Suitability", values: ["Excellent", "Good", "Fair", "Poor"] },
    { metric: "Overall Rank", values: ["Rank #1", "Rank #2", "Rank #3", "Rank #4"] }
  ]
};
