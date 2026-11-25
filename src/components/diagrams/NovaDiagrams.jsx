import React from 'react';

/**
 * Architectural diagrams rendered inline with CSS theme tokens so they adapt
 * seamlessly across light and dark modes while matching the flat architectural UI.
 */

export function SystemArchitectureDiagram() {
  return (
    <figure className="border border-border bg-bg-surface p-sp-24 flex flex-col gap-sp-16">
      <div className="flex flex-wrap items-center justify-between gap-sp-8 border-b border-border-subtle pb-sp-12">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
          Diagram 01 · Four-Tier Architecture & Cloud Topology
        </span>
        <span className="font-mono text-[11px] text-text-muted">
          Cloudflare CDN · Render Docker · Neon pgvector
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 430"
          className="w-full min-w-[680px] h-auto font-sans"
          role="img"
          aria-label="NOVA four-tier architecture and deployment topology diagram"
        >
          <defs>
            <marker id="nova-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="var(--color-accent)" />
            </marker>
          </defs>

          {/* Tier 1: Presentation */}
          <rect x="20" y="20" width="200" height="390" fill="var(--color-bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
          <text x="36" y="46" fill="var(--color-accent)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
            01 · PRESENTATION
          </text>
          <text x="36" y="68" fill="var(--color-text-primary)" fontSize="14" fontWeight="600">
            React 19 + Vite SPA
          </text>
          <text x="36" y="88" fill="var(--color-text-secondary)" fontSize="11">
            Cloudflare Worker CDN
          </text>
          <rect x="36" y="108" width="168" height="52" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="48" y="130" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">6-Step Exam Workflow</text>
          <text x="48" y="147" fill="var(--color-text-muted)" fontSize="10">Sources → Blueprint → Bank</text>

          <rect x="36" y="172" width="168" height="52" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="48" y="194" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Reviewer Workspace</text>
          <text x="48" y="211" fill="var(--color-text-muted)" fontSize="10">Checks, Citations, J/K/A/E/R</text>

          <rect x="36" y="236" width="168" height="52" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="48" y="258" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Evaluation &amp; Auditing UI</text>
          <text x="48" y="275" fill="var(--color-text-muted)" fontSize="10">Novelty Weights &amp; 7 Arms</text>

          <rect x="36" y="308" width="168" height="82" fill="var(--color-accent-surface)" stroke="var(--color-accent)" strokeDasharray="3 3" />
          <text x="48" y="330" fill="var(--color-accent)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">EXTERNAL AUTH</text>
          <text x="48" y="348" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Institute Google OIDC</text>
          <text x="48" y="365" fill="var(--color-text-secondary)" fontSize="10">HttpOnly JWT Cookies</text>
          <text x="48" y="380" fill="var(--color-text-muted)" fontSize="10">~105 KB gzipped SPA</text>

          {/* Arrow 1 -> 2 */}
          <line x1="220" y1="160" x2="254" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#nova-arrow)" />
          <text x="223" y="150" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">HTTPS</text>

          {/* Tier 2: API Gateway */}
          <rect x="256" y="20" width="190" height="390" fill="var(--color-bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
          <text x="272" y="46" fill="var(--color-accent)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
            02 · API GATEWAY
          </text>
          <text x="272" y="68" fill="var(--color-text-primary)" fontSize="14" fontWeight="600">
            FastAPI + Uvicorn
          </text>
          <text x="272" y="88" fill="var(--color-text-secondary)" fontSize="11">
            Render Docker (Py 3.14)
          </text>

          <rect x="272" y="108" width="158" height="72" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="284" y="130" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">12 Domain Routers</text>
          <text x="284" y="147" fill="var(--color-text-muted)" fontSize="10">/materials, /blueprints,</text>
          <text x="284" y="162" fill="var(--color-text-muted)" fontSize="10">/runs, /reviews, /papers</text>

          <rect x="272" y="192" width="158" height="70" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="284" y="214" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Pydantic v2 + Scoping</text>
          <text x="284" y="231" fill="var(--color-text-muted)" fontSize="10">scoping.py RBAC guard</text>
          <text x="284" y="246" fill="var(--color-text-muted)" fontSize="10">Strict course_id isolation</text>

          <rect x="272" y="274" width="158" height="116" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="284" y="296" fill="var(--color-accent)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">LLM ADAPTERS</text>
          <text x="284" y="315" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">FailoverRouter</text>
          <text x="284" y="333" fill="var(--color-text-secondary)" fontSize="10">• Local Ollama (qwen3:8b)</text>
          <text x="284" y="350" fill="var(--color-text-secondary)" fontSize="10">• Anthropic Claude API</text>
          <text x="284" y="367" fill="var(--color-text-secondary)" fontSize="10">• Groq Cloud Inference</text>

          {/* Arrow 2 -> 3 */}
          <line x1="446" y1="160" x2="480" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#nova-arrow)" />

          {/* Tier 3: Domain Intelligence */}
          <rect x="482" y="20" width="218" height="390" fill="var(--color-bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
          <text x="498" y="46" fill="var(--color-accent)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
            03 · DOMAIN ENGINES
          </text>
          <text x="498" y="68" fill="var(--color-text-primary)" fontSize="14" fontWeight="600">
            Auditing &amp; Intelligence
          </text>
          <text x="498" y="88" fill="var(--color-text-secondary)" fontSize="11">
            512 MB Memory-Bounded
          </text>

          <rect x="498" y="108" width="186" height="60" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="510" y="129" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Ingestion &amp; ONNX Embedder</text>
          <text x="510" y="145" fill="var(--color-text-muted)" fontSize="10">PyPDF 5-sent / stride-3 chunks</text>
          <text x="510" y="159" fill="var(--color-text-muted)" fontSize="10">all-MiniLM-L6-v2 (384-d)</text>

          <rect x="498" y="178" width="186" height="62" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="510" y="199" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">6-Check Compliance Engine</text>
          <text x="510" y="215" fill="var(--color-text-muted)" fontSize="10">BLOOM_CUES, MARK_BANDS,</text>
          <text x="510" y="229" fill="var(--color-text-muted)" fontSize="10">Quote &gt;= 0.25 + Repair (2x)</text>

          <rect x="498" y="250" width="186" height="64" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="510" y="271" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">4-Signal Novelty Engine</text>
          <text x="510" y="287" fill="var(--color-text-muted)" fontSize="10">Cosine + BM25 + Jaccard + Num</text>
          <text x="510" y="301" fill="var(--color-text-muted)" fontSize="10">Logistic threshold: 0.4881</text>

          <rect x="498" y="324" width="186" height="66" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="510" y="345" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">LightGBM Ranker &amp; PDF</text>
          <text x="510" y="361" fill="var(--color-text-muted)" fontSize="10">Pairwise preference queue</text>
          <text x="510" y="375" fill="var(--color-text-muted)" fontSize="10">ReportLab paper + answer key</text>

          {/* Arrow 3 -> 4 */}
          <line x1="700" y1="205" x2="732" y2="205" stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#nova-arrow)" />
          <text x="703" y="195" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">TLS</text>

          {/* Tier 4: Persistence */}
          <rect x="734" y="20" width="166" height="390" fill="var(--color-bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
          <text x="750" y="46" fill="var(--color-accent)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
            04 · PERSISTENCE
          </text>
          <text x="750" y="68" fill="var(--color-text-primary)" fontSize="14" fontWeight="600">
            PostgreSQL 16
          </text>
          <text x="750" y="88" fill="var(--color-text-secondary)" fontSize="11">
            Neon Serverless + pgvector
          </text>

          <rect x="750" y="108" width="134" height="72" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="760" y="130" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Vector Store</text>
          <text x="760" y="147" fill="var(--color-text-muted)" fontSize="10">384-d HNSW index</text>
          <text x="760" y="162" fill="var(--color-text-muted)" fontSize="10">Sub-15 ms cosine</text>

          <rect x="750" y="192" width="134" height="96" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="760" y="214" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">26 Schema Tables</text>
          <text x="760" y="232" fill="var(--color-text-muted)" fontSize="10">• courses &amp; members</text>
          <text x="760" y="247" fill="var(--color-text-muted)" fontSize="10">• frozen blueprints</text>
          <text x="760" y="262" fill="var(--color-text-muted)" fontSize="10">• runs &amp; candidates</text>
          <text x="760" y="277" fill="var(--color-text-muted)" fontSize="10">• PYQs &amp; bank</text>

          <rect x="750" y="300" width="134" height="90" fill="var(--color-bg-surface)" stroke="var(--color-border)" />
          <text x="760" y="322" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Audit Guarantees</text>
          <text x="760" y="340" fill="var(--color-text-muted)" fontSize="10">SHA-256 dedup</text>
          <text x="760" y="356" fill="var(--color-text-muted)" fontSize="10">role_changes log</text>
          <text x="760" y="372" fill="var(--color-text-muted)" fontSize="10">Immutable bank</text>
        </svg>
      </div>

      <p className="text-meta text-text-secondary leading-relaxed">
        Co-locating relational entities and 384-dimensional chunk vectors inside one Neon PostgreSQL instance (via <code className="font-mono text-text-primary">pgvector</code>) eliminates dual-database drift, while running <code className="font-mono text-text-primary">all-MiniLM-L6-v2</code> in-process via ONNX Runtime avoids external embedding API costs and fits within the 512 MB Render memory ceiling.
      </p>
    </figure>
  );
}

