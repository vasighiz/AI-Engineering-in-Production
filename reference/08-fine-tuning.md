# 8. Fine-Tuning

Fine-tuning adapts a pre-trained model by continuing training and modifying some or all of its weights.

Compared with prompt engineering and RAG, fine-tuning offers deeper customization but requires more data, compute, memory, and specialized expertise.

## 8.1 What fine-tuning can improve

Fine-tuning can improve:

- **Domain-specific capabilities:** Coding, medicine, legal work, or another specialized area
- **Instruction-following behavior:** Formatting, tone, response structure, or task-specific behavior
- **Consistency:** Producing a repeated schema or style more reliably
- **Small-model specialization:** Helping a smaller model perform well on a narrow task

## 8.2 When to consider fine-tuning

The course recommends considering fine-tuning when:

- Prompting has already been explored thoroughly.
- The desired output format must be highly consistent.
- A smaller model must become stronger on a specific task.
- There is enough high-quality task data.
- The team can support training and evaluation.

A common use is **model distillation**, where a smaller model is trained to imitate the behavior of a larger model on a target task. The specialized small model may outperform a larger general-purpose model within that narrow area.

## 8.3 When not to fine-tune

Avoid jumping directly to fine-tuning when:

- The project is still in early exploration.
- A general-purpose model is required.
- The problem is mainly missing information.
- Prompting or RAG has not been tested.
- There is no reliable evaluation pipeline.
- The training data is weak or inconsistent.

Fine-tuning can improve one behavior while degrading others, a risk that matters for models expected to handle diverse tasks.

## 8.4 Fine-tuning versus RAG

A useful distinction is whether failure is information-based or behavior-based.

### Information-based failure

The model lacks required knowledge, such as:

- Private company data
- Recent events
- Current product inventory
- A user’s documents

RAG is usually the better first response because it gives the model access to the missing information.

### Behavior-based failure

The model has the relevant information but behaves incorrectly:

- Uses the wrong format
- Gives irrelevant details
- Fails to follow instructions
- Applies the wrong style
- Does not use tools correctly

Fine-tuning may be more appropriate.

If both problems exist, start with RAG because it is usually easier, then consider combining RAG and fine-tuning.

## 8.5 Suggested adaptation workflow

1. Define evaluation criteria and build the evaluation pipeline.
2. Try prompting.
3. Add examples to the prompt.
4. If failures are information-related, add simple RAG.
5. Improve retrieval if needed, including embedding-based methods.
6. If failures are behavioral, consider fine-tuning.
7. Combine RAG and fine-tuning when both knowledge and behavior need improvement.

## 8.6 Why fine-tuning requires more memory

Neural-network training uses backpropagation.

Each training step includes:

- **Forward pass:** Compute the model output.
- **Backward pass:** Compute gradients and update trainable weights.

Inference uses only the forward pass. Training must store or recompute additional intermediate values, gradients, and optimizer state, so it needs much more memory.

Memory usage depends on:

- Total parameters
- Number of trainable parameters
- Numerical precision
- Stored activations
- Optimizer state

A **trainable parameter** is updated during training. A **frozen parameter** remains unchanged.

## 8.7 Gradient checkpointing

Gradient checkpointing, also called activation recomputation, reduces memory usage by not storing every activation from the forward pass.

Instead, some activations are recomputed during backpropagation. This uses more computation and training time but lowers memory requirements.

## 8.8 Quantization and numerical precision

Quantization represents weights with fewer bits.

For example, a thirteen-billion-parameter model in 32-bit floating point uses roughly fifty-two gigabytes for the weights alone. Representing the same weights in 16-bit precision roughly halves that requirement.

Inference may use 16-bit, 8-bit, or even 4-bit formats. Training is more sensitive to numerical precision and often uses mixed precision, where some operations remain higher precision and others use lower precision.

Different formats balance:

- Range of representable values
- Numerical precision
- Memory usage
- Speed

A model should be loaded using a format compatible with how its weights were prepared. The course notes that loading weights in an unintended format can significantly reduce quality.

## 8.9 Parameter-efficient fine-tuning

Full fine-tuning updates every parameter. This was more practical for smaller models but becomes expensive as model size grows.

Partial fine-tuning updates only selected existing layers, but it is not always very parameter-efficient.

