### data_filter_rules.md

The filtering logic below is intentionally conservative. It matches the project’s stated direction: engine first, books later, web as display layer, and AI only on audited data. That means the KB has to be built from filtered facts, not “interesting explanations.” citeturn13view3turn18view0turn21search3turn16view2

```md
# Data Filter Rules

## Core

Definition:
- calendar mechanics
- sexagenary mechanics
- solar-term boundaries
- date conversion logic
- explicit lookup tables with stable provenance

Allowed source profile:
- official observatory / standard / academic open dataset
- well-documented open-source implementation only as comparison, never sole authority

Examples:
- ENG-006 ENG-007 ENG-008 ENG-012 ENG-013
- validate against ENG-002 ENG-003 ENG-004 ENG-015

Gate:
- at least 2 independent high-confidence sources, or
- 1 normative source + 1 validation source

## Reference

Definition:
- classics
- academic books
- scholarly previews
- bibliographic records
- interpretive traditions kept for comparison

Examples:
- BOOK-001 BOOK-002 BOOK-003 BOOK-004
- BOOK-009 BOOK-010 BOOK-011 BOOK-012 BOOK-013 BOOK-014
- CASE-001 CASE-002

Usage:
- internal comparison
- topic tagging
- disagreement logging
- glossary enrichment

## Quote

Definition:
- short excerpts only
- exact edition/scan must be pinned
- only if rights are clear

Examples:
- BOOK-005 BOOK-006 BOOK-007

Usage:
- scholarly citation layer
- provenance display
- not bulk-copy into product text

## Glossary

Definition:
- multilingual term normalization
- Hán, Hán-Việt, Vietnamese, English, aliases

Examples:
- RUL-002 RUL-003 RUL-005
- RUL-004 only as convenience wrapper, not scraping target

## Rejected

Definition:
- no provenance
- upload/mirror piracy risk
- marketing-first sources
- sensational or deterministic positioning
- unclear ownership of training/examples

Examples:
- REJ-001 REJ-002 REJ-003 REJ-004 REJ-005

## Conflict rule

If two sources disagree:
- do not auto-resolve into engine logic
- mark candidate rule as needs_review
- record which school/tradition the rule appears to belong to
- move it out of Core until adjudicated
```
