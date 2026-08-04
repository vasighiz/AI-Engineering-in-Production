# 6. RAG and Context Construction

A model needs two things to complete a task:

1. Instructions describing what to do
2. Information required to do it

Prompt engineering primarily addresses the first need. **Retrieval-augmented generation (RAG)** and agentic systems help provide the second.

## 6.1 RAG and the agentic pattern

Two common approaches extend a model beyond its static training knowledge:

- **RAG:** Retrieves relevant information from external sources and places it in the model’s context.
- **Agentic pattern:** Lets the model actively use tools such as search engines, APIs, or databases to gather information and take actions.

RAG is mainly a context-construction technique. Agents can retrieve information but can also plan, call tools, loop, and change external systems.

## 6.2 What RAG does

RAG connects a model to information that:

- Was not present in training
- May have been forgotten
- Is private to an organization
- Changes over time
- Is specific to the current user or task

Possible external memory sources include:

- Internal databases
- Company documents
- Previous conversations
- Product catalogs
- The internet
- Structured tables
- Images

A basic RAG system has two components:

- **Retriever:** Finds relevant information.
- **Generator:** Produces an answer using the retrieved context.

These components are often developed separately using existing retrievers and models. The course notes that end-to-end fine-tuning of the complete RAG system can improve performance, although many teams begin with off-the-shelf components.

## 6.3 Indexing and querying

A retriever performs two broad functions.

### Indexing

Indexing prepares and organizes the data before user queries arrive. It may involve:

- Parsing documents
- Splitting them into chunks
- Creating keyword indexes
- Generating embeddings
- Storing metadata
- Building vector-search structures

### Querying

Querying uses the user’s request to retrieve the most relevant indexed items.

The way data is indexed determines how it can later be retrieved. Poor indexing cannot be fully repaired by a strong generator.

## 6.4 Why documents are chunked

Documents can range from a few tokens to millions of tokens. Retrieving entire documents can exceed the model’s context window and include large amounts of irrelevant information.

A common pipeline is:

1. Split documents into smaller chunks.
2. Index each chunk.
3. Retrieve the chunks most relevant to the user query.
4. Post-process and combine them with the user prompt.
5. Send the resulting context to the model.

Chunking is therefore a central design decision rather than a minor preprocessing step.

## 6.5 Term-based retrieval

Term-based, or lexical, retrieval finds documents using keyword overlap.

Benefits:

- Fast indexing and search
- Works well with existing search systems such as Elasticsearch
- Good for exact terms, identifiers, names, and error codes
- Easy to start with

Limitations:

- A document may contain a keyword without being conceptually relevant.
- Long queries contain terms of unequal importance.
- Simple token matching misses synonyms and semantic relationships.

TF-IDF and related methods improve lexical ranking by giving more weight to terms that are important within a document but less common across the collection.

## 6.6 Embedding-based retrieval

Embedding retrieval represents both documents and queries as vectors.

A common process is:

1. Convert each data chunk into an embedding.
2. Store embeddings in a vector database.
3. Convert the user query using the same embedding model.
4. Find the *k* nearest chunk vectors.
5. Return those chunks as candidate context.

This is usually framed as a **k-nearest-neighbor** problem. Exact nearest-neighbor search can be expensive at scale, so vector databases often use **approximate nearest-neighbor** algorithms.

They organize vectors through structures such as buckets, trees, or graphs to make similar items more likely to be found efficiently.

Benefits:

- Retrieves semantically related text even when the wording differs.
- Can improve substantially when the embedding model or retriever is fine-tuned.

Limitations:

- Exact identifiers, names, or codes can be harder to retrieve.
- Generating embeddings adds cost and latency.
- Vector infrastructure introduces operational complexity.

## 6.7 Hybrid and multi-stage retrieval

Production systems often combine retrieval methods.

For example:

1. A fast, cheaper lexical retriever produces a broad candidate set.
2. A more precise vector or reranking method selects the strongest candidates.

This approach reduces the cost of applying expensive retrieval to the entire corpus while preserving higher precision.

## 6.8 Chunk size and overlap

Chunks can be based on:

- Characters
- Words
- Sentences
- Paragraphs
- Semantic boundaries

Overlapping chunks help preserve information that falls near a boundary.

Trade-offs include:

- **Smaller chunks:** Allow more diverse pieces of information to fit in the context, but may lose surrounding meaning.
- **Larger chunks:** Preserve more context but may include irrelevant material and reduce the number of distinct sources that fit.
- **More overlap:** Reduces boundary loss but increases storage, embedding cost, and duplicate retrieval.

There is no universal ideal chunk size or overlap percentage. It must be tested against the application’s data and evaluation set.

## 6.9 Reranking

The first-stage retriever produces an initial ranking. A reranker can refine it before the context is sent to the model.

Additional ranking signals may include:

- Semantic relevance
- Keyword relevance
- Recency
- Source authority
- User or product metadata
- Business rules

Reranking is especially useful when context-window limits require reducing a large candidate set to a small number of high-value chunks.

## 6.10 Query rewriting

A user query may be incomplete without conversation history.

For example, after asking about Paris, the user may ask, “What is its population?” A retrieval system should rewrite or expand that into a self-contained query such as, “What is the population of Paris?”

Query rewriting is also called:

- Query reformulation
- Query normalization
- Query expansion

The goal is to make the retrieval query contain enough context to find the correct information.

## 6.11 Enriching chunks with context

A chunk can be augmented with metadata or document-level context, including:

- Tags
- Keywords
- Titles
- Dates
- Product descriptions
- Reviews
- A summary of the full document
- Source or department
- Access permissions

This makes isolated chunks easier to retrieve and interpret. A paragraph taken from the middle of a long report may not be meaningful unless it carries information about the report’s topic.

## 6.12 Selecting a retrieval system

Important factors include:

- Support for lexical, embedding, or hybrid retrieval
- Supported embedding models
- Vector-search algorithms
- Storage scalability
- Query throughput
- Indexing speed
- Batch-processing support
- Query latency
- Pricing
- Security and compliance

The best system depends on the data, query patterns, scale, and operational constraints.

## 6.13 RAG beyond text

RAG is not limited to text documents.

### Multimodal RAG

A system can retrieve images or other media. If asked about the color of a house in a movie, it might retrieve a relevant image and provide it to a multimodal model.

### Tabular RAG and text-to-SQL

A system can turn a natural-language question into SQL, execute it, and generate a response from the result.

For a complex database with many tables, the system may first predict which tables are relevant. This avoids placing every schema definition into the context window.

## 6.14 Context engineering for agents

Context engineering decides what information an agent receives for a particular decision. It includes more than retrieved text. A useful context can contain:

- system and component instructions;
- the current request and source artifacts;
- relevant conversation or workflow history;
- available tool descriptions;
- versioned rules and schemas;
- results of earlier actions;
- current permissions and state;
- only the evidence needed for the next decision.

This context steers a non-deterministic model toward consistent behavior. The intelligence of an agent system comes not only from the model, but from how the surrounding context, tools, constraints, and state are engineered.

## 6.15 Knowledge, run state, memory, and live results

These information types should be separated because they have different owners, update patterns, and trust levels.

| Information type | Meaning | Example Agent example |
|---|---|---|
| Knowledge | Versioned reference information that applies across runs | Regional schemas, terminology, approval rules, service configuration |
| Run state | Current facts for one workflow | Extracted fields, unresolved questions, record IDs, approval status |
| Long-term memory | Governed lessons retained from reviewed past runs | Approved terminology patterns or recurring document layouts |
| Live tool result | Current authoritative system information | Existing customer match, prerequisite status, proposal status |

Knowledge is relatively static reference material. Memory is dynamic and may be updated from experience, but only through governance and review. Run state should be explicit and durable rather than hidden in free-form conversation history. Current business facts should come from authorized tools rather than stale memory.

## 6.16 Do not use vector RAG for every context problem

Choose the retrieval method that matches the information:

- Use exact key or version lookup for structured schemas and configuration.
- Use authorized services for current records, permissions, and workflow status.
- Use semantic retrieval for unstructured documentation where wording varies.
- Use lexical or hybrid retrieval for identifiers, error codes, and exact names.
- Keep fixed critical instructions in configuration when they apply to every run.

Retrieved text should not override structured rules, permissions, or system instructions. For the Example Agent, an attachment may provide business data, but content inside it cannot redefine the agent’s tools or authorization boundaries.

## Key takeaway

A RAG or agent system is only as strong as its context construction. The model cannot reliably use information that was not retrieved, was split or ranked poorly, came from the wrong authority, or was mixed with stale and ungoverned memory.