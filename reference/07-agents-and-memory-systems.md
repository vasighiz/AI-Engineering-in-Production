# 7. Agents and Memory Systems

An agent is broadly defined as a system that can perceive an environment and act on it.

For a foundation-model agent, this means the model can:

1. Observe the current state
2. Decide what to do
3. Use tools
4. Examine the result
5. Continue or stop

The environment depends on the task. For a game-playing agent, the environment is the game. For a web-research agent, it is the internet and browser. For an enterprise workflow agent, it may include databases, email, APIs, and internal applications.

## 7.1 Tools make agents powerful

A model alone generates text. Tools allow it to access information and perform capabilities outside the model.

The course describes several tool categories.

### Knowledge-augmentation tools

These help the agent obtain information:

- Text or image retrievers
- SQL executors
- Web search
- APIs
- Inventory systems
- Email readers
- Web browsers

### Capability-extension tools

These perform operations that language models may handle poorly or inefficiently:

- Calculators
- Time-zone converters
- Unit converters
- Translation services
- Code interpreters

### Write or action tools

These change the external environment:

- Sending emails
- Updating records
- Placing orders
- Triggering workflows
- Executing transactions

Write tools create much higher risk than read-only tools and therefore require stronger authorization, validation, and oversight.

## 7.2 Example of an agent workflow

Suppose a user asks, “Project sales revenue over the next three months.”

An agent may:

1. Decide what historical information is needed.
2. Generate a SQL query for sales data.
3. Execute the query.
4. Inspect whether the returned data is sufficient.
5. Run additional queries if required.
6. Calculate a projection.
7. Produce the final explanation.
8. Decide that the task is complete.

This is more than a single model response. It is a sequence of reasoning, tool use, observation, and adaptation.

## 7.3 Why agents are difficult

Agents often require stronger models because they must make multiple dependent decisions.

Errors compound across steps. If each step has a success probability below 100%, the total success rate falls as the number of steps increases.

The stakes can also be higher because an agent may have access to powerful tools or sensitive data. A wrong answer in a chat is different from a wrong transfer, deletion, or email.

## 7.4 Separate planning from execution

Complex tasks can be decomposed in many ways. Some plans are invalid, inefficient, or unsafe.

The course recommends decoupling planning from execution:

1. Generate a plan.
2. Validate it.
3. Execute only after it passes validation.

Validation can use:

- Rules that reject nonexistent tools
- Limits on the number of steps
- Parameter checks
- Another model as a judge
- Human review for sensitive tasks

Several candidate plans can be generated in parallel, then an evaluator can select the most promising one.

## 7.5 Foundation-model agents and reinforcement-learning agents

Foundation-model agents commonly use the language model itself as the planner.

Reinforcement-learning agents are trained using rewards from interaction with an environment. This approach can require more resources but may improve decision-making for some tasks.

The course presents this as an evolving area rather than a settled production standard.

## 7.6 Creating a plan generator

The simplest method is prompt engineering.

The system prompt should explain:

- Available tools
- What each tool does
- Required parameters
- Expected input and output formats
- Constraints
- Examples of valid use

Tool definitions should be clear and as simple as possible. Better tool descriptions reduce planning and parameter errors.

The course recommends asking the system to report the parameter values used for each function call. This provides a sanity check before execution.

Another approach is to:

1. Generate a natural-language plan.
2. Translate that plan into exact function calls in a separate step.

This separates high-level reasoning from tool syntax. If function names change, the natural-language planner may remain stable, and a smaller model can handle the translation.

## 7.7 Agent failure modes

### Planning failures

An agent may:

- Select a nonexistent tool
- Select a valid tool with invalid parameters
- Use incorrect parameter values
- Ignore constraints
- Create an inefficient plan
- Fail to achieve the user’s goal

### Tool failures

Problems can also occur after planning:

- The natural-language plan is translated to the wrong function.
- The required tool is unavailable or unauthorized.
- The tool returns incorrect or incomplete output.
- Generated SQL or code is invalid.
- An external API fails.

## 7.8 Evaluating agent plans

A planning evaluation dataset can contain tuples of:

- Task
- Available tools
- Constraints
- Expected successful behavior

For each task, generate several plans and measure:

- Percentage of valid plans
- Number of attempts needed to obtain a valid plan
- Percentage of tool calls that use valid tools
- Frequency of invalid-tool calls
- Correctness of parameters
- Goal completion

## 7.9 Evaluating efficiency

Agent quality is not only success or failure.

Measure:

- Average number of steps
- Cost per completed task
- Time per action
- Total completion latency
- Slow or expensive tools
- Performance relative to another agent or a human baseline

A plan that succeeds in twenty calls may be worse than one that succeeds in three.

## 7.10 Memory mechanisms

Agents need to retain information across steps and interactions.

The course describes three broad forms of memory.

### Internal knowledge

Knowledge embedded in the model weights through training. It is available without retrieval but is difficult and expensive to update.

### Context window

Short-term memory for the current interaction. It contains instructions, conversation history, tool results, and retrieved content, but it has a size limit.

### External memory

