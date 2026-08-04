# AI Engineering in Production

A source-based study reference covering the core concepts, design decisions, and production considerations of AI engineering. The material is organized by topic so each chapter can grow alongside practical implementation, evaluation, diagrams, and lessons learned.

The reference begins with the broader AI-application lifecycle and now extends it with production agent-system design and a fictional Example Agent case study.

## Interactive Lab

Explore agent design, autonomy, ReAct loops, guardrails, and production readiness in the [AI Agent Systems Lab](https://ai-engineering-in-production.vercel.app/).

## Contents

- [1. What Is AI Engineering?](reference/01-what-is-ai-engineering.md)
- [2. Understanding Foundation Models](reference/02-understanding-foundation-models.md)
- [3. Evaluating AI Models](reference/03-evaluating-ai-models.md)
- [4. Model Selection](reference/04-model-selection.md)
- [5. Prompt Engineering](reference/05-prompt-engineering.md)
- [6. RAG and Context Construction](reference/06-rag-and-context-construction.md)
- [7. Agents and Memory Systems](reference/07-agents-and-memory-systems.md)
- [8. Fine-Tuning](reference/08-fine-tuning.md)
- [9. Dataset Engineering](reference/09-dataset-engineering.md)
- [10. Inference Optimization](reference/10-inference-optimization.md)
- [11. Architecture and User Feedback](reference/11-architecture-and-user-feedback.md)
- [12. Designing Production Agent Systems](reference/12-designing-production-agent-systems.md)

## Case Study

The [Example Agent — Partner Service Request Intake](case-studies/example-agent/README.md) connects the concepts to a staged implementation roadmap.


## How the material fits together

The first eleven chapters cover the broader AI-engineering lifecycle: foundation models, evaluation, model selection, prompting, RAG, agents, fine-tuning, data, inference, architecture, monitoring, and feedback.

Chapter 12 adds the operational agent-design layer:

- deciding whether a task deserves an agent;
- choosing an autonomy level;
- decomposing work;
- defining tasks, tools, knowledge, memory, state, and guardrails;
- evaluating intermediate decisions and full traces;
- adding side effects only after a read-only slice passes;
- operating the system with security, observability, and human oversight.

## About This Reference

This repository is a growing study guide based initially on *AI Engineering* by Chip Huyen and expanded with agent-system design material, practical exercises, and implementation learning.

Planned additions include:

- implementation examples;
- production patterns;
- diagrams and architecture decisions;
- evaluation templates and datasets;
- exercises and interview questions;
- references to tools, frameworks, and research.
