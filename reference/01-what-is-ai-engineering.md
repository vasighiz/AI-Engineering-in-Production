# 1. What Is AI Engineering?

## Core definition

**AI engineering is the discipline of building applications on top of foundation models.** Traditional machine-learning engineers often spend substantial effort developing and training models for a particular task. AI engineers usually begin with an already trained foundation model and focus on adapting it into a useful, reliable application.

This shift became possible for two main reasons:

- **Models became dramatically more capable.** Modern models can solve a much wider range of real-world problems than earlier task-specific systems.
- **The barrier to building with models became much lower.** Developers can access powerful models through APIs or deploy open-weight models without recreating the entire training process.

As a result, the center of engineering work has moved away from training every model from scratch and toward selecting, adapting, evaluating, integrating, and operating models inside larger software systems.

## Foundation models and self-supervised learning

Foundation models are large models trained on broad datasets. They typically use **self-supervision**, which means the training signal is created from the data itself rather than from manually labeled examples.

For language models, a common self-supervised objective is to predict missing or future parts of text. Because the raw text provides both the input and the expected prediction target, models can learn from enormous datasets without requiring humans to label every example.

Self-supervision helped reduce the data-labeling bottleneck that limited earlier machine-learning systems. As models were trained with more data and computing power, they evolved from language models into **large language models (LLMs)**. They also expanded beyond text into images, audio, and video, producing **multimodal foundation models**.

## What AI engineers build

Foundation models now support applications such as:

- Coding assistants
- Image-generation systems
- Writing tools
- Customer-support bots
- Data-analysis systems
- Search and retrieval applications
- Tool-using agents
- Multimodal applications

The model is only one component. The AI engineer is responsible for the surrounding system: prompts, retrieval, tools, evaluations, safety controls, data pipelines, feedback loops, deployment, and inference performance.

## When should an AI application become an agent?

A one-shot model produces a response from a single call. An agent is useful when completing the goal requires a sequence of decisions and interactions with an environment: plan, retrieve information, call a system, inspect the result, correct an error, request clarification, or wait for an external event.

The basic **ReAct** loop describes this iterative behavior:

1. **Reason:** decide what should happen next.
2. **Act:** call a permitted tool or produce an intermediate result.
3. **Observe:** inspect the result or current environment state.
4. **Continue or stop:** take another controlled step or return the final result.

This can produce stronger work than asking a model to complete everything in one pass, because planning, research, drafting, checking, and revision become separate steps. The trade-off is additional latency, cost, uncertainty, security exposure, and operational complexity.

A useful early screen compares **task complexity** with **required precision**. Complex tasks that tolerate review are often good starting points. Complex, high-precision, high-impact work requires narrower autonomy, deterministic validation, and human approval.

For the public Example Agent, classifying a partner request and extracting typed fields are reasonable model-assisted tasks because the language and document formats vary. Creating business records or submitting a proposal request has greater impact, so those stages should use validated tool contracts, idempotency, authorization, and explicit approval.

The design question is therefore not only, “Can an LLM do this?” It is:

> Does controlled iteration and tool use create enough value to justify a more complex system?

## Practical takeaway

AI engineering is less about asking, “How do I train a new model?” and more about asking:

- Which existing model is suitable?
- How should it be prompted or adapted?
- What information must be added to its context?
- How will the system be evaluated?
- What tools or actions should it access?
- How will cost, latency, reliability, and safety be managed?
