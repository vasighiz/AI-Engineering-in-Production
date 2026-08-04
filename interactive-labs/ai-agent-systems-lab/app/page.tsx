"use client";

import { useMemo, useState } from "react";

const lessons = [
  { id: "foundations", n: "01", label: "Foundations" },
  { id: "design", n: "02", label: "Design the system" },
  { id: "patterns", n: "03", label: "Core patterns" },
  { id: "production", n: "04", label: "Production" },
];

const reactSteps = [
  { title: "Reason", text: "I need the customer’s order status before I can answer accurately.", meta: "LLM decision" },
  { title: "Act", text: "Call get_order(order_id: ‘A-1842’)", meta: "Tool request" },
  { title: "Observe", text: "Delivered July 31 · return window closes August 30", meta: "Tool result" },
  { title: "Respond", text: "Your order was delivered July 31 and is still eligible for return.", meta: "Grounded answer" },
];

const patternData = [
  { name: "Reflection", icon: "↻", color: "coral", prompt: "Draft → critique → revise", body: "Use a second pass to find gaps, then improve the result. External feedback—like a real code error—is strongest.", caution: "Adds latency and cost. Evaluate whether it helps." },
  { name: "Tool use", icon: "⌁", color: "blue", prompt: "Request → execute → observe", body: "Give the model a small, typed menu of functions. Your code executes calls; the result returns as context.", caution: "Version, test, rate-limit, and scope tools." },
  { name: "Planning", icon: "◇", color: "amber", prompt: "Plan → act → adapt", body: "The model chooses a sequence from a toolkit and adjusts after each observation.", caution: "More autonomy means more unpredictability." },
  { name: "Multi-agent", icon: "⌘", color: "violet", prompt: "Specialize → hand off → combine", body: "Split work when specialization, parallelism, or context limits justify coordination overhead.", caution: "Start sequential. Define interfaces, not vibes." },
];