**Parameter-efficient fine-tuning (PEFT)** adds or trains a small number of parameters while keeping most original weights frozen.

Benefits include:

- Lower memory requirements
- Less training compute
- Better sample efficiency
- Easier storage of multiple task variants

PEFT methods are broadly divided into:

- **Adapter-based methods:** Add trainable modules or weight updates.
- **Soft-prompt methods:** Add trainable virtual tokens.

## 8.10 LoRA

**Low-rank adaptation (LoRA)** is a widely used adapter-based method.

Instead of updating a large weight matrix directly, LoRA represents the update as the product of two smaller matrices.

For an original matrix with dimensions \(n \times m\):

- Choose a smaller rank \(r\).
- Create matrix \(A\) with dimensions \(n \times r\).
- Create matrix \(B\) with dimensions \(r \times m\).
- Freeze the original weight matrix.
- Train only \(A\) and \(B\).

At inference time, the low-rank update can be merged into the original weights, which avoids the additional latency associated with some adapter designs.

LoRA efficiency depends on:

- Chosen rank
- Which model matrices receive adapters
- Data quality
- Task complexity

It is often applied to attention-related Transformer matrices.

## 8.11 Fine-tuning for multiple tasks

### Simultaneous fine-tuning

Train on a combined dataset containing examples from all tasks. This can require careful data balancing and more data.

### Sequential fine-tuning

Fine-tune on task A, then task B. This can cause **catastrophic forgetting**, where performance on the earlier task degrades.

### Model merging

Fine-tune separate models for separate tasks, then combine them.

Model merging can:

- Combine strengths from different fine-tuned variants
- Reduce the need to run multiple models
- Avoid the higher inference cost of ensembling
- Support on-device deployment
- Help with federated-learning scenarios

Ensembling combines outputs from multiple models at runtime. Merging combines the model weights themselves.

The course mentions several merging approaches:

- Summing or combining weights
- Stacking layers from different models
- Concatenating parameters, although this may not reduce memory

## 8.12 Practical fine-tuning development path

1. Test the training code on the cheapest and fastest model.
2. Fine-tune a medium-sized model to validate the data.
3. Confirm that training loss behaves sensibly as data increases.
4. Run experiments on the target model.
5. Map the cost–performance frontier.
6. Select the model and method that meet the application requirements.

If loss does not improve as expected, investigate the data, formatting, hyperparameters, and pipeline before assuming a larger model is required.

## 8.13 Distillation path

A possible distillation workflow is:

1. Start with a small, high-quality dataset.
2. Use the strongest affordable model.
3. Train or adapt the strongest version possible.
4. Use it to generate more task-specific training data.
5. Train a smaller, cheaper model on the expanded dataset.

## 8.14 Choosing a fine-tuning method

The course recommends that beginners start with adapter methods such as LoRA rather than full fine-tuning.

Consider:

- Number of examples
- Model size
- Available hardware
- Number of task-specific variants
- Serving architecture
- Required quality
- Training and inference cost

Full fine-tuning may need thousands to millions of examples. PEFT methods can often work with hundreds or a few thousand high-quality examples.

Adapters are particularly useful when several specialized models share the same base model.

## 8.15 Important hyperparameters

### Learning rate

- If loss fluctuates heavily, the learning rate may be too high.
- If loss is stable but improves extremely slowly, it may be too low.
- A common strategy is to begin higher and decrease over time.

### Batch size

Large batches process more examples in parallel but require more memory. Small batches use less memory but produce noisier, less stable updates.

Gradient accumulation can simulate a larger effective batch by combining gradients across several smaller batches.

### Number of epochs

Smaller datasets often require more passes through the data.

The course gives rough examples:

- Millions of examples may need only one or two epochs.
- Thousands of examples may need four to ten epochs.

Reduce the number of epochs if evaluation shows overfitting.

### Prompt-loss weight

For instruction fine-tuning, this controls how much the prompt tokens contribute to the training loss relative to response tokens.

- At 100%, prompt and response contribute equally.
- At 0%, the model learns only from the response portion.
- The course notes that a default may place relatively low weight on prompt tokens.

## Key takeaway

Fine-tuning should be a deliberate response to measured behavioral limitations, not the default first step. Its success depends less on the existence of a training framework and more on evaluation quality, data quality, method selection, and careful control of compute and memory.