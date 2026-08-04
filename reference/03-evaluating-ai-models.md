# 3. Evaluating AI Models

Evaluation is one of the most important and most underinvested parts of AI engineering. For some applications, designing and maintaining evaluation can consume most of the development effort.

Evaluation provides visibility into failures, helps manage risk, reveals improvement opportunities, and allows teams to compare system changes systematically.

## 3.1 Why evaluation is difficult

AI systems are harder to evaluate than many traditional machine-learning systems for several reasons.

### The tasks are complex

Judging a mathematical proof, legal answer, or book summary can require deep subject-matter expertise. In some cases, the evaluator must understand a large amount of source material before deciding whether the response is correct.

### Tasks are often open-ended

Many tasks have multiple acceptable answers. A classification problem may have one correct label, but a request to write a poem, summarize a document, or propose a strategy can have many valid outputs.

### Foundation models are black boxes

In practice, evaluators judge the observable outputs and actions of the system. They usually cannot inspect a simple internal rule that explains why the model produced a response.

### Public benchmarks become saturated

As models improve, they may reach very high scores on existing benchmarks. A benchmark that was challenging yesterday may stop distinguishing between strong models today.

### General-purpose models may have unknown capabilities

A broad model can perform tasks that were not anticipated when the benchmark was designed. Evaluation must therefore measure known capabilities while also helping discover new ones.

## 3.2 Cross-entropy, entropy, and perplexity

During training, autoregressive language models commonly use **cross-entropy** or the related measure **perplexity**.

- **Entropy** represents the average information or uncertainty in the data. If the next token is completely predictable, it carries little new information.
- **Cross-entropy** measures how well the model’s learned probability distribution matches the data distribution.
- **KL divergence** represents the difference between the two distributions. A perfectly learned distribution would have zero KL divergence.
- **Perplexity** is the exponential of cross-entropy and reflects how uncertain the model is about the next token.

A higher perplexity means the model is effectively considering more plausible next-token options. What counts as a “good” perplexity depends on the data:

- Structured and predictable data tends to have lower perplexity.
- Larger vocabularies tend to increase perplexity.
- Longer useful context can reduce uncertainty and therefore lower perplexity.

Perplexity is valuable during training and can serve as a rough proxy for general capability. However, it becomes less reliable after heavy post-training. A model can become better at following instructions while becoming less statistically optimized for raw next-token prediction.

The course also notes that unusually low perplexity can suggest that a text appeared in the model’s training data, while unusually high perplexity can help identify nonsensical text.

## 3.3 Functional correctness is the ultimate goal

For applications with a clear intended function, the strongest evaluation asks whether the system actually completed that function correctly.

Examples include:

- Did a reservation agent book the correct restaurant, date, and time?
- Did generated code execute and produce the expected result?
- Did a game-playing agent achieve a measurable win rate?
- Did a workflow agent complete the required action without violating constraints?

This is called **functional correctness**. It is often more meaningful than measuring whether the output merely looks similar to a reference answer.

## 3.4 Reference-based evaluation

When reference data is available, generated output can be compared with a known answer.

### Exact match

Exact match is a binary measure. It works for questions with one definitive response but is too strict for tasks where different phrasings can be equally correct.

### Lexical similarity

Lexical metrics compare the words or token sequences in the output and reference. Examples include:

- Edit distance
- N-gram overlap
- BLEU
- ROUGE

These metrics can be useful, but they have limitations:

- A comprehensive set of references may be difficult to create.
- Reference answers can themselves be wrong.
- Two responses can express the same meaning with different wording.
- High word overlap does not necessarily imply a better answer.

### Semantic similarity

Semantic evaluation compares meaning rather than exact wording. A common approach embeds both texts and measures a distance such as cosine similarity.

This approach is more flexible than lexical matching, but it depends on the quality of the embedding model and may still miss important differences in facts, reasoning, or safety.

## 3.5 Using an AI model as a judge

A common production method is to use another model as an evaluator.

An AI judge can:

- Score responses
- Compare two responses
- Check an output against a reference
- Evaluate correctness, toxicity, relevance, faithfulness, or hallucination
- Explain the reason for its judgment

AI judges are faster and cheaper than large-scale human evaluation and can be used even when no reference answer exists. Studies mentioned in the course suggest that AI judges can correlate strongly with human judgments and may sometimes show more agreement than different human evaluators show with one another.

However, AI judges are not automatically reliable.

### Prompt design matters

The judge prompt should contain:

- The evaluation task
- Clear criteria
- A scoring or classification system
- Examples when possible

Few-shot judge prompts often perform better than zero-shot prompts, although longer prompts increase cost.

Language models are generally more reliable at choosing categories than at assigning precise numerical scores. For that reason, classifications or pairwise comparisons may be easier to trust than fine-grained scores.

### A smaller judge may be enough

The strongest model is not always required. A smaller model specialized for the evaluation task may reduce cost and latency while still producing useful judgments.

### Judge limitations and biases

AI judges remain probabilistic. Running the same evaluation twice may produce different scores. Definitions of qualities such as “faithfulness” may also vary between evaluation systems.

Common biases include:

