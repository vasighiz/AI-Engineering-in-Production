# 9. Dataset Engineering

Most companies cannot afford to train a foundation model from scratch, but nearly every company can create better data for adaptation and evaluation.

The course describes a shift from **model-centric AI** to **data-centric AI**.

- Model-centric work improves architectures, model size, or training methods.
- Data-centric work improves the quality, coverage, processing, and structure of the data.

For organizations adapting existing foundation models, proprietary and well-engineered datasets can create a stronger competitive advantage than access to the model itself.

## 9.1 Data format depends on the adaptation task

Different training objectives require different dataset structures.

### Self-supervised fine-tuning

Requires sequences of domain-relevant data. The model continues learning the statistical patterns of the target domain.

### Instruction fine-tuning

Requires instruction-and-response pairs. The data should demonstrate how the model is expected to answer requests.

### Preference fine-tuning

Requires an instruction, a preferred response, and a less preferred response.

### Reward modeling

Requires preference comparisons or examples with explicit quality scores.

The training data must demonstrate the behavior the model should learn. This is difficult for complex behaviors such as multi-step reasoning, tool use, or agent planning.

## 9.2 Single-turn and multi-turn data

Conversational applications may need both.

- **Single-turn data** teaches the model how to answer an individual instruction.
- **Multi-turn data** teaches it to work through a dialogue, ask clarifying questions, incorporate corrections, and preserve context.

A model trained only on isolated question-answer pairs may struggle with realistic conversations that involve changing requirements and user feedback.

## 9.3 Quality is more important than raw volume

A small amount of carefully designed data can outperform a much larger noisy dataset.

The course notes that human-generated data is not automatically reliable. Human annotators can make errors and apply nuanced policies inconsistently. Some model teams therefore use AI-assisted annotation tools to improve consistency and quality control.

High-quality data has several dimensions.

### Relevance

Examples must match the target task and current domain. Historical legal text may not represent modern legal questions.

### Alignment with the desired behavior

If the application requires factual accuracy, the examples must be factually correct. If it requires creativity, the examples must demonstrate useful creativity.

### Consistency

Different examples and annotators should apply the same policy and scoring rules.

### Correct formatting

Examples must follow the structure expected by the training system and model.

### Uniqueness

Excessive duplication can overrepresent certain patterns and reduce effective diversity.

### Compliance

Data must satisfy internal policies, privacy requirements, licenses, and external regulations.

### Coverage

The dataset must represent the range of real problems the system will face. Large volume cannot compensate for missing important categories.

## 9.4 How much data is needed?

There is no universal answer. Requirements depend on:

- Fine-tuning method
- Task complexity
- Base-model capability
- Desired performance
- Data quality
- Domain breadth

Full fine-tuning generally requires much more data than PEFT methods such as LoRA.

A simple task, such as sentiment classification, requires less data than complex question answering over financial reports.

The closer the base model already is to the desired behavior, the fewer examples may be required.

The course notes that with a small dataset, a stronger base model may fine-tune better than a weaker one. With a very large dataset, the performance gap between base models may shrink because the adaptation data dominates.

## 9.5 Start with a small, high-quality experiment

Before investing in a large dataset, create approximately fifty carefully designed examples and run a small fine-tuning experiment.

- If quality improves clearly, additional data may help.
- If quality does not improve, a larger dataset will not necessarily solve the problem.

First investigate other causes:

- Poor hyperparameters
- Incorrect formatting
- Weak labels
- Inconsistent task definition
- Broken evaluation
- Model or method mismatch

The course suggests that meaningful improvement should often be visible with roughly fifty to one hundred strong examples.

## 9.6 Reduce the amount of expensive data required

Several staged-training strategies can help.

### Self-supervised to supervised

First train on broad domain documents, then train on targeted instruction-response pairs.

### Less relevant to more relevant

Start with abundant examples from an adjacent domain, then fine-tune on the smaller dataset from the exact target domain.

### Synthetic to real

Start with AI-generated examples, then finish with limited real examples.

These approaches use cheaper or more available data to establish general patterns before applying the most valuable data.

## 9.7 Use scaling experiments

Train on different fractions of the existing dataset, such as:

- 25%
- 50%
- 100%

Then plot performance against dataset size.

- A steep improvement suggests that more data may continue to help.
- A plateau suggests diminishing returns.

This is more informative than collecting a large additional dataset without evidence that volume is the current bottleneck.

## 9.8 Sources of additional data

### User-interaction data and the data flywheel

A product can use real interactions to continuously improve.

User queries, corrections, accepted answers, rejected answers, and task outcomes create proprietary data unavailable to competitors.

This forms a **data flywheel**:

1. The product serves users.
2. Interactions generate data.
3. Data improves the system.
4. A better system attracts or retains more users.
5. More users generate more data.

