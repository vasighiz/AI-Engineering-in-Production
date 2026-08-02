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

## Practical takeaway

AI engineering is less about asking, “How do I train a new model?” and more about asking:

- Which existing model is suitable?
- How should it be prompted or adapted?
- What information must be added to its context?
- How will the system be evaluated?
- What tools or actions should it access?
- How will cost, latency, reliability, and safety be managed?
