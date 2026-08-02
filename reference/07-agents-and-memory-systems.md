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

## Key takeaway

An agent is not simply a chatbot with more prompts. It is a system that combines planning, tools, memory, validation, and repeated interaction with an environment. The more power it receives, the more important evaluation, authorization, safety boundaries, and human oversight become.