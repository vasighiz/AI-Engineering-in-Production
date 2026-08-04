# 10. Inference Optimization

A model is useful in production only if it can respond at an acceptable speed and cost.

**Inference** is the phase in which a trained model receives input and computes output. Training builds or adapts the model; inference uses it.

## 10.1 Inference server and inference service

An **inference server**:

- Hosts models
- Allocates hardware
- Executes model computations
- Returns outputs

A broader **inference service** also handles:

- Request reception
- Routing
- Preprocessing
- Scheduling
- Batching
- Logging
- Resource management

When an application uses a commercial model API, the provider operates this service. When a team self-hosts a model, it becomes responsible for building, optimizing, and maintaining the infrastructure.

## 10.2 Compute-bound and memory-bandwidth-bound workloads

Optimization begins by identifying the actual bottleneck.

### Compute-bound

Performance is limited by available computational power.

Image generation and other calculation-intensive workloads may be compute-bound. They can benefit from:

- More powerful accelerators
- More floating-point operations per second
- Distributing computation across devices

### Memory-bandwidth-bound

Performance is limited by how quickly data moves between memory and processors.

Autoregressive language-model inference is often memory-bandwidth-bound because model weights and intermediate state must be read repeatedly during token generation.

It may benefit from:

- Higher memory bandwidth
- Smaller or quantized weights
- More efficient memory access
- Attention and cache optimization

Profiling tools and roofline analysis can help determine which bottleneck dominates. The important lesson is that an optimization for one bottleneck may not help another.

## 10.3 Online and batch inference

### Online APIs

Process requests as they arrive and prioritize low latency. Chatbots and interactive assistants usually require online inference.

### Batch APIs

Group requests and prioritize cost and throughput over immediate response. Suitable uses include:

- Periodic report generation
- Offline classification
- Synthetic-data creation
- Large evaluation runs

The inference mode should match the user experience and service-level requirement.

## 10.4 Latency metrics

### End-to-end latency

Time from the user sending the request until receiving the complete response.

### Time to first token (TTFT)

Time until the first generated token is available.

This strongly affects perceived responsiveness in streaming applications.

### Time per output token (TPOT)

Time required to produce each subsequent token.

A simplified total-latency relationship is:

\[
\text{Total latency} \approx \text{TTFT} + (\text{TPOT} \times \text{number of output tokens})
\]

### Time to publish

The first generated token may not be immediately shown. A system may generate an internal plan, apply a guardrail, or wait for enough content before streaming. Some teams therefore measure the time until output is actually visible to the user.

Latency varies across requests, so percentiles are more informative than a simple average. Production systems commonly care about slow-tail behavior, not only typical behavior.

## 10.5 Throughput and utilization

### Throughput

The number of output tokens the service can generate per second across all requests.

Higher throughput often reduces cost per request, but techniques that improve throughput can increase individual latency.

### Latency–throughput trade-off

Batching is a clear example:

- Larger batches improve hardware utilization and total throughput.
- Waiting for batches can delay an individual user request.

The correct balance depends on the application.

### Utilization

The course describes measures such as:

- Ratio of observed model computation to the hardware’s theoretical peak
- Percentage of available memory bandwidth being used

These metrics help show whether expensive hardware is being used efficiently.

## 10.6 Hardware considerations

An accelerator is a chip designed for specialized computation. GPUs dominate many AI workloads because they contain thousands of smaller cores that can perform matrix operations in parallel.

CPUs contain fewer, more powerful cores optimized for general-purpose work.

Training and inference have different needs:

- Training requires memory for activations, gradients, and optimizer state.
- Inference may use lower precision and often prioritizes response latency.
- Training is generally more difficult to run at very low precision.

When selecting hardware, ask:

1. Can it run the workload?
2. How long does the workload take?
3. How much does it cost?

Important specifications include:

- Floating-point compute
- Memory capacity
- Memory bandwidth

Compute-bound workloads prioritize compute. Memory-bound workloads prioritize memory bandwidth and sufficient capacity.

## 10.7 Model-level optimization

### Quantization

Reduces numerical precision and model-memory usage.

Weight-only quantization is popular because it is relatively easy to apply and can provide substantial savings without redesigning the model.

### Pruning

Removes or zeroes less important parameters. The goal is to reduce effective model size and computation.

### Distillation

Trains a smaller model to imitate a larger model. It can produce a model that is cheaper and faster while retaining much of the task-specific quality.

## 10.8 Speeding up autoregressive decoding

Language models generate one token at a time, creating a sequential bottleneck.

### Speculative decoding

A smaller, faster model proposes candidate tokens. The target model verifies them.

The course compares this to an assistant drafting text for a manager to approve. If several candidate tokens are accepted at once, generation can accelerate.

