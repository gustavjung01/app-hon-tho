### license_review.md

This review is guided mainly by the HKO rights pages, CText FAQ, Wikimedia Commons licensing policy/pages, DILA open-content statements, and CC-CEDICT’s explicit license. Those are the most legally load-bearing findings in the entire research pass. citeturn16view3turn16view4turn16view2turn16view5turn16view6turn18view0turn18view1turn18view2turn30search2

```md
# License Review

## Can be used more directly after normal attribution review

- DILA open-content dataset pages: ENG-012 ENG-013
- DILA GitHub repository: ENG-014
- CC-CEDICT lexical base: RUL-005
- Apache/MIT code candidates, after provenance review of embedded data:
  ENG-017 ENG-018 ENG-019 ENG-020 ENG-021

Note:
These are not automatically production-safe. DILA and CC-CEDICT are share-alike licensed and therefore must be reviewed for downstream KB architecture.

## Internal reference only

- HKO pages and conversion tables: ENG-001 ENG-002 ENG-003 ENG-004 RUL-001
- Y. T. Liu pages: ENG-005 ENG-006 ENG-007 ENG-008 ENG-009
- USNO / PVEducation technical pages: ENG-010 ENG-011
- CText pages: BOOK-001 BOOK-002 BOOK-003 BOOK-004
- WorldCat / Google Books / Needham / academic previews:
  BOOK-009 BOOK-010 BOOK-011 BOOK-012 BOOK-013 BOOK-014 CASE-001 CASE-002 CASE-003 CASE-004

## Short quotation only when rights and provenance are clear

- Wikimedia Commons free/public-domain scan candidates:
  BOOK-005 BOOK-006 BOOK-007
- Possibly BOOK-008 after edition/provenance verification

## Needs permission or explicit legal review before any substantial reuse

- GB/T 33661-2017 text itself: ENG-015
- HKO publications/tables if any commercial product reuse is contemplated
- Modern translated/annotated editions of classics:
  BOOK-009 BOOK-010 BOOK-011 BOOK-012 BOOK-013 BOOK-014
- Kubny PDFs and Homola book materials:
  CASE-001 CASE-003 CASE-004

## Should be removed from the pipeline

- REJ-001 Scribd upload
- REJ-002 dokumen.pub mirror
- REJ-003 unclear paid-resource page
- REJ-004 public marketing calculator without provenance
- REJ-005 marketing homepage

## Operational rule

If a source is:
- open but share-alike -> keep in a separate legal bucket
- public but site-rights-restricted -> internal reference only
- copyrighted book/translation -> catalog it, do not ingest text
- provenance-unclear upload/mirror -> reject
```