The flywheel must still respect privacy, consent, and data governance.

### Existing datasets

Public or licensed datasets can be combined, but each source must be checked for:

- Quality
- Relevance
- License terms
- Duplicates
- Bias
- Format compatibility

### Human annotation

The hardest part is often not hiring annotators but writing clear guidelines.

Guidelines should define:

- What makes a response good
- Whether a correct but unhelpful answer is acceptable
- The difference between adjacent scores
- How to handle uncertainty
- How to handle edge cases

These rules are necessary for both human and AI-assisted annotation.

## 9.9 Data augmentation and synthetic data

### Data augmentation

Creates a new example by transforming a real example. Flipping an image is a simple visual example.

### Synthetic data

Creates an artificial example from scratch to reproduce useful properties of real data. Simulating mouse movements is one example given in the course.

The distinction matters:

- Augmented data remains derived from real data.
- Synthetic data is generated rather than directly transformed.

Synthetic data can be useful when real data is private or difficult to collect. It can also increase coverage and consistency.

However, AI-generated data must be evaluated just as carefully as human-generated data. Synthetic volume is not useful if it reinforces errors or lacks diversity.

## 9.10 Data-processing best practices

### Test processing code before large runs

Start with small samples and test scripts before processing the full dataset.

### Preserve original data

Do not modify raw data in place. Keep an immutable original version so transformations can be audited and reproduced.

### Perform exploratory analysis

Inspect:

- Distributions
- Outliers
- Missing fields
- Class balance
- Lengths
- Sources
- Annotation patterns

### Study annotator disagreement

Disagreement can reveal unclear guidelines, subjective tasks, or difficult examples. Resolve systematic conflicts rather than hiding them.

### Fact-check and manually inspect

Automated checks are useful, but manual review remains necessary, especially for a sample of high-impact or unusual examples.

### Deduplicate

Duplicates can overrepresent certain content and contaminate evaluation splits.

### Clean formatting

Remove unnecessary HTML, malformed Markdown, and irrelevant formatting tokens. This can reduce input length and improve consistency.

### Remove non-compliant data

Filter personally identifiable information, toxic material, copyrighted content when not permitted, and any data that violates policy.

### Filter low-quality examples

Verification should remove examples that are incorrect, inconsistent, or irrelevant.

### Use active learning when compute is limited

If the available data exceeds the training budget, active learning can help select the most informative examples.

### Match the model’s format

Use the correct tokenizer and chat template. A high-quality dataset in the wrong input format may still train poorly.

## 9.11 Agent traces and corrections become datasets

Agent systems produce richer learning records than a final prompt-and-response pair. A governed trace can capture:

- the original input or a redacted fixture;
- expected and predicted route;
- expected and predicted typed object;
- field-level provenance;
- required missing and ambiguous fields;
- available tools and selected tool calls;
- expected and actual workflow state;
- allowed and prohibited actions;
- retries, errors, and external results;
- human correction and the reason for it;
- evaluation slice labels.

These records can support regression evaluation, prompt improvement, tool debugging, model selection, and eventually fine-tuning. The trace should be treated as sensitive operational data: redact or tokenize private fields, apply retention rules, preserve provenance, enforce access controls, and keep tenant or customer data isolated.

Human feedback should enter the evaluation dataset before it enters long-term memory. A correction becomes reusable only after review confirms that it is accurate, current, authorized, and consistent with the active schema or policy.

## 9.12 Build coverage from failures

Begin with a small set of representative normal cases and deliberately difficult edge cases. For the Example Agent, useful labels include:

- complete versus incomplete request;
- single versus multiple service locations;
- email-only versus attachment-heavy input;
- conflicting evidence;
- formatted identifiers and leading zeros;
- unsupported or corrupt attachments;
- ambiguous proposal instructions;
- prompt injection inside source material;
- duplicate or uncertain business-record matches.

Each observed production or shadow-mode failure should become a reviewed regression case. This turns operational experience into a durable improvement asset rather than repeatedly fixing the same symptom.

## 9.13 Separate evaluation data from adaptation data

Do not automatically train on every production trace. Evaluation sets must remain stable enough to compare system versions, while training or prompt-development data can change more freely.

Maintain clear splits and lineage:

- development examples for prompt and component iteration;
- evaluation examples for release decisions;
- adversarial and safety suites;
- reviewed adaptation data for fine-tuning;
- holdout cases that are not used during optimization.

This separation reduces leakage and prevents an apparently improving system from merely memorizing its tests.

## Key takeaway

Dataset engineering is not simply collecting more examples. It is the disciplined process of defining desired behavior, creating coverage, enforcing quality and governance, and converting reviewed traces and corrections into reliable evaluation and improvement data.