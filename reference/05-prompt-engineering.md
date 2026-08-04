# 5. Prompt Engineering

Prompt engineering is the process of crafting instructions that guide a foundation model toward a desired result. It is usually the easiest and most common adaptation technique because it changes the input to the model rather than changing the model’s weights.

Prompting should generally be explored before fine-tuning because it is faster, cheaper, and easier to iterate. However, production-quality prompt engineering still requires disciplined experimentation, evaluation, versioning, and data management.

## 5.1 What a prompt contains

A prompt may include several components.

### Task description

The task description explains what the model should do, what role it should play, what constraints apply, and how the answer should be formatted.

For example, a prompt might instruct the model to act as a medical assistant, analyze symptoms, and list possible conditions in order of likelihood. The task description establishes the expected behavior before the model sees the specific input.

### Examples

Examples demonstrate the behavior instead of only describing it. For a toxicity classifier, the prompt may contain several inputs labeled “toxic” and “non-toxic.”

Examples are especially useful for style, tone, format, and edge cases that are difficult to define only with rules.

### Concrete task

The concrete task is the actual input to process: a question, document, coding request, classification example, or user message.

## 5.2 Prompt robustness

A robust model should not change its answer dramatically because of a minor prompt variation, such as writing a number as a digit instead of spelling it out.

Prompt sensitivity is related to overall model capability. Stronger models are often more tolerant of wording changes, while weaker models may require more precise prompt construction.

Different model families can also prefer different prompt structures. The course gives the example that one model may perform better when the instruction appears at the beginning, while another may benefit from placing the task later. Therefore, prompt design must be tested for the actual model being used.

## 5.3 In-context learning and shots

Teaching the model through examples inside the prompt is called **in-context learning**.

- **Zero-shot:** No example is provided.
- **One-shot:** One example is provided.
- **Few-shot:** Several examples are provided.

The useful number of examples depends on the model and task. More examples may improve performance, but they also consume context-window space and increase API cost.

## 5.4 System prompts, user prompts, and chat templates

Many chat models distinguish between:

- **System prompt:** Defines the model’s role, goals, rules, and broad behavior.
- **User prompt:** Contains the user’s specific request.

The application combines these messages through a model-specific chat template. Using the wrong template can silently reduce performance. Even small formatting differences, such as an extra newline or incorrect special token, can affect results.

This matters especially when third-party libraries assemble prompts automatically. The generated prompt must follow the exact template expected by the model and version.

Instructions are often followed more reliably when placed near the beginning or end of the prompt rather than buried in the middle.

## 5.5 Practical prompting strategies

### Write clear and explicit instructions

Do not assume the model understands an unstated scoring system, exception rule, or formatting requirement.

For an essay scorer, specify:

- The scoring dimensions
- Whether fractional scores are allowed
- What each score means
- What to do when the answer cannot be determined

Clarity reduces ambiguity and makes evaluation easier.

### Ask the model to adopt a role or persona

A role can influence style, vocabulary, focus, and depth.

Examples include:

- Respond as an experienced pediatrician.
- Explain the concept to a ten-year-old.
- Review the code as a senior security engineer.

The persona is not a substitute for real expertise or grounding, but it can help shape the response.

### Provide examples

Examples often influence output more strongly than abstract instructions. They show the model what type of answer, tone, or structure is expected.

The course illustrates this with a whimsical-response example: a model may answer a fictional question literally unless the prompt demonstrates that playful responses are preferred.

### Specify the output format

Tell the model exactly how to structure its answer.

Possible requirements include:

- JSON
- Markdown
- A specific set of headings
- A fixed schema
- No preamble
- A list with a defined number of entries

Explicit formatting is particularly important when another software component will parse the output.

### Break complex tasks into subtasks

A large task can be decomposed into smaller steps. This can improve accuracy and make the pipeline easier to monitor, debug, and parallelize.

It also allows simpler steps to use smaller, cheaper models. The trade-off is additional orchestration and potentially higher perceived latency if the user cannot see intermediate progress.

### Give the model time to reason