Persistent data outside the model, often accessed through RAG. It can store information across sessions and be updated independently of the model.

A useful allocation principle is:

- Information essential to nearly every task may belong in training or fixed instructions.
- Information needed only occasionally belongs in external long-term memory.
- Immediate, session-specific information belongs in the context window.

## 7.11 Benefits of memory management

A well-designed memory system can:

- Preserve information beyond the context-window limit
- Maintain continuity across sessions
- Make responses and actions more consistent
- Avoid repeatedly asking the user for the same information
- Support long-running tasks

Memory must still be governed carefully. Storing too much irrelevant, outdated, or sensitive information can reduce quality and create privacy risk.

## 7.12 The autonomy spectrum

Agency is not binary. A system can be:

- **Scripted:** application code selects every step and the model performs bounded language tasks.
- **Semi-autonomous:** the model chooses from a restricted set of tools within enforced state, permission, and transition boundaries.
- **Highly autonomous:** the model creates plans, chooses tools, adapts many steps, and may generate new code dynamically.

Most production workflows should begin scripted or narrowly semi-autonomous. Autonomy should be increased only when evaluation shows that the added flexibility improves outcomes enough to justify greater unpredictability and risk.

For the Example Agent, typed extraction can use an LLM, while schema selection, validation, state transitions, write authorization, and duplicate prevention should begin as deterministic application logic.

## 7.13 Task decomposition

Start by describing how a competent human completes the task. For every step, ask whether an LLM can perform it reliably and whether its output is independently testable. Split the work further until every model task is narrow and every external action has a defined tool contract.

Four decomposition patterns are useful:

1. **Functional:** split by responsibility or expertise, such as parsing, extraction, validation, and communication.
2. **Spatial:** split by file, service, region, market, directory, or another independent boundary.
3. **Sequential or temporal:** split by dependency and business state; later stages begin only when earlier prerequisites are satisfied.
4. **Data-driven:** partition independent records or documents for parallel processing, then aggregate results.

Patterns can be combined. The Example Agent is primarily sequential, with functional components and possible parallel parsing of independent attachments.

## 7.14 Tool contracts

The model does not directly execute a tool. It produces a structured request, application code validates it, the implementation performs the operation, and the result returns as new context.

A production tool contract should define:

- a stable name and plain-language purpose;
- typed inputs and outputs;
- side effects;
- authentication and authorization scope;
- timeout, retry, throttling, and rate-limit behavior;
- idempotency and duplicate handling;
- error categories;
- caching policy where safe;
- asynchronous behavior;
- owner, version, tests, and documentation.

Give each component only the tools it needs. Least-privilege tool scoping improves security, auditability, and debugging.

## 7.15 Layered guardrails

Guardrails form a quality and safety gate between an agent claiming completion and the system accepting the result.

1. **Deterministic checks** should handle schemas, formats, permissions, limits, business rules, and state transitions.
2. **Model-based checks** may assess nuanced criteria such as evidence consistency, tone, or completeness.
3. **Human approval** should remain for ambiguity and material business actions.

The cheapest and most reliable check should run first. A model judge should not replace code when an exact rule exists.

## 7.16 Reflection

Reflection adds a second pass in which the model critiques an output and revises it. It can be valuable for structured JSON, procedural instructions, code, research, and long-form writing—especially when the critique includes external evidence such as schema errors or test failures.

Reflection increases cost and latency, so compare it with a single-pass baseline. Limit retries and use a circuit breaker. A reflection loop may fix formatting or identify unsupported claims; it must not invent missing authoritative data.

## 7.17 Planning and execution control

Planning lets a model decide which tools are needed and in what order. It is valuable when valid paths vary by request, but it increases unpredictability.

Safer planning uses:

- structured plans rather than free-form prose where possible;
- allowed-tool and parameter validation;
- explicit step and cost limits;
- separation between read and write tools;
- approval before sensitive actions;
- durable state so work can resume safely;
- trace logging for every decision and result.

Do not use dynamic planning when a known deterministic workflow is sufficient.

## 7.18 Multi-agent collaboration

Multiple agents can provide specialization, context isolation, parallel work, or different permission sets. They also create communication overhead, resource conflicts, failure propagation, rate-limit pressure, and difficult debugging.

Common coordination patterns are:

- **Sequential:** one specialist hands structured output to the next; simplest and most predictable.
- **Parallel:** independent work runs concurrently and is later combined.
- **Manager–specialist:** a coordinator assigns and reviews specialist work.
- **Hierarchical:** managers coordinate sub-agents for very complex systems.
- **All-to-all:** any agent can communicate with any other; flexible but difficult to control and uncommon for high-stakes production workflows.

Define interfaces, not vague roles. Every handoff needs a typed schema, identifiers, and references. Start with a simple pipeline and introduce additional agents only when the benefit is measurable.

## Key takeaway

An agent is not simply a chatbot with more prompts. It is a controlled system that combines decomposition, tools, planning, memory, validation, state, and repeated interaction with an environment. The more power it receives, the more important evaluation, least privilege, traceability, and human oversight become.