export function PipelineFlowDiagram() {
  return (
    <figure className="border border-border bg-bg-surface p-sp-24 flex flex-col gap-sp-16">
      <div className="flex flex-wrap items-center justify-between gap-sp-8 border-b border-border-subtle pb-sp-12">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
          Diagram 02 · Constrained Generation, 6-Check Compliance &amp; Bounded Repair Loop
        </span>
        <span className="font-mono text-[11px] text-text-muted">
          Budget = 2 Repairs · Zero LLM Self-Grading
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 270"
          className="w-full min-w-[680px] h-auto font-sans"
          role="img"
          aria-label="Constrained generation and repair loop pipeline diagram"
        >
          <defs>
            <marker id="pipe-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="var(--color-accent)" />
            </marker>
            <marker id="repair-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="var(--color-status-warning)" />
            </marker>
          </defs>

          {/* Step 1 */}
          <rect x="16" y="42" width="132" height="84" fill="var(--color-bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
          <text x="28" y="64" fill="var(--color-accent)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">STEP 1</text>
          <text x="28" y="82" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Top-5 Retrieval</text>
          <text x="28" y="99" fill="var(--color-text-muted)" fontSize="10">pgvector cosine</text>
          <text x="28" y="114" fill="var(--color-text-muted)" fontSize="10">Course-scoped</text>

          <line x1="148" y1="84" x2="174" y2="84" stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#pipe-arrow)" />

          {/* Step 2 */}
          <rect x="176" y="42" width="140" height="84" fill="var(--color-bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
          <text x="188" y="64" fill="var(--color-accent)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">STEP 2</text>
          <text x="188" y="82" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">LLM Draft (JSON)</text>
          <text x="188" y="99" fill="var(--color-text-muted)" fontSize="10">Ollama / Claude / Groq</text>
          <text x="188" y="114" fill="var(--color-text-muted)" fontSize="10">Stem + Key + Quotes</text>

          <line x1="316" y1="84" x2="342" y2="84" stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#pipe-arrow)" />

          {/* Step 3 */}
          <rect x="344" y="30" width="174" height="108" fill="var(--color-bg-secondary)" stroke="var(--color-accent)" strokeWidth="1.5" />
          <text x="356" y="52" fill="var(--color-accent)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">STEP 3 · &lt;5 MS</text>
          <text x="356" y="70" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">6 Compliance Checks</text>
          <text x="356" y="87" fill="var(--color-text-secondary)" fontSize="10">1. Bloom cue · 2. Type</text>
          <text x="356" y="102" fill="var(--color-text-secondary)" fontSize="10">3. Marks band · 4. Concept</text>
          <text x="356" y="117" fill="var(--color-text-secondary)" fontSize="10">5. CO · 6. Quote (&gt;=0.25)</text>

          {/* Repair loop feedback */}
          <path
            d="M 431 138 L 431 198 L 246 198 L 246 130"
            fill="none"
            stroke="var(--color-status-warning)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            markerEnd="url(#repair-arrow)"
          />
          <rect x="272" y="180" width="150" height="36" fill="var(--color-status-warning-surface)" stroke="var(--color-status-warning)" />
          <text x="282" y="196" fill="var(--color-status-warning)" fontSize="10" fontWeight="700">Fail &amp; attempt &lt; 2</text>
          <text x="282" y="210" fill="var(--color-text-secondary)" fontSize="9">Inject exact violation msg</text>

          <line x1="518" y1="84" x2="546" y2="84" stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#pipe-arrow)" />

          {/* Step 4 */}
          <rect x="548" y="34" width="168" height="100" fill="var(--color-bg-secondary)" stroke="var(--color-border)" strokeWidth="1.5" />
          <text x="560" y="56" fill="var(--color-accent)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">STEP 4 · PYQ AUDIT</text>
          <text x="560" y="74" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">4-Signal Novelty</text>
          <text x="560" y="91" fill="var(--color-text-secondary)" fontSize="10">Cosine, BM25, Jaccard,</text>
          <text x="560" y="106" fill="var(--color-text-secondary)" fontSize="10">Numerical equivalence</text>
          <text x="560" y="121" fill="var(--color-text-muted)" fontSize="10">Logistic p &gt;= 0.4881 flag</text>

          <line x1="716" y1="84" x2="742" y2="84" stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#pipe-arrow)" />

          {/* Step 5 */}
          <rect x="744" y="34" width="160" height="100" fill="var(--color-bg-secondary)" stroke="var(--color-status-success)" strokeWidth="1.5" />
          <text x="756" y="56" fill="var(--color-status-success)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">STEP 5 · HUMAN GATE</text>
          <text x="756" y="74" fill="var(--color-text-primary)" fontSize="11" fontWeight="600">Rank &amp; Publish</text>
          <text x="756" y="91" fill="var(--color-text-secondary)" fontSize="10">LightGBM queue order</text>
          <text x="756" y="106" fill="var(--color-text-secondary)" fontSize="10">Accept / Edit / Reject</text>
          <text x="756" y="121" fill="var(--color-text-muted)" fontSize="10">Immutable bank + PDF</text>

          {/* Bottom legend note */}
          <text x="16" y="250" fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-mono)">
            Ablation impact: Removing the repair loop drops compliance from 94.2% to 72.4% (-21.8 pp). Removing the novelty filter admits 14.8% duplicate PYQs.
          </text>
        </svg>
      </div>

      <p className="text-meta text-text-secondary leading-relaxed">
        Every generation run records its <code className="font-mono text-text-primary">model</code>, <code className="font-mono text-text-primary">seed</code>, <code className="font-mono text-text-primary">temperature</code>, and <code className="font-mono text-text-primary">prompt_hash</code> so any candidate or failure can be reproduced deterministically. No question enters the Question Bank without explicit human acceptance.
      </p>
    </figure>
  );
}