### Inference with reference

For document-based tasks, the system can copy appropriate tokens from the input rather than generating every token from scratch.

### Parallel decoding

Attempts to generate multiple tokens simultaneously, reducing strict sequential dependence.

### Attention optimization

Makes Transformer attention calculations more memory- and compute-efficient, especially for long contexts.

## 10.9 Kernels and compilers

At a lower level, specialized kernels optimize operations for the target hardware.

Techniques include:

- Vectorization
- Parallelization
- Loop tiling
- Operator fusion

Compilers translate model operations into optimized hardware-specific code. These optimizations improve execution without changing the application’s high-level behavior.

## 10.10 Service-level optimization

### Static batching

Collects a fixed number of requests before processing.

It is simple but may create unpredictable waits when traffic is low.

### Dynamic batching

Processes a batch when either:

- It reaches a maximum size, or
- A maximum waiting time is reached

This creates a better latency guarantee than waiting indefinitely for a full batch.

### Continuous batching

Adds new requests as others finish and returns individual outputs as soon as they complete.

It offers a strong user experience and high utilization but is more complex.

### Decoupled prefill and decode

Prefill and decode have different resource characteristics. Separating them can prevent competition and improve efficiency.

### Prompt caching

Stores repeated prompt segments, such as:

- System instructions
- Shared reference documents
- Earlier conversation context

This avoids reprocessing identical content for every request and is particularly valuable for long conversations or repeated questions about the same document.

## 10.11 Parallelism for large models and high traffic

### Replica parallelism

Runs multiple complete copies of the model. Each replica handles separate requests.

This is simple and effective for high throughput but increases hardware cost.

### Model parallelism

Splits one model across devices.

Forms mentioned in the course include:

- **Tensor parallelism:** Split large operations across devices.
- **Pipeline parallelism:** Divide model layers into sequential stages.
- **Context parallelism:** Split input context across devices.
- **Sequence parallelism:** Split selected sequence-related operations.

## 10.12 Choosing optimizations

The correct combination depends on:

- Latency target
- Throughput target
- Model size
- Traffic pattern
- Context length
- Hardware budget
- Hosting environment

For many applications, the course highlights several high-impact techniques:

- Quantization
- Tensor parallelism
- Replica parallelism
- Attention optimization

Low-latency applications may accept higher cost for more replicas. Offline workloads may emphasize large batches and maximum throughput.

## 10.13 Optimize the complete agent workflow

Agent latency and cost are sums across components, not properties of one model call. Establish a baseline for every stage:

- ingestion and document parsing;
- retrieval and reranking;
- each model call;
- deterministic validation;
- tool execution;
- retries and reflection passes;
- orchestration and handoffs;
- external waits and human checkpoints.

Record both per-step and end-to-end percentiles. This reveals whether the largest bottleneck is model inference, an external API, repeated parsing, unnecessary serialization, or a long-running business dependency.

## 10.14 Latency optimization order

After measuring the baseline:

1. Remove unnecessary model, retrieval, and tool calls.
2. Run genuinely independent work in parallel, such as parsing separate attachments or performing independent read-only lookups.
3. Use smaller and faster models for simple components when evaluation permits.
4. Trim prompts and pass only the context needed for the current decision.
5. Test faster providers or serving configurations.
6. Cache versioned schemas, deterministic lookups, embeddings, retrieval results, and other safe repeated work.
7. Optimize the largest measured bottleneck first.

Parallelism should respect dependencies and side effects. Two write operations that can conflict should not be parallelized simply to reduce latency.

## 10.15 Cost optimization order

Measure tokens, model charges, external API fees, parsing services, storage, vector infrastructure, and compute for each step. Then:

- attack the largest cost buckets first;
- reduce redundant searches and tool calls;
- tier models by task difficulty;
- constrain outputs to typed and concise formats;
- cache deterministic or versioned results;
- batch offline evaluations and high-volume homogeneous work;
- set step, token, retry, and spending limits.

A successful workflow that uses twenty calls may be less valuable than one that reaches the same verified outcome in three.

## 10.16 Durable waits are not model latency

A production workflow may wait minutes, hours, or days for a prerequisite, approval, external calculation, or status change. The system should persist its state, release compute, and resume from an event or controlled poll.

Do not keep an LLM loop or worker active while waiting. For the Example Agent, prerequisite data, approval, and proposal processing should be modeled as durable workflow states with correlation IDs, timeouts, and recovery behavior.

## Key takeaway

Inference optimization is not one trick, and agent optimization is not limited to inference. Profile the full workflow, remove unnecessary work, parallelize only safe independent steps, right-size models, trim context, cache and batch appropriately, and separate durable business waits from active computation.