# 4. Model Selection

The growing number of foundation models changes the central question from “Can we build a model?” to “Which model should we use for this application?”

Model selection is not a one-time decision. Teams revisit it throughout development:

- Start with a strong model to test whether the task is feasible.
- Try smaller or cheaper models after the desired behavior is understood.
- Use a small model to test fine-tuning code.
- Move to larger candidates when the pipeline is working.
- Reevaluate models as providers, prices, policies, and capabilities change.

## 4.1 The two-stage selection problem

A practical selection process has two goals:

1. **Find the best achievable task performance.**
2. **Map candidates along the cost–performance frontier and choose the best option for the available budget and constraints.**

The strongest model is not automatically the correct production model. A slightly weaker model may be preferred if it is much cheaper, faster, easier to host, or more compatible with privacy requirements.

## 4.2 Four evaluation buckets

Model-selection criteria can be grouped into four areas.

### Domain-specific capability

How well does the model understand the target field? A legal-document summarizer must understand legal terminology, while a coding assistant must reason about programming languages and software behavior.

### General capability

How coherent, faithful, factually consistent, and generally useful are its outputs?

### Instruction following

Does the model follow requested formats, constraints, roles, and output structures?

### Cost and latency

How expensive is each call, and how quickly does the model respond under realistic load?

## 4.3 Pointwise and comparative evaluation

Two common approaches are:

- **Pointwise evaluation:** Score each model independently against a rubric.
- **Comparative evaluation:** Present outputs from two models and decide which is better.

Comparative evaluation can be easier when absolute scoring is difficult. In some applications, the team only needs to know which candidate performs better, not whether either deserves a precise score of 7.8 or 8.1.

## 4.4 Hard and soft attributes

A useful distinction is between attributes that can be changed through adaptation and those that usually cannot.

### Hard attributes

Hard attributes are fixed or impractical to change:

- License restrictions
- Training-data composition
- Model size
- Privacy requirements
- Deployment location
- Level of control
- Availability of model weights
- Provider policies

These constraints should be applied early because they can eliminate a model regardless of its benchmark performance.

### Soft attributes

Soft attributes can often be improved:

- Accuracy
- Toxicity
- Factual consistency
- Output formatting
- Instruction following
- Task-specific behavior

Prompt engineering, RAG, fine-tuning, and guardrails can improve these qualities.

## 4.5 High-level model-selection workflow

1. **Filter by hard constraints.** Remove models that violate licensing, privacy, deployment, or control requirements.
2. **Use public information to narrow the list.** Benchmarks and model documentation can identify promising candidates.
3. **Run application-specific experiments.** Evaluate the remaining models on your own data, tasks, and business metrics.
4. **Monitor continuously in production.** Track failures and feedback because real usage can reveal problems that offline benchmarks miss.

## 4.6 Open, open-weight, and commercial models

The term “open source” is used inconsistently.

- A model with downloadable weights but private training data may be more accurately described as **open-weight**.
- A fully open model would make both weights and training data available.
- Licenses may still restrict commercial use or limit whether outputs can be used to train other models.

A model becomes accessible to applications through an **inference service**, which hosts the model and processes requests. The interface exposed to users or applications is the **model API**.

A provider may release weaker models publicly while keeping its strongest models behind a paid API.

## 4.7 Model API or self-hosting?

The decision depends on several factors.

### Data privacy

If organizational policy prohibits sending data to an external provider, a third-party API may not be acceptable. Teams must also consider whether the provider can use submitted data for training or retention.

### Data lineage and copyright

Many models do not fully disclose their training data. Laws and policies around copyrighted training material are still evolving, so teams may need to assess legal and product risk.

### Performance and built-in capabilities

Commercial APIs often provide features such as:

- Scalability
- Function calling
- Structured outputs
- Guardrails
- Operational reliability

Implementing these capabilities internally can be difficult. However, APIs may limit access to internal model features, fine-tuning options, or token probabilities.

### Cost

Proprietary APIs are easy to start with and often easy to scale, but high usage can become expensive. Self-hosting introduces infrastructure and operational cost but may become attractive at sufficient scale.

### Control and dependency

An external provider can change terms, discontinue a model, experience an outage, or become unavailable in a region. On-device applications also cannot depend entirely on a remote API.

The course recommends designing a standard internal model interface so the application can switch between providers or self-hosted models with minimal code changes.

## 4.8 Benchmarks and evaluation harnesses

An **evaluation harness** runs models across multiple benchmarks. The course mentions OpenAI Evals as an example.

When using public leaderboards, decide:

- Which benchmarks are relevant?
- How should different benchmarks be weighted?
- How should metrics such as accuracy, F1, BLEU, or other scores be combined?

Public benchmarks are most useful for narrowing the candidate list. They rarely match the exact needs of a production application.

## 4.9 Benchmark contamination

A benchmark may be contaminated if the model was trained on the evaluation examples. This can create artificially high scores.

Possible detection heuristics include:

- N-gram overlap with known training data
- Unusually low perplexity on evaluation examples

Contamination is one reason that private, task-specific evaluation data is important.

## 4.10 Build a robust selection experiment

Once the candidate list is small, build a rigorous evaluation pipeline.

- Evaluate the complete output.
- Evaluate intermediate components.
- Use turn-based and task-based measurements.
- Define relevant quality attributes.
- Create test queries and generate multiple responses.
- Build an unambiguous rubric with examples.
- Compare performance with cost, latency, privacy, and control.

Tie the final decision to business outcomes and define a minimum usefulness threshold. A production model should not be selected only because it ranks first on a public leaderboard.

## 4.11 Combine automated and human evaluation

Automated metrics make large-scale testing practical, but human evaluation remains valuable.

A production process can:

- Run inexpensive automated checks on every example.
- Apply a stronger judge model to a smaller sample.
- Send a still smaller sample to human reviewers.

This balances scale, cost, and judgment quality.

## 4.12 Test reliability across slices and samples

Evaluate models across different user and data slices. Then test whether the results remain stable under bootstrap sampling.

A model should not be declared superior based on a small or unstable difference. The evaluation pipeline must be reliable enough that repeated experiments lead to similar conclusions.

## Key takeaway

Model selection is a multi-objective engineering decision. The best production choice is the model that satisfies hard constraints and offers the strongest business value across quality, cost, latency, privacy, and control—not necessarily the model with the highest general benchmark score.