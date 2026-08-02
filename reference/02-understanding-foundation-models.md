# 2. Understanding Foundation Models

Foundation models can only learn from what appears in their training data. This simple fact affects their knowledge, biases, capabilities, and limitations.

## 2.1 Training data determines model knowledge

A model cannot reliably know a language, concept, domain, or pattern that was not represented in its training data. Most large foundation models are trained on web-crawled data, which creates several problems:

- Web data contains clickbait, misinformation, toxic material, and fake news.
- The distribution of languages is highly uneven. English makes up a large share of crawled text, while many widely spoken languages are underrepresented.
- Domain coverage is also uneven. Some datasets lean heavily toward areas such as business, technology, news, and art.
- The data may contain copyrighted, private, low-quality, or duplicated material.

Teams therefore filter and curate training data before using it. The course gives the example that GPT-2 training used Reddit links that had received at least three upvotes as a rough quality filter. This type of heuristic does not guarantee quality, but it illustrates how model builders try to reduce obviously poor data.

Because general web data does not represent every language or domain equally, specialized models for particular languages, industries, or technical fields can be valuable.

## 2.2 Why Transformers were a breakthrough

Most modern foundation models use the **Transformer** architecture and its attention mechanism.

Before Transformers, many sequence-to-sequence systems used recurrent neural networks. A typical system had:

- An **encoder** that processed the input
- A **decoder** that generated the output

These systems processed tokens sequentially. The decoder often depended on a compressed representation of the entire input. The course compares this to answering detailed questions about a book while having access only to a short summary. Sequential processing also made long inputs slow.

Transformers addressed both limitations:

- **Attention allows the model to reference different input tokens directly** while generating each output token.
- **Input tokens can be processed in parallel**, which improves efficiency during the input-processing phase.

The intuitive analogy is that the model can look back at the relevant “pages” of the input rather than relying on one compressed summary.

## 2.3 Prefill and decode

Transformer inference has two broad phases:

1. **Prefill:** The model processes the input tokens in parallel and builds the intermediate state needed for generation.
2. **Decode:** The model generates output one token at a time.

Prefill benefits from parallel computation. Decode remains sequential because each new output token depends on the tokens already generated. This distinction becomes important later when optimizing inference, because the two phases have different computational characteristics.

## 2.4 Query, key, and value vectors

Attention uses three main vector representations:

- **Query (Q):** Represents what information the current token is looking for.
- **Key (K):** Represents how previous tokens can be matched or indexed.
- **Value (V):** Represents the actual information contained in those tokens.

The model compares query and key vectors. A high similarity score means the corresponding value should have a stronger influence on the output.

Longer context windows are computationally expensive because the model must compute and store more key and value vectors. Attention is usually **multi-headed**, meaning multiple attention heads operate in parallel and can focus on different relationships among tokens.

## 2.5 Transformer blocks, layers, and embeddings

A complete Transformer contains multiple repeated blocks. Each block usually includes:

- An attention module
- A neural-network module

The number of blocks is often called the number of **layers**.

Before the blocks, an embedding module converts tokens and their positions into vector representations. After the blocks, an output layer maps the final vectors into probabilities over possible next tokens.

The model does not directly choose a word in the way a deterministic program would. It produces a probability distribution over possible tokens, and a sampling strategy determines which token is selected.

## 2.6 Other architectures and model size

Transformers dominate current foundation models, but they are not the only possible architecture. The course mentions RWKV as an example of an approach that combines ideas associated with recurrent networks and parallelization.

In general, larger models have more parameters and therefore more capacity to learn. Parameter count also helps estimate training and inference requirements, but it can be misleading:

- A **dense model** uses most of its parameters during computation.
- A **sparse model** may contain many inactive or zero-valued parameters and can sometimes require less computation than a smaller dense model.

Compute, rather than parameter count alone, is often the practical limiting factor.

## 2.7 Scaling laws and resource constraints

The course introduces the **Chinchilla scaling law**, which helps estimate a suitable balance between model size and training-data size for a fixed compute budget. A rough rule described in the course is that the number of training tokens should be approximately twenty times the number of model parameters. Under that rule, a three-billion-parameter model would need around sixty billion training tokens.

The cost of achieving a given level of performance has decreased over time, but each additional improvement can still be very expensive. Reducing an error rate from 3% to 2%, for example, may require much more data, compute, or energy than the previous improvement. Small gains can nevertheless matter greatly for downstream applications.

Two major scaling bottlenecks are highlighted:

- **High-quality training data:** There is concern that publicly available, high-quality internet data may become insufficient. Models may increasingly rely on synthetic data or proprietary sources such as books and medical records.
- **Electricity:** Data centers already consume a meaningful share of global electricity, and energy availability limits how far model training and deployment can scale without major efficiency improvements.

## 2.8 Why pre-trained models need post-training

A pre-trained language model is optimized primarily for text completion, not for helpful conversation. It may also produce factually incorrect, harmful, or poorly aligned output.

Post-training attempts to improve these behaviors through two broad stages.

### Supervised fine-tuning

**Supervised fine-tuning (SFT)** trains the model on high-quality instruction-and-response examples. Instead of only learning to continue text, the model learns what good responses to user requests should look like.

SFT is therefore used to improve conversational behavior, instruction following, formatting, and task completion.

### Preference fine-tuning

Preference fine-tuning teaches the model to favor outputs that people or evaluators prefer. A traditional approach is **reinforcement learning from human feedback (RLHF)**:

1. Humans compare or rate model outputs.
2. A reward model learns to score outputs.
3. The foundation model is optimized to produce outputs with higher reward scores.

The course also mentions newer approaches such as **direct preference optimization (DPO)**. Some systems avoid a full reinforcement-learning stage and instead generate several candidate responses, score them, and select the strongest one. This is described as a **best-of-N** strategy.

## 2.9 Sampling controls model behavior

A foundation model outputs probabilities rather than a single guaranteed answer. Sampling changes how those probabilities are turned into text.

### Greedy sampling

Greedy sampling always selects the highest-probability next token. It is deterministic but can create repetitive or predictable text.

### Temperature

Temperature changes how concentrated the probability distribution is:

- Lower temperatures make output more deterministic and focused.
- Higher temperatures produce more variety and creativity but can reduce consistency or accuracy.

### Top-k sampling

Top-k restricts the choice to the *k* most likely next tokens. The model samples only from that reduced set.

### Top-p sampling

Top-p selects the smallest set of tokens whose cumulative probability exceeds a chosen threshold. For example, a value of 0.9 keeps enough tokens to represent 90% of the total probability mass.

The probabilistic nature of generation helps explain why small prompt changes can produce different answers and why models can confidently generate incorrect information.

## Key takeaway

Understanding foundation models does not mean knowing every architectural detail. For an AI engineer, the important point is to understand how training data, architecture, context length, post-training, and sampling affect the behavior, cost, and reliability of the applications built on top of them.