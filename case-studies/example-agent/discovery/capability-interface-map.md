# Capability and Interface Map

Use this document during implementation discovery. Do not treat a visible UI action, business instruction, or fixture as proof that a callable production interface exists.

## Status vocabulary

- **Confirmed from code:** implementation and contract are visible in an active repository.
- **Inferred from code:** related behavior exists, but the production path is not confirmed.
- **Confirmed behavior/interface unknown:** users can perform the action, but the callable interface is unknown.
- **Fixture-only:** available only in test data or simulation.
- **Manual:** intentionally remains a human operation.
- **Unknown:** evidence has not yet been found.

## Capability inventory

| Priority | Logical capability | Evidence status | Owning service/repository | Real interface | Input/output contract | Side effect | Sync/async | Idempotency | Authentication/authorization | Failure behavior | Deployment evidence | Decision | Open questions |
|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Read inbound partner message and attachments | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 2 | Query customer profile | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 3 | Query service locations/accounts | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 4 | Resolve region/provider schema | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 5 | Create or update customer profile | Unknown |  |  |  | Write |  |  |  |  |  |  |  |
| 6 | Create or update service request | Unknown |  |  |  | Write |  |  |  |  |  |  |  |
| 7 | Check prerequisite readiness | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 8 | Check approval status | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 9 | Submit proposal request | Unknown |  |  |  | Write |  |  |  |  |  |  |  |
| 10 | Check proposal status | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 11 | Retrieve proposal artifact | Unknown |  |  |  | Read |  |  |  |  |  |  |  |
| 12 | Send notification or clarification | Unknown |  |  |  | Write |  |  |  |  |  |  |  |
| 13 | Append audit event | Unknown |  |  |  | Write |  |  |  |  |  |  |  |

## Discovery checklist for each capability

1. Find the user-facing behavior and record a screenshot or written observation without storing private data here.
2. Search active repositories for the operation, domain entity, endpoint, command, event, or job.
3. Verify that configuration or deployment evidence connects the code to an active environment.
4. Record the exact request, response, error, authentication, and permission contract.
5. Determine whether the operation is synchronous, asynchronous, or a long-running workflow.
6. Test duplicate behavior and identify the supported idempotency key.
7. Classify failures as validation, conflict, unauthorized, transient, timeout, or terminal.
8. Decide whether to reuse the interface, add a thin wrapper, keep the action manual, or exclude it from the current version.

## Decision rule

A capability may become an agent tool only when its contract, permissions, side effects, failure behavior, and observability are understood well enough to test safely. Until then, keep it outside the executable workflow.