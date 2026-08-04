# 11. Architecture and User Feedback

A complete AI application grows from a simple model call into a system containing context, guardrails, routing, caching, tools, monitoring, and feedback.

Complexity should be added only when it solves a real problem.

## 11.1 The simplest architecture

The most basic system:

1. Receives a query.
2. Sends it to a model.
3. Returns the response.

The model may be accessed through a third-party API or hosted internally.

This architecture is useful for prototypes but usually lacks the information, control, reliability, and operational features needed for production.

## 11.2 Stage 1: Improve context construction

The first major enhancement is usually better context.

The course describes context construction as similar to feature engineering for foundation models: the system assembles the information the model needs for the current task.

Possible components include:

- RAG over a knowledge base
- Agent tools that gather external information
- Document upload and analysis
- Conversation history
- Structured database results

The goal is to provide relevant, current, and task-specific information rather than relying only on model memory.

## 11.3 Stage 2: Add guardrails

Guardrails protect users, data, and external systems.

### Input guardrails

Protect against:

- Sending private information to external APIs
- Malicious prompts
- Prompt injection
- Invalid formats
- Unauthorized requests

### Output guardrails

Detect:

- Empty or malformed responses
- Incorrect formatting
- Factually incorrect content
- Toxic output
- Exposure of personally identifiable information
- Unauthorized actions

Guardrails must balance safety and usability. Excessive restriction creates false refusals and frustration; weak guardrails create security and quality risk.

## 11.4 Stage 3: Add model routing and a gateway

One model may not be best for every query.

A **model router** can:

1. Classify user intent.
2. Select the appropriate model or pipeline.

Routers should be fast and inexpensive because they add overhead to every request.

A **model gateway** provides a unified interface across commercial and self-hosted models. It can manage:

- Authentication and access control
- Cost limits
- Fallback policies
- Rate-limit handling
- Provider failures
- Load balancing
- Logging
- Analytics

This separation improves maintainability. If a provider changes its API, only the gateway may need updating rather than every application.

## 11.5 Stage 4: Add caching

Caching becomes more valuable as usage grows.

### Inference caching

Includes mechanisms such as:

- Key-value caching for Transformer attention
- Prompt caching for repeated prompt segments
- Caching results of retrieval, search, or other expensive steps

Caching is especially useful for:

- Long conversations
- Repeated questions about the same source
- Multi-step reasoning flows
- Expensive web or database calls

Storage options include:

- In-memory caches
- Relational databases
- Redis

A cache also needs an eviction policy, such as:

- Least recently used
- Least frequently used

## 11.6 Stage 5: Add complex logic and write actions

Advanced applications may include:

- Multi-step reasoning
- Conditional branches
- Agent loops
- Tool selection
- Write actions

Write actions can send emails, place orders, update records, or initiate transfers. They greatly increase application value but also increase risk.

They should use:

- Authorization
- Parameter validation
- Human approval when appropriate
- Idempotency
- Audit logging
- Rollback or recovery strategies where possible

The source emphasizes caution and safeguards because a model error can now change the environment.

## 11.7 Monitoring and observability

These concepts are related but distinct.

### Monitoring

Tracks external behavior and detects that something went wrong.

It may reveal:

- Increased error rate
- Higher latency
- Lower quality score
- More user complaints

Monitoring tells the team that the “car broke down,” but not necessarily why.

### Observability

Collects enough internal-state information to diagnose the cause without deploying new diagnostic code.

It should expose what happened across:

- Prompts
- Retrieval
- Routing
- Tool calls
- Model responses
- Guardrails
- Caches
- External services

The course compares this to sensors throughout a car that identify the exact failure.

## 11.8 Operational metrics

Three metrics mentioned are:

- **Mean time to detection (MTTD):** How long it takes to notice an issue
- **Mean time to response or recovery (MTTR):** How long it takes to respond to or resolve it
- **Change failure rate (CFR):** Percentage of deployments that cause failures

Each pipeline component should have its own metrics. Teams should understand how component-level metrics relate to the business’s main outcome or North Star metric.

The course’s practical rule is to log extensively. Metrics reveal that a problem exists; detailed logs help determine what happened.

## 11.9 Orchestration

As the application adds models, tools, data sources, and branching logic, an orchestrator can help define how they interact.

The course mentions tools such as:

- LangChain
- LlamaIndex
- Flowise
- Langflow
- Haystack

However, it recommends beginning without an orchestrator when possible. Building the initial mechanics directly helps the team understand the system before adding another abstraction layer.

An orchestrator should reduce real complexity, not hide an architecture the team does not understand.

## 11.10 User feedback as a competitive asset

Many organizations can access the same foundation models. They do not have access to the same user interactions.

Feedback creates proprietary data that can improve:

- Prompts
- Evaluation datasets
- Retrieval
- Fine-tuning data
- Product design
- Routing
- Guardrails

## 11.11 Explicit feedback

Users provide it directly through:

- Thumbs up or down
- Star ratings
- Written comments
- Preference between two responses

Explicit feedback is clear but creates friction and may be sparse.

## 11.12 Implicit feedback

Inferred from behavior, including:

- Ending a session early
- Correcting an answer
- Asking the same question again
- Clarifying the request
- Sending a complaint
- Regenerating a response
- Conversation length
- Sentiment

Implicit feedback is more abundant but must be interpreted carefully. A long conversation might indicate engagement or confusion.

## 11.13 When to request feedback

Feedback can be requested:

- At the beginning, such as asking a user’s skill level
- After an unexpected event, such as an unusually slow response
- At a natural decision point, such as choosing between two alternatives

Every feedback request creates friction. The product should collect enough information to improve without repeatedly interrupting the user.

## 11.14 Keep architecture proportional to the problem

A mature system can include every component in this guide, but adding everything at once is not a sign of quality.

A simpler system may be:

- More reliable
- Easier to understand
- Cheaper
- Faster
- Easier to maintain

Architecture should evolve in response to measured needs.

The field changes quickly, so flexibility matters. Interfaces, gateways, evaluation pipelines, and modular components help teams incorporate new models and techniques without destabilizing the user experience.

## 11.15 Run-level and system-level visibility

Production agent systems require two complementary views.

### Run-level observability

A complete causal trace for one request should record:

- source and correlation identifiers;
- prompt, model, schema, tool, and rule versions;
- structured intermediate outputs;
- retrieval results and provenance;
- tool requests, validated arguments, responses, and errors;
- state transitions and approval decisions;
- retries, latency, token usage, and cost;
- human corrections and final outcome.

This “zoomed-in” view supports debugging and explains where one run failed.

### System-level monitoring

A “zoomed-out” view aggregates many runs. Useful metrics include:

- task-completion and failure rates;
- failure categories by component and slice;
- human-correction and escalation rates;
- latency and cost percentiles;
- retry and duplicate-prevention events;
- age of pending workflow states;
- security violations and false refusals;
- user behavior and business outcomes.

At scale, every trace cannot receive manual review. Use automated checks and risk-based quality sampling, while always retaining enough structured evidence to investigate selected runs.

## 11.16 Production safeguards for write actions

Write actions need stronger controls than reads. Use:

- least-privilege service identities;
- explicit authorization checks;
- typed parameter validation;
- idempotency keys and duplicate detection;
- audit logging;
- human approval for material or ambiguous actions;
- bounded retries and circuit breakers;
- timeout, compensation, rollback, or recovery strategies where possible.

Separate the model’s request from execution. The model can propose a tool call, but trusted application code decides whether it is permitted and safe to run.

For the Example Agent, the offline intake slice has no external side effects. Later stages should add one controlled capability at a time and require promotion evidence before expanding autonomy.

## 11.17 Security for agent systems

Agent security must defend against external attackers, untrusted source content, and unsafe decisions by the system itself.

Important threats include:

- prompt injection in user input, retrieved documents, emails, or attachments;
- leakage of personal, confidential, or proprietary data;
- unsafe code generation or execution;
- unauthorized tool calls;
- resource exhaustion, excessive loops, or unexpected spending;
- cross-user or cross-tenant memory contamination.

Treat external content as data, not instructions. A source document may provide values to extract, but it cannot redefine system rules, tools, or permissions.

When code execution is truly necessary, isolate it in a sandbox with time, memory, CPU, filesystem, network, and library restrictions. Validate inputs and structured outputs, scan for sensitive data, limit repair attempts, and place a circuit breaker around the loop. Prefer well-defined custom tools over unrestricted code execution whenever possible.

## 11.18 Durable orchestration and staged delivery

An agent graph and a durable business workflow are related but not identical. Model decisions may last seconds, while approvals and external prerequisites may take hours or days.

Persist workflow state and correlation data outside the model context. Resume from events or controlled polls after restarts. Define terminal, waiting, retryable, review, and failure states explicitly.

A safe rollout path is:

1. offline fixtures with no external calls;
2. authorized read-only shadow operation;
3. controlled writes in a test environment with approval;
4. durable waits and recovery tests;
5. high-impact submissions behind human release;
6. a limited production cohort with monitoring and an incident plan.

Add evaluation cases before adding each capability.

## 11.19 Feedback should improve evaluation before memory

Human edits, approvals, rejections, and corrections are valuable, but they should not automatically become persistent agent memory.

First store them as reviewed evaluation evidence with provenance and a reason. Only promote a lesson into reusable memory after confirming that it is current, authorized, broadly applicable, tenant-safe, and compatible with the active schema and policy.

This prevents one-off corrections or outdated behavior from silently changing future runs.

## Key takeaway

A production AI application is a continuously improving system, not a single model call. Its architecture should combine only the context, controls, tools, durable state, observability, security, and feedback mechanisms required by the actual use case—and add autonomy only when evaluation evidence supports it.