The course mentions several ways to encourage better reasoning:

- Ask for step-by-step thinking.
- Provide a sequence of process instructions.
- Ask the model to critique or check its own work.

These methods may improve quality but increase token usage and latency.

### Iterate systematically

Prompt changes should be treated like experiments.

- Version prompts.
- Use a fixed evaluation dataset.
- Track metrics.
- Compare changes against a baseline.
- Store prompts outside application code when possible.

Keeping prompts in configuration files makes them easier to update and test without changing core code.

## 5.6 Automated prompt optimization

Tools such as OpenPrompt and DSPy aim to automate parts of prompt optimization. A user can define input and output formats, evaluation metrics, and evaluation data, and the tool searches for effective prompts.

These tools can be useful, but the course notes several drawbacks:

- They may generate many API calls and become expensive.
- Automatically produced prompts can contain awkward wording or errors.
- The tools may lag behind changes in model behavior or model-specific prompting requirements.

A practical recommendation is to begin with manual prompt engineering so the team understands the task before adding automated optimization.

Models can also help write or refine prompts, but generated prompts should still be evaluated rather than accepted automatically.

## 5.7 Prompt security

Once an application is exposed to users, attackers may try to manipulate it.

### Prompt extraction

An attacker tries to reveal the hidden system prompt. This can help them imitate the application or discover instructions that can be exploited.

### Jailbreaking and prompt injection

These attacks try to override safety rules or cause unauthorized behavior. In an agentic system, an injected instruction could attempt to trigger unsafe code execution, data access, or external actions.

### Information extraction

An attacker tries to make the model reveal private data from its training data, retrieved context, system prompt, or connected tools.

## 5.8 Defensive measures

The course recommends a layered approach:

- Evaluate against adversarial benchmarks.
- Conduct security red-team exercises.
- State clearly what information the model must not return.
- Reinforce critical system instructions around user-supplied content.
- Run generated code only in isolated environments.
- Require human approval for high-impact actions.
- Define out-of-scope topics and actions.
- Detect unusual input patterns.
- Apply guardrails to both inputs and outputs.

Security evaluation should track both:

- **Violation rate:** How often attacks succeed
- **False-refusal rate:** How often legitimate requests are incorrectly blocked

An application that blocks everything may be safe but unusable. The design goal is to reduce successful attacks without creating excessive friction for valid users.

## 5.9 Prompts as versioned component contracts

An agent prompt should define one bounded responsibility rather than describe an entire business workflow to one model. Each LLM component should have:

- a clear task and stopping condition;
- authoritative and non-authoritative inputs;
- the tools or evidence it may use;
- an explicit typed output schema;
- rules for missing, conflicting, and ambiguous values;
- examples covering normal and edge cases;
- prohibited inferences and actions;
- prompt, model, and schema versions.

For the Example Agent, an extraction component should return a typed request object with source provenance. It should mark a field as missing or ambiguous instead of selecting a plausible value. Deterministic code—not prompt wording—should normalize identifiers, enforce conditional requirements, validate transitions, and decide whether the workflow may advance.

Tool instructions should describe the tool name, when it is appropriate, the typed input fields, expected output, and important constraints. The model requests a tool call; application code validates permissions and arguments before executing it.

## 5.10 Reflection as an evaluated second pass

Reflection means that a model creates an output, critiques it, and revises it when necessary. It is especially useful when external feedback is available, such as:

- a JSON-schema validation error;
- a failed code test;
- a missing citation check;
- evidence that a required field lacks provenance.

Reflection adds another model call and therefore more latency and cost. Test the component with and without reflection. Keep it only when the evaluation set demonstrates a meaningful improvement.

A reflection step must not invent missing authoritative information. For the Example Agent, it may identify conflicts between an email and attachment or flag values without evidence, but it may not “repair” an unknown customer identifier or proposal choice by guessing.

## Key takeaway

Prompt engineering is accessible, but it is not casual trial and error. Effective prompting combines clear instructions, examples, typed component contracts, decomposition, model-specific formatting, evaluation, version control, and security testing.