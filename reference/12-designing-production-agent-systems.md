# 12. Designing Production Agent Systems

This chapter connects the broader AI-engineering lifecycle to the practical design of tool-using agent systems. It focuses on deciding when agency is justified, controlling autonomy, decomposing work, defining tools and state, evaluating traces, and adding production safeguards.

The central principle is simple:

> Use the least autonomy and architectural complexity required to complete the business goal reliably.

## 12.1 When should an application become an agent?

A one-shot model produces an answer from a single call. An agent is useful when completing a goal requires a sequence of decisions and interactions with an environment, such as:

- retrieving information;
- selecting and calling tools;
- inspecting results;
- correcting recoverable errors;
- requesting clarification;
- waiting for an external event;
- resuming a long-running workflow.

The basic **ReAct** loop is:

1. **Reason:** decide what should happen next.
2. **Act:** call a permitted tool or produce an intermediate result.
3. **Observe:** inspect the tool result or environment state.
4. **Continue or stop:** take another controlled step or return the final result.

Agency creates additional cost, latency, uncertainty, security exposure, and operational work. The decision is therefore not only, “Can an LLM do this?” It is, “Does controlled iteration and tool use create enough value to justify a more complex system?”

A useful early screen compares:

- task complexity;
- required precision;
- business impact;
- reversibility;
- availability of human review.

High-complexity, high-precision, high-impact actions should use narrower autonomy, deterministic validation, and explicit approval.

## 12.2 The autonomy spectrum

Agency exists on a spectrum.

### Scripted

Application code selects every step. The model performs one bounded language task, such as classification or extraction.

### Semi-autonomous

The model selects from a restricted toolset inside enforced state, permission, and validation boundaries.

### Highly autonomous

The model creates plans, selects tools, and adapts many steps dynamically.

Most production workflows should begin scripted or narrowly semi-autonomous. Autonomy should be earned through evaluation evidence rather than added because an agent framework makes it easy.

## 12.3 Decompose until every component is testable

A useful decomposition rule is:

> Continue splitting the workflow until every LLM task is narrow and evaluable, and every external action has an explicit tool contract.

Four decomposition patterns are especially useful.

### Functional decomposition

Split by responsibility or expertise.

Examples:

- request classification;
- field extraction;
- deterministic validation;
- clarification drafting;
- business-system updates.

### Spatial decomposition

Split by market, region, file, service, repository, or module.

### Sequential or temporal decomposition

Split by dependency and business state. A later step cannot begin until the earlier prerequisite is complete.

### Data-driven decomposition

Split independent records or partitions so they can be processed in parallel.

A multi-agent architecture is not a maturity requirement. A sequential pipeline of small components is usually the clearest first implementation.

## 12.4 Model Tasks, Tools, Knowledge, Memory, and Guardrails

A practical design model contains five elements.

### Tasks

Tasks are narrow units of work with explicit inputs, outputs, and success criteria.

### Tools

Tools provide information or change the environment. A production tool contract should define:

- purpose;
- typed input and output;
- side effects;
- authentication and authorization scope;
- timeout and retry policy;
- idempotency behavior;
- error taxonomy;
- owner and version.

The model proposes a tool name and typed arguments. Application code validates authorization and parameters, executes the call, records the result, and returns only the necessary observation.

### Knowledge

Knowledge is versioned reference information shared across runs, such as schemas, policies, terminology, and approval rules.

### Memory and run state

These concepts should remain distinct.

| Information type | Meaning |
|---|---|
| Knowledge | Versioned information that applies to many runs |
| Run state | Current facts and progress for one workflow |
| Long-term memory | Governed lessons retained from earlier runs |
| Live tool result | Current authoritative information from an external system |

Structured schemas and current business facts should not be treated as ordinary semantic memory. Retrieve schemas by exact key and version. Obtain current records through authorized services.

### Guardrails

Guardrails should be layered:

1. deterministic validation for formats, permissions, business rules, and state transitions;
2. model-based checking for nuanced language or evidence consistency;
3. human approval for ambiguity and material actions.

Prompt injection must be treated as untrusted data attempting to cross a control boundary. User documents may provide business data, but they may not redefine tools, rules, or permissions.

## 12.5 Plan separately from execution

For complex or high-impact work, separate planning from execution:

1. generate a plan;
2. validate it;
3. execute only after it passes validation.