export default function Home() {
  const [active, setActive] = useState("foundations");
  const [autonomy, setAutonomy] = useState(52);
  const [step, setStep] = useState(0);
  const [pattern, setPattern] = useState(0);
  const [checks, setChecks] = useState([true, true, false]);
  const [quiz, setQuiz] = useState<number | null>(null);

  const autonomyCopy = useMemo(() => {
    if (autonomy < 34) return { title: "Scripted", tag: "Predictable", text: "Every step is predetermined. Best when the process is stable and precision matters." };
    if (autonomy < 70) return { title: "Semi-autonomous", tag: "Production sweet spot", text: "The agent chooses from defined tools and decisions inside clear guardrails." };
    return { title: "Highly autonomous", tag: "Powerful · risky", text: "The model decides what to search, read, revise, and possibly what code to run." };
  }, [autonomy]);

  const toggleCheck = (i: number) => setChecks((old) => old.map((v, j) => j === i ? !v : v));

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Agent Systems Lab home"><span className="brandmark">A</span><span>AGENT SYSTEMS <b>LAB</b></span></a>
        <div className="course-progress"><span>COURSE PROGRESS</span><div className="progress-track"><i /></div><strong>4 / 4</strong></div>
      </header>

      <section className="hero" id="top">
        <aside className="rail" aria-label="Course navigation">
          {lessons.map((item) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => { setActive(item.id); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }); }}><span>{item.n}</span>{item.label}</button>)}
        </aside>
        <div className="hero-content">
          <p className="eyebrow">INTERACTIVE COURSE · 38 MIN CONCEPTS</p>
          <h1>Build agents that<br/><em>earn</em> autonomy.</h1>
          <p className="lede">A practical lab for turning probabilistic models into reliable systems—one loop, tool, and guardrail at a time.</p>
          <div className="hero-actions"><a className="primary" href="#foundations">Start the lab <span>→</span></a><span className="time">4 modules · 12 interactions</span></div>
        </div>
        <div className="orbit" aria-hidden="true"><div className="orbit-ring r1"><span /></div><div className="orbit-ring r2"><span /></div><div className="core"><small>AGENT</small><b>REASON<br/>ACT<br/>OBSERVE</b></div></div>
      </section>

      <section className="lesson light" id="foundations">
        <div className="section-head"><div><p className="eyebrow">MODULE 01 · FOUNDATIONS</p><h2>From one shot to a loop</h2></div><p>A plain prompt gives one answer. An agent can plan, use tools, inspect evidence, and revise before it answers.</p></div>
        <div className="compare-grid">
          <article className="one-shot"><div className="card-label"><span>✦</span> ONE-SHOT LLM</div><div className="mini-flow"><b>PROMPT</b><i>→</i><b>ANSWER</b></div><p>Fast and simple, but it must reason, research, and write in a single pass.</p><span className="fit">Best for: bounded, low-risk tasks</span></article>
          <article className="loop-card"><div className="card-label"><span>↻</span> AGENTIC LOOP</div><div className="loop-steps">{reactSteps.map((s, i) => <button key={s.title} onClick={() => setStep(i)} className={step === i ? "selected" : ""}><small>0{i + 1}</small><b>{s.title}</b></button>)}</div><div className="terminal"><div><i className="dot red"/><i className="dot yellow"/><i className="dot green"/></div><small>{reactSteps[step].meta}</small><p><span>›</span> {reactSteps[step].text}</p></div><button className="next-step" onClick={() => setStep((step + 1) % reactSteps.length)}>Run next step <span>→</span></button></article>
        </div>

        <div className="autonomy-lab">
          <div><p className="eyebrow">TRY IT · AUTONOMY DIAL</p><h3>How much should the model decide?</h3><p>Move the dial. In real systems, autonomy is a design choice—not a measure of intelligence.</p></div>
          <div className="dial-panel"><div className="dial-copy"><span>{autonomyCopy.tag}</span><h4>{autonomyCopy.title}</h4><p>{autonomyCopy.text}</p></div><input aria-label="Agent autonomy" type="range" min="0" max="100" value={autonomy} onChange={(e) => setAutonomy(+e.target.value)} /><div className="range-labels"><span>Scripted</span><span>Semi-autonomous</span><span>Autonomous</span></div></div>
        </div>
      </section>

      <section className="lesson ink" id="design">
        <div className="section-head"><div><p className="eyebrow">MODULE 02 · DESIGN THE SYSTEM</p><h2>Decompose until<br/>each step is reliable.</h2></div><blockquote>“How would a human do this—and can an LLM reliably do each step?”</blockquote></div>
        <div className="pipeline">
          {[
            ["01", "Outline", "LLM", "Define the argument"], ["02", "Search terms", "LLM", "Turn gaps into queries"], ["03", "Research", "TOOL", "Fetch real sources"], ["04", "Draft", "LLM", "Write with evidence"], ["05", "Critique", "JUDGE", "Find missing pieces"], ["06", "Revise", "LLM", "Apply the feedback"],
          ].map((x, i) => <div className="pipe" key={x[1]}><small>{x[0]}</small><span className={`type t${i}`}>{x[2]}</span><h4>{x[1]}</h4><p>{x[3]}</p>{i < 5 && <i>→</i>}</div>)}
        </div>
        <div className="principle"><span>KEY PRINCIPLE</span><p>Small steps are <b>checkable</b>. When quality drops, the trace tells you exactly which component to fix.</p></div>
      </section>

      <section className="lesson paper" id="patterns">
        <div className="section-head"><div><p className="eyebrow">MODULE 03 · CORE PATTERNS</p><h2>Four ways to add capability</h2></div><p>These patterns reliably improve agent systems—but each one should pay for its added cost and complexity.</p></div>
        <div className="pattern-tabs">{patternData.map((p, i) => <button key={p.name} className={pattern === i ? "active" : ""} onClick={() => setPattern(i)}><span className={p.color}>{p.icon}</span>{p.name}</button>)}</div>
        <div className="pattern-stage">
          <div className={`big-icon ${patternData[pattern].color}`}>{patternData[pattern].icon}</div>
          <div><p className="eyebrow">PATTERN {String(pattern + 1).padStart(2, "0")}</p><h3>{patternData[pattern].prompt}</h3><p>{patternData[pattern].body}</p><div className="caution"><span>WATCH FOR</span>{patternData[pattern].caution}</div></div>
        </div>
      </section>

      <section className="lesson production" id="production">
        <div className="section-head"><div><p className="eyebrow">MODULE 04 · PRODUCTION</p><h2>“It works” is the starting line.</h2></div><p>A production-ready agent balances five forces. Improving one can make another worse.</p></div>
        <div className="five-forces">{[["Quality","Does it do the job?","88"],["Latency","How long does it take?","64"],["Cost","What does each run cost?","72"],["Observability","Can we explain failures?","81"],["Security","Can it act safely?","76"]].map((x) => <article key={x[0]}><div><h4>{x[0]}</h4><b>{x[2]}<small>%</small></b></div><p>{x[1]}</p><span><i style={{width:`${x[2]}%`}} /></span></article>)}</div>
        <div className="guardrail-lab">
          <div><p className="eyebrow">SHIP GATE · RETURN-REFUND AGENT</p><h3>Choose the safeguards</h3><p>Most production systems combine at least two. Deterministic checks should handle anything code can verify.</p>
            {[['Code checks','Validate amount, format, and return window'],['LLM judge','Check policy consistency and tone'],['Human approval','Required before issuing the refund']].map((x,i)=><button key={x[0]} onClick={()=>toggleCheck(i)} className={checks[i]?"checked":""}><span>{checks[i]?"✓":""}</span><div><b>{x[0]}</b><small>{x[1]}</small></div></button>)}
          </div>
          <div className="ship-card"><span className={checks.filter(Boolean).length >= 2 ? "safe" : "unsafe"}>{checks.filter(Boolean).length >= 2 ? "READY FOR REVIEW" : "INSUFFICIENT COVERAGE"}</span><div className="shield">{checks.filter(Boolean).length >= 2 ? "✓" : "!"}</div><h4>{checks.filter(Boolean).length}/3 safeguards active</h4><p>{checks.filter(Boolean).length >= 2 ? "The run can proceed to its selected approval path." : "Add another independent quality gate before shipping."}</p></div>
        </div>

        <div className="quiz"><div><p className="eyebrow">FINAL CHECK</p><h3>A complex lecture-summary task tolerates minor imperfections. Is it a good first agent project?</h3></div><div className="answers">{["No—complex tasks are always a bad start.","Yes—high complexity + lower precision is often a smart starting point.","Only if it uses multiple agents."].map((a,i)=><button key={a} className={quiz===i?(i===1?"correct":"wrong"):""} onClick={()=>setQuiz(i)}><span>{String.fromCharCode(65+i)}</span>{a}</button>)}{quiz!==null&&<p className={quiz===1?"feedback good":"feedback"}>{quiz===1?"Correct. You get leverage from iteration without requiring perfection every run.":"Not quite. Agent-worthiness depends on complexity and precision—not on multi-agent architecture."}</p>}</div></div>
      </section>

      <footer><div className="brand"><span className="brandmark">A</span><span>AGENT SYSTEMS <b>LAB</b></span></div><p>Adapted from Marina Wyss’s “AI Agents in 38 Minutes” course summary.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