- **Self-bias:** A model may prefer outputs generated by the same model family.
- **Position bias:** A judge may prefer the first answer in a comparison.
- **Verbosity bias:** A judge may favor longer answers.

Randomizing response order can reduce position bias, but repeated judgments increase evaluation cost.

## 3.6 Building an evaluation pipeline

A good evaluation pipeline should assess both the complete application and its intermediate components.

For example, in a RAG application, evaluate:

- Retrieval quality
- Context construction
- Final answer quality
- Whether the answer is supported by the retrieved material

In an agent, evaluate:

- Plan validity
- Tool selection
- Tool parameters
- Action success
- Number of steps
- Final task completion

The course distinguishes:

- **Turn-based evaluation:** Judge the quality of each individual output or interaction.
- **Task-based evaluation:** Judge whether the overall task was completed and how many turns or actions were required.

## 3.7 Rubrics and test queries

Start by defining what a good response means for the application. Criteria may include:

- Relevance
- Factual consistency
- Safety
- Completeness
- Instruction following
- Correct format

Then:

1. Create representative test queries.
2. Generate multiple responses.
3. Build a detailed scoring rubric.
4. Include examples that clarify ambiguous score boundaries.
5. Choose binary, categorical, or continuous scoring based on the task.

The rubric should be clear enough that different human evaluators can apply it consistently.

## 3.8 Connect evaluation metrics to business outcomes

A technical score is useful only when its business meaning is understood.

For example, suppose a customer-support assistant reaches:

- 80% factual consistency, allowing 30% of requests to be automated
- 90% factual consistency, allowing 50% of requests to be automated

This connection turns an abstract model metric into a business decision. It also helps define a **usefulness threshold**, such as requiring at least 90% factual consistency before production deployment.

Different criteria may require different evaluation methods. A system might use:

- A toxicity classifier for safety
- Semantic similarity for relevance
- An AI judge for factual consistency
- Human review for a sampled subset

Methods can also be layered. A cheap classifier can run on all outputs, while an expensive judge or human evaluator examines only a small percentage.

## 3.9 Evaluate slices, not only aggregate scores

A model can perform well on average while failing for particular user groups, languages, tasks, or data categories.

Evaluation should therefore be broken into meaningful slices. This helps identify bias and avoids being misled by aggregate results, including cases related to **Simpson’s paradox**, where overall performance appears better while each important subgroup performs worse.

## 3.10 How much evaluation data is enough?

The required amount depends on the task, the cost of evaluation, and the reliability needed.

A practical reliability test is bootstrapping:

1. Create multiple bootstrap samples from the evaluation dataset.
2. Run the evaluation on each sample.
3. Compare the resulting scores.

If one sample produces 90% and another produces 70%, the evaluation set or pipeline is not stable enough to support confident decisions.

## 3.11 Evaluate the evaluator

The evaluation pipeline itself must be tested.

Ask:

- Do genuinely better responses receive higher scores?
- Do improvements in evaluation metrics lead to better business outcomes?
- Does running the same evaluation twice produce similar results?
- Are two metrics so strongly correlated that one is redundant?
- Are completely uncorrelated metrics revealing different qualities, or is one metric broken?
- How much cost and latency does evaluation add?

## 3.12 Evaluating an agent system

An agent cannot be evaluated only by grading its final prose. The complete business outcome and the intermediate decisions that produced it both matter.

### Component-level evaluation

Component checks ask whether each bounded responsibility worked correctly:

- Was the request routed to the correct workflow?
- Were required fields extracted accurately?
- Was each value supported by the source material?
- Was the correct schema selected?
- Were missing and ambiguous fields detected?
- Was the correct tool selected with valid parameters?
- Were retries safe and justified?
- Did a handoff preserve the required IDs, types, and evidence?

### End-to-end evaluation

End-to-end checks ask:

- Did the workflow reach the correct state?
- Did it complete the intended goal?
- Did it avoid unauthorized or duplicate actions?
- How many steps, tokens, tool calls, seconds, and dollars were required?
- Did a human need to correct or override the result?

Functional correctness should be preferred whenever a deterministic answer exists. An LLM judge is useful for softer criteria such as clarity, professionalism, or source consistency, but exact identifiers and state transitions should be checked with code and business rules.

### Trace inspection

The **trace** is evaluation evidence, not merely a debugging log. Store the input, prompt and model versions, structured outputs, field provenance, validation results, tool requests, tool responses, state transitions, retries, latency, cost, and human corrections.

When a system fails, inspect the trace to identify whether the problem came from extraction, context, planning, tool selection, a handoff, an external dependency, or the final synthesis step. Those observations should become new regression cases.

For the Example Agent, meaningful evaluation slices include complete versus incomplete submissions, one versus multiple service locations, email-only versus attachment-heavy requests, conflicting values, unsupported files, explicit versus vague proposal instructions, and prompt-injection content inside an attachment.

Evaluation should begin early with a small representative dataset. It does not need to be perfect before development starts, but it must grow from observed failures and remain connected to the business risks of each error type.

## Key takeaway

Evaluation should be designed before major optimization work. Without a reliable evaluation system, teams cannot know whether a new prompt, model, retriever, fine-tuning run, tool, or architecture change actually improved the application.