Plan validation can reject:

- nonexistent tools;
- invalid parameters;
- prohibited transitions;
- unnecessary or excessive steps;
- actions outside the user or service identity's permission scope.

Human review should be inserted before sensitive or irreversible actions.

## 12.6 Design state and failure behavior explicitly

A production agent needs more than a happy path. Define states for:

- success;
- waiting for an external event;
- retryable failure;
- clarification required;
- human review;
- escalation;
- terminal failure.

State transitions should be ordinary, inspectable code whenever deterministic rules exist. Long-running business waits should suspend a durable workflow and resume on an event or controlled poll. They should not keep an LLM loop active.

## 12.7 Evaluate the system and its trace

An agent cannot be evaluated only by grading its final prose.

### Component-level evaluation

Ask:

- Was the request routed correctly?
- Were required fields extracted accurately?
- Was every material value supported by evidence?
- Were missing and ambiguous fields detected?
- Was the correct schema selected?
- Was the correct tool selected with valid parameters?
- Were retries safe and justified?

### End-to-end evaluation

Ask:

- Did the workflow reach the correct state?
- Did it complete the intended goal?
- Did it avoid unauthorized or duplicate actions?
- How many steps, tool calls, tokens, seconds, and dollars were required?

Prefer deterministic correctness checks whenever an exact answer exists. Use an LLM judge for softer criteria, such as whether a clarification message is understandable, not for exact identifiers that can be compared directly.

A useful trace stores:

- input and artifact identifiers;
- prompt, model, and schema versions;
- structured output;
- field provenance;
- validation results;
- tool names and parameters;
- tool responses;
- state transitions;
- latency, cost, and retries;
- human corrections.

Evaluation should be reported by meaningful slices rather than only as one average.

## 12.8 Select models per component

A small, fast model may be enough for classification, schema-constrained extraction, or clarification drafting. A stronger model should be reserved for components where evaluation demonstrates a meaningful quality improvement.

Compare candidates on the application evaluation set and track:

- required-field accuracy;
- no-invention rate;
- schema validity;
- latency;
- token usage;
- cost;
- stability across repeated runs.

## 12.9 Optimize the workflow, not only model inference

Agent latency and cost are sums across components. Establish a baseline for every model call, parser, retrieval, tool call, retry, wait, and human checkpoint.

Then optimize in this order:

1. remove unnecessary calls and context;
2. parallelize genuinely independent work;
3. use smaller models when evaluation permits;
4. cache versioned schemas and deterministic lookups;
5. batch offline evaluation and document processing;
6. address the largest measured bottleneck first.

## 12.10 Production observability and feedback

A production agent requires two levels of visibility.

### Run-level observability

The full causal trace of one request.

### System-level monitoring

Aggregate measures such as:

- success rate;
- failure categories;
- human-correction rate;
- latency percentiles;
- cost;
- duplicate-prevention events;
- pending-state age;
- security violations;
- business outcomes.

Human feedback should enter the evaluation dataset before it becomes long-term memory. A correction should become reusable only after review, provenance capture, access-control checks, and confirmation that it does not conflict with current rules.

## 12.11 Worked example: Partner Service Request Intake Agent

The public case study in this repository uses a fictional **Partner Service Request Intake Agent**. It is inspired by a common enterprise workflow but does not represent a real company, customer process, internal system, or production interface.

The Example Agent receives service requests from authorized partners and converts unstructured messages and attachments into a validated, auditable request package.

The workflow may include:

1. preserve the incoming message and attachments;
2. classify the request as supported or out of scope;
3. extract a typed `PartnerServiceRequest` with source provenance;
4. select a versioned regional/provider schema;
5. normalize and validate required information;
6. ask targeted clarification questions when blocked;
7. query or create business records only through confirmed services;
8. wait durably for prerequisites or approvals;
9. submit a service-proposal request behind explicit release controls;
10. retrieve the result and draft a partner response.

The first implementation slice remains read-only. It tests the riskiest language-model behavior without risking production data or side effects.

See [Example Agent case study](../case-studies/example-agent/README.md).

## Key takeaway

A production agent is not a chatbot with more prompts. It is a controlled software system combining narrow model tasks, explicit tools, deterministic state, evaluation, authorization, observability, and human oversight. Build the smallest testable slice first, and add side effects only when evidence supports the next increase in capability.