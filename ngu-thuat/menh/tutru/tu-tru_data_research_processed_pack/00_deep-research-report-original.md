# Research map for the Tứ Trụ candidate source base

## Executive summary

This research pass identified **55 candidate sources** across engine inputs, rule references, classical texts, glossaries, academic contextual works, case-study leads, and explicit reject buckets. Using a strict first-pass triage, **16 sources are suitable for engine-oriented work**, **26 are suitable as reference sources**, **18 require explicit copyright or license review before any product reuse**, and **5 should be rejected outright**. For this count, “needs copyright check” means `action_next = need_license_check`, not merely “license unknown.” citeturn16view3turn16view4turn18view0turn18view1turn18view2turn30search2

The strongest backbone for a serious Tứ Trụ module is not divination content first, but a layered stack of **calendar rules and validation sources**: the Hong Kong Observatory pages for solar terms, Can Chi tables, and official conversion tables; Y. T. Liu’s rule explanations for leap months, suì structure, and sexagenary logic; the DILA Time Authority open dataset for historical conversion data; and the official GB/T 33661-2017 Chinese calendar standard record. Together, these form the highest-confidence candidate pool for the future filtering phase. citeturn14view0turn14view1turn14view4turn13view2turn13view3turn13view4turn18view0turn18view1turn21search3

For classical and textual layers, the most useful candidate corpus is the combination of **CText text access**, **Wikimedia Commons public-domain scan candidates**, and **library catalog records** for modern annotated or translated editions. CText is excellent for discovery and topical indexing, but its site content remains copyrighted and only reasonable quotation is clearly permitted; Wikimedia Commons is useful for scan-based verification when a file is explicitly tagged free/public-domain; modern editions and translations remain copyrighted and should stay in the internal-reference lane unless separately licensed. citeturn13view5turn13view6turn13view7turn13view8turn16view2turn14view6turn14view8turn16view6turn10search0turn10search1turn10search6

For rule-heavy topics that are notoriously school-dependent in Bazi practice, especially **Thập Thần, Tàng Can, and Dụng thần / Hỷ thần / Kỵ thần**, the current evidence base is uneven. There are usable candidate sources for terminology mapping and contrastive review, but they are largely practitioner-facing, school-specific, or copyrighted modern teaching content. These should enter the project only as **review candidates**, never as automatic core truth. citeturn31search1turn31search6turn31search3turn31search5

## Source landscape

The candidate universe separates cleanly into five working layers.

The first layer is the **engine and validation layer**. This includes HKO’s solar-term and Gan-Zhi pages, the Gregorian–lunar conversion tables, Y. T. Liu’s calendar/rule pages, the DILA Time Authority dataset, and high-quality open-source implementations such as `stem-branch`, `sxtwl`, `Lunisolar`, and `ChineseCalendarGo`. HKO is authoritative for public reference, but reuse is rights-sensitive. Y. T. Liu is unusually clear on rules. DILA is openly licensed but introduces share-alike questions. Open-source libraries are useful for comparison and test harness design, but each library’s provenance and embedded tables must still be reviewed. citeturn14view0turn14view1turn14view4turn13view2turn13view3turn13view4turn18view0turn18view1turn18view2turn13view1turn20view0turn20view1turn20view2turn20view3

The second layer is the **classical text layer**. The most important titles surfaced exactly where expected: *Uyên Hải Tử Bình*, *Tam Mệnh Thông Hội*, *Tử Bình Chân Thuyên*, and *Trích Thiên Tủy / 滴天髓闡微*. CText is particularly valuable because its title pages and tables of contents expose topical coverage such as solar terms, month/day/hour derivation, đại vận, lưu niên, ngũ hành, hình–xung–hại, and格局-related chapters. That does not make CText a production data source; it makes it an excellent discovery and cross-reference source. citeturn13view5turn13view6turn13view7turn13view8

The third layer is the **scan and edition-verification layer**. Wikimedia Commons hosts several strong scan candidates with useful metadata and, in some cases, explicit public-domain statements. These are suitable for later OCR, source-line verification, and short quotations when rights are clear. WorldCat and related library records are better for acquisition planning than for content extraction. citeturn14view6turn14view7turn14view8turn10search0turn10search1turn10search6

The fourth layer is the **glossary layer**. For Hán–Việt and Vietnamese terms, Từ điển Hán Nôm is useful. For English equivalents, CC-CEDICT is the strongest open lexical base, while MDBG is convenient but should not be the scraping target because the site explicitly prohibits scripted access. This matters because the future glossary should be normalized from reusable lexical data, not copied from a website UI. citeturn28view0turn28view1turn30search2turn30search7

The fifth layer is the **case-study layer**. The best academic leads are not sensational charts of private individuals, but either fieldwork on consultation practice or example corpora already embedded in classical literature. Homola’s ethnographic work is useful as academic framing, and the IKGF project page is especially important because it notes that *滴天髓闡微* contains **512 examples**, which is exactly the kind of non-sensational, text-based case reservoir this project should prefer. citeturn34view4turn34view0

## File-ready deliverables

The six deliverables below are written in a file-ready style. To keep the report readable, the inventory is given as a **priority triage inventory plus full ID universe**, rather than dumping all 55 rows verbatim in long JSON form.

### source_inventory.json

This is the recommended schema and the **priority cut** that should seed the actual inventory file first. The remaining mapped IDs are listed immediately after it and should be expanded using the same schema. The priority cut emphasizes sources most likely to survive filtering. It is based on official observatory material, independent rule expositions, open datasets, standard records, classical text indexes, public-domain scan candidates, and academic context sources. citeturn14view0turn14view1turn14view4turn13view2turn13view3turn13view4turn18view0turn18view1turn21search3turn13view5turn13view6turn13view7turn13view8turn14view6turn14view8turn34view4

```json
{
  "schema": [
    "id",
    "title",
    "original_title",
    "author",
    "language",
    "source_type",
    "topic_tags",
    "url_or_location",
    "access_status",
    "license_status",
    "quality_score",
    "reliability_note",
    "usable_for",
    "copyright_note",
    "action_next"
  ],
  "priority_inventory": [
    {
      "id": "ENG-002",
      "title": "Date and Time of the 24 Solar Terms",
      "original_title": null,
      "author": "Hong Kong Observatory",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["solar_terms", "timing", "validation"],
      "url_or_location": "https://www.hko.gov.hk/en/gts/astronomy/Solar_Term.htm",
      "access_status": "public",
      "license_status": "needs_review",
      "quality_score": 5,
      "reliability_note": "Official timing reference for 24 solar terms.",
      "usable_for": "reference",
      "copyright_note": "Use for validation unless commercial reuse is cleared.",
      "action_next": "need_license_check"
    },
    {
      "id": "ENG-003",
      "title": "Heavenly Stems and Earthly Branches",
      "original_title": "天干地支",
      "author": "Hong Kong Observatory",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["ganzhi", "hour_stem_table"],
      "url_or_location": "https://www.hko.gov.hk/en/gts/time/stemsandbranches.htm",
      "access_status": "public",
      "license_status": "needs_review",
      "quality_score": 5,
      "reliability_note": "Official stem/branch and day-stem-to-hour-stem reference.",
      "usable_for": "reference",
      "copyright_note": "Do not bulk-copy tables without rights review.",
      "action_next": "need_license_check"
    },
    {
      "id": "ENG-004",
      "title": "Gregorian-Lunar Calendar Conversion Table",
      "original_title": null,
      "author": "Hong Kong Observatory",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["calendar_conversion", "validation"],
      "url_or_location": "https://www.hko.gov.hk/en/gts/time/conversion.htm",
      "access_status": "public",
      "license_status": "needs_review",
      "quality_score": 5,
      "reliability_note": "Official conversion oracle for 1901–2100.",
      "usable_for": "reference",
      "copyright_note": "Validation source, not unrestricted redistribution source.",
      "action_next": "need_license_check"
    },
    {
      "id": "ENG-006",
      "title": "Rules for the Chinese Calendar",
      "original_title": null,
      "author": "Y. T. Liu",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["new_moon", "winter_solstice", "leap_month"],
      "url_or_location": "https://ytliu0.github.io/ChineseCalendar/rules.html",
      "access_status": "public",
      "license_status": "unknown",
      "quality_score": 5,
      "reliability_note": "Best plain-language rule statement for Chinese calendar mechanics.",
      "usable_for": "engine",
      "copyright_note": "Use rules, not page text, in product.",
      "action_next": "keep"
    },
    {
      "id": "ENG-007",
      "title": "Sexagenary Cycle",
      "original_title": "六十干支",
      "author": "Y. T. Liu",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["ganzhi", "sexagenary", "day_pillar"],
      "url_or_location": "https://ytliu0.github.io/ChineseCalendar/sexagenary.html",
      "access_status": "public",
      "license_status": "unknown",
      "quality_score": 5,
      "reliability_note": "Strong explanation of the sexagenary system for date logic.",
      "usable_for": "engine",
      "copyright_note": "Use as rule reference only.",
      "action_next": "keep"
    },
    {
      "id": "ENG-008",
      "title": "24 Solar Terms",
      "original_title": "二十四節氣",
      "author": "Y. T. Liu",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["solar_terms", "astronomy"],
      "url_or_location": "https://ytliu0.github.io/ChineseCalendar/solarTerms.html",
      "access_status": "public",
      "license_status": "unknown",
      "quality_score": 5,
      "reliability_note": "Astronomical explanation of solar terms.",
      "usable_for": "engine",
      "copyright_note": "Rule reference only.",
      "action_next": "keep"
    },
    {
      "id": "ENG-010",
      "title": "The Equation of Time",
      "original_title": null,
      "author": "U.S. Naval Observatory",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["solar_time", "equation_of_time"],
      "url_or_location": "https://aa.usno.navy.mil/faq/eqtime",
      "access_status": "public",
      "license_status": "unknown",
      "quality_score": 5,
      "reliability_note": "Authoritative support source for true/apparent solar time review.",
      "usable_for": "engine",
      "copyright_note": "Technical reference only.",
      "action_next": "keep"
    },
    {
      "id": "ENG-012",
      "title": "Open Content Project | Introduction",
      "original_title": "DDBC Time Authority Database",
      "author": "DILA",
      "language": "en",
      "source_type": "dataset",
      "topic_tags": ["dataset", "calendar_conversion", "historical_calendar"],
      "url_or_location": "https://authority.dila.edu.tw/docs/open_content/",
      "access_status": "public",
      "license_status": "open",
      "quality_score": 5,
      "reliability_note": "Open academic calendar dataset description.",
      "usable_for": "engine",
      "copyright_note": "CC BY-SA; review downstream obligations.",
      "action_next": "need_license_check"
    },
    {
      "id": "ENG-013",
      "title": "Open Content Project | Downloads",
      "original_title": "DILA Time Authority Database Downloads",
      "author": "DILA",
      "language": "en",
      "source_type": "dataset",
      "topic_tags": ["dataset", "220_BCE_to_1912_CE"],
      "url_or_location": "https://authority.dila.edu.tw/docs/open_content/download.php",
      "access_status": "public",
      "license_status": "open",
      "quality_score": 5,
      "reliability_note": "Download source for Chinese-only historical calendar data.",
      "usable_for": "engine",
      "copyright_note": "CC BY-SA; review compatibility.",
      "action_next": "need_license_check"
    },
    {
      "id": "ENG-014",
      "title": "Buddhist Studies Authority Databases",
      "original_title": "DILA-edu/Authority-Databases",
      "author": "DILA",
      "language": "en",
      "source_type": "dataset",
      "topic_tags": ["github", "time_authority"],
      "url_or_location": "https://github.com/DILA-edu/Authority-Databases",
      "access_status": "public",
      "license_status": "open",
      "quality_score": 5,
      "reliability_note": "Repository mirror with explicit license statement.",
      "usable_for": "engine",
      "copyright_note": "CC BY-SA 3.0; review before reuse.",
      "action_next": "need_license_check"
    },
    {
      "id": "ENG-015",
      "title": "GB/T 33661-2017 Calculation and promulgation of the Chinese calendar",
      "original_title": "农历的编算和颁行",
      "author": "SAMR / SAC",
      "language": "zh",
      "source_type": "engine",
      "topic_tags": ["national_standard", "calendar_rules"],
      "url_or_location": "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=E107EA4DE9725EDF819F33C60A44B296",
      "access_status": "public",
      "license_status": "copyrighted",
      "quality_score": 5,
      "reliability_note": "Official standard record for modern Chinese calendar rules.",
      "usable_for": "reference",
      "copyright_note": "Standard text is copyrighted; use as normative reference.",
      "action_next": "need_license_check"
    },
    {
      "id": "ENG-017",
      "title": "stem-branch",
      "original_title": null,
      "author": "h4x0r",
      "language": "en",
      "source_type": "engine",
      "topic_tags": ["open_source", "calendar_engine", "bazi"],
      "url_or_location": "https://github.com/h4x0r/stem-branch",
      "access_status": "public",
      "license_status": "open",
      "quality_score": 4,
      "reliability_note": "Apache-2.0 astronomical engine with explicit accuracy claims.",
      "usable_for": "engine",
      "copyright_note": "Verify embedded lookup content before reuse.",
      "action_next": "review"
    },
    {
      "id": "BOOK-001",
      "title": "San ming tong hui",
      "original_title": "三命通會",
      "author": "萬民英",
      "language": "zh",
      "source_type": "book",
      "topic_tags": ["classic", "bazi", "da_yun", "liu_nian"],
      "url_or_location": "https://ctext.org/wiki.pl?if=gb&res=532360",
      "access_status": "public",
      "license_status": "needs_review",
      "quality_score": 5,
      "reliability_note": "Core classical text with TOC exposing relevant rule domains.",
      "usable_for": "reference",
      "copyright_note": "CText quotation limits apply.",
      "action_next": "need_license_check"
    },
    {
      "id": "BOOK-002",
      "title": "Yuan hai zi ping",
      "original_title": "淵海子平",
      "author": "徐子平",
      "language": "zh",
      "source_type": "book",
      "topic_tags": ["classic", "ziping"],
      "url_or_location": "https://ctext.org/wiki.pl?if=gb&res=727782",
      "access_status": "public",
      "license_status": "needs_review",
      "quality_score": 5,
      "reliability_note": "Canonical Ziping title.",
      "usable_for": "reference",
      "copyright_note": "CText redistribution limits apply.",
      "action_next": "need_license_check"
    },
    {
      "id": "BOOK-003",
      "title": "Ziping zhenquan pingzhu",
      "original_title": "子平真詮評注",
      "author": "沈孝瞻",
      "language": "zh",
      "source_type": "book",
      "topic_tags": ["classic", "yong_shen", "geju"],
      "url_or_location": "https://ctext.org/wiki.pl?chapter=974137&if=gb&remap=gb",
      "access_status": "public",
      "license_status": "needs_review",
      "quality_score": 5,
      "reliability_note": "Important classical/commentarial source for 用神 and 格局 topics.",
      "usable_for": "reference",
      "copyright_note": "Use as reference, not bulk import.",
      "action_next": "need_license_check"
    },
    {
      "id": "BOOK-004",
      "title": "Di tian sui chanwei",
      "original_title": "滴天髓闡微",
      "author": "任鐵樵",
      "language": "zh",
      "source_type": "book",
      "topic_tags": ["classic", "structures", "examples"],
      "url_or_location": "https://ctext.org/wiki.pl?if=gb&res=221357",
      "access_status": "public",
      "license_status": "needs_review",
      "quality_score": 5,
      "reliability_note": "Core classical/commentarial source with strong case-study potential.",
      "usable_for": "reference",
      "copyright_note": "CText redistribution limits apply.",
      "action_next": "need_license_check"
    },
    {
      "id": "BOOK-005",
      "title": "淵海子平子平真詮 v.1",
      "original_title": "NTL-9900014379 淵海子平子平真詮 v.1",
      "author": "Scan metadata on Wikimedia Commons",
      "language": "zh",
      "source_type": "scan",
      "topic_tags": ["scan", "public_domain_candidate"],
      "url_or_location": "https://commons.wikimedia.org/wiki/File:NTL-9900014379_%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3%E5%AD%90%E5%B9%B3%E7%9C%9F%E8%A9%AE_v.1.pdf",
      "access_status": "public",
      "license_status": "open",
      "quality_score": 5,
      "reliability_note": "Strong scan-verification candidate with favorable licensing signal.",
      "usable_for": "quote",
      "copyright_note": "Record exact edition and scan provenance.",
      "action_next": "need_ocr"
    },
    {
      "id": "BOOK-007",
      "title": "滴天髓輯要",
      "original_title": "NLC416-01jh000040-9444 滴天髓輯要.pdf",
      "author": "Scan metadata on Wikimedia Commons",
      "language": "zh",
      "source_type": "scan",
      "topic_tags": ["scan", "public_domain_candidate", "di_tian_sui"],
      "url_or_location": "https://commons.wikimedia.org/wiki/File:NLC416-01jh000040-9444_%E6%BB%B4%E5%A4%A9%E9%AB%93%E8%BC%AF%E8%A6%81.pdf",
      "access_status": "public",
      "license_status": "open",
      "quality_score": 5,
      "reliability_note": "Explicit PD-scan reasoning shown on Commons page.",
      "usable_for": "quote",
      "copyright_note": "Still pin edition in project metadata.",
      "action_next": "need_ocr"
    },
    {
      "id": "RUL-002",
      "title": "Tra từ: địa chi",
      "original_title": "地支 địa chi",
      "author": "Từ điển Hán Nôm",
      "language": "vi",
      "source_type": "glossary",
      "topic_tags": ["han_viet", "earthly_branches"],
      "url_or_location": "https://hvdic.thivien.net/hv/%C4%91%E1%BB%8Ba%20chi",
      "access_status": "public",
      "license_status": "unknown",
      "quality_score": 4,
      "reliability_note": "Useful Hán–Việt glossary seed for standard term form.",
      "usable_for": "glossary",
      "copyright_note": "Terms visible, but open reuse license not found.",
      "action_next": "review"
    },
    {
      "id": "RUL-005",
      "title": "CC-CEDICT Wiki",
      "original_title": null,
      "author": "CC-CEDICT community",
      "language": "en",
      "source_type": "glossary",
      "topic_tags": ["dictionary", "open_data", "english_equivalents"],
      "url_or_location": "https://cc-cedict.org/wiki/",
      "access_status": "public",
      "license_status": "open",
      "quality_score": 5,
      "reliability_note": "Best open glossary base for English mappings.",
      "usable_for": "glossary",
      "copyright_note": "CC BY-SA 3.0; review share-alike obligations.",
      "action_next": "need_license_check"
    },
    {
      "id": "CASE-001",
      "title": "The Art of Fate Calculation",
      "original_title": "Practicing Divination in Taipei, Beijing, and Kaifeng",
      "author": "Stéphanie Homola",
      "language": "en",
      "source_type": "case",
      "topic_tags": ["ethnography", "consultation_cases", "academic"],
      "url_or_location": "https://www.berghahnbooks.com/downloads/intros/HomolaArt_intro.pdf",
      "access_status": "public",
      "license_status": "copyrighted",
      "quality_score": 4,
      "reliability_note": "Academic framing source for case-study practice and literature mapping.",
      "usable_for": "reference",
      "copyright_note": "Preview only; copyrighted book.",
      "action_next": "keep"
    },
    {
      "id": "CASE-002",
      "title": "Critical Edition and Translation of The Leaking Essence of Heaven",
      "original_title": "滴天髓 project",
      "author": "IKGF / Manfred Kubny",
      "language": "en",
      "source_type": "case",
      "topic_tags": ["example_corpus", "di_tian_sui"],
      "url_or_location": "https://www.ikgf.fau.de/research/research-projects/techniques-and-practices/critical-edition-and-translation-of-the-the-leaking-essence-of-heaven.shtml",
      "access_status": "public",
      "license_status": "copyrighted",
      "quality_score": 4,
      "reliability_note": "Important evidence that 滴天髓闡微 contains 512 examples.",
      "usable_for": "reference",
      "copyright_note": "Project page citable; outputs need rights review.",
      "action_next": "keep"
    }
  ],
  "full_id_universe": {
    "engine": ["ENG-001","ENG-002","ENG-003","ENG-004","ENG-005","ENG-006","ENG-007","ENG-008","ENG-009","ENG-010","ENG-011","ENG-012","ENG-013","ENG-014","ENG-015","ENG-016","ENG-017","ENG-018","ENG-019","ENG-020","ENG-021","ENG-022"],
    "rule_glossary": ["RUL-001","RUL-002","RUL-003","RUL-004","RUL-005","RUL-006","RUL-007","RUL-008","RUL-009","RUL-010"],
    "books_scans": ["BOOK-001","BOOK-002","BOOK-003","BOOK-004","BOOK-005","BOOK-006","BOOK-007","BOOK-008","BOOK-009","BOOK-010","BOOK-011","BOOK-012","BOOK-013","BOOK-014"],
    "case_study": ["CASE-001","CASE-002","CASE-003","CASE-004"],
    "rejected": ["REJ-001","REJ-002","REJ-003","REJ-004","REJ-005"]
  }
}
```

### topic_map.md

The topic map below is the recommended starting point for `topic_map.md`. It distinguishes **strong**, **weak**, and **verify** buckets, which is more useful than pretending there is already a settled canon. The split follows the actual source-quality pattern discovered in this pass. citeturn13view3turn13view4turn13view5turn13view7turn34view0turn34view4turn31search1turn31search6turn31search3

```md
# Topic Map

## Lịch pháp

Related:
ENG-001 ENG-002 ENG-004 ENG-005 ENG-006 ENG-008 ENG-012 ENG-013 ENG-014 ENG-015 ENG-018 ENG-019 ENG-020 ENG-022

Strong:
ENG-002 ENG-004 ENG-006 ENG-012 ENG-013 ENG-015

Weak:
ENG-018 ENG-019 ENG-020 ENG-022

Needs verification:
ENG-016 ENG-021

## Can Chi

Related:
ENG-003 ENG-007 ENG-009 RUL-001 RUL-002 RUL-004 RUL-005 ENG-022

Strong:
ENG-003 ENG-007 RUL-005

Weak:
RUL-004 RUL-002 ENG-022

Needs verification:
RUL-001

## Tứ Trụ

Related:
ENG-003 ENG-017 ENG-020 ENG-021 BOOK-001 BOOK-002 BOOK-003 BOOK-004 CASE-001 CASE-003 CASE-004

Strong:
BOOK-001 BOOK-002 BOOK-003 BOOK-004

Weak:
ENG-020 ENG-021 CASE-003 CASE-004

Needs verification:
ENG-017

## Ngũ hành

Related:
BOOK-001 BOOK-003 BOOK-004 RUL-007 RUL-009 BOOK-012

Strong:
BOOK-001 BOOK-003 BOOK-004

Weak:
RUL-007 RUL-009

Needs verification:
BOOK-012

## Thập thần

Related:
BOOK-002 BOOK-003 ENG-020 RUL-007 RUL-009 CASE-003

Strong:
BOOK-003

Weak:
RUL-007 RUL-009 CASE-003

Needs verification:
ENG-020

## Tàng can

Related:
BOOK-003 RUL-006 RUL-008 ENG-003

Strong:
BOOK-003 ENG-003

Weak:
RUL-006 RUL-008

Needs verification:
ENG-020 ENG-021

## Hợp xung hình hại phá

Related:
BOOK-001 BOOK-003 ENG-003 RUL-007

Strong:
BOOK-001 BOOK-003 ENG-003

Weak:
RUL-007

Needs verification:
ENG-020

## Vượng suy

Related:
BOOK-001 BOOK-003 BOOK-004 RUL-008

Strong:
BOOK-001 BOOK-003 BOOK-004

Weak:
RUL-008

Needs verification:
CASE-003

## Đại vận

Related:
BOOK-001 ENG-003 ENG-020 ENG-021 CASE-001

Strong:
BOOK-001

Weak:
ENG-020 ENG-021

Needs verification:
CASE-001

## Lưu niên

Related:
BOOK-001 ENG-003 ENG-020 RUL-007 CASE-001

Strong:
BOOK-001 ENG-003

Weak:
ENG-020 RUL-007

Needs verification:
CASE-001

## Dẫn nguồn / sách

Related:
BOOK-001 BOOK-002 BOOK-003 BOOK-004 BOOK-005 BOOK-006 BOOK-007 BOOK-008 BOOK-009 BOOK-010 BOOK-011 BOOK-012 BOOK-013 BOOK-014

Strong:
BOOK-001 BOOK-002 BOOK-003 BOOK-004 BOOK-005 BOOK-007

Weak:
BOOK-009 BOOK-010 BOOK-011 BOOK-012 BOOK-013 BOOK-014

Needs verification:
BOOK-006 BOOK-008
```

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

### glossary_seed.json

This seed is deliberately short, neutral, and non-interpretive. Definitions are phrased as **research-safe glossary notes**, not user-facing fortune language. The chosen term set comes directly from the strongest calendar, Gan-Zhi, classical-title, and glossary sources identified above. citeturn14view1turn13view4turn28view0turn28view1turn30search2turn13view7

```json
[
  {
    "id": "gls_thien_can",
    "term_vi": "Thiên Can",
    "term_han": "天干",
    "term_en": "Heavenly Stems",
    "short_definition": "The ten stem symbols used in the sexagenary cycle.",
    "related_terms": ["Địa Chi", "Can Chi", "Tứ Trụ"],
    "source_candidates": ["ENG-003", "ENG-007", "RUL-004", "RUL-005"],
    "confidence": "high"
  },
  {
    "id": "gls_dia_chi",
    "term_vi": "Địa Chi",
    "term_han": "地支",
    "term_en": "Earthly Branches",
    "short_definition": "The twelve branch symbols paired with Heavenly Stems in the sexagenary cycle.",
    "related_terms": ["Thiên Can", "Can Chi", "Tàng Can"],
    "source_candidates": ["ENG-003", "ENG-007", "RUL-002", "RUL-005"],
    "confidence": "high"
  },
  {
    "id": "gls_can_chi",
    "term_vi": "Can Chi",
    "term_han": "干支",
    "term_en": "Stem-Branch; Sexagenary Cycle",
    "short_definition": "The paired stem-branch cycle of sixty combinations used for year, month, day, and time notation.",
    "related_terms": ["Thiên Can", "Địa Chi", "Lục thập hoa giáp"],
    "source_candidates": ["ENG-003", "ENG-007", "RUL-004"],
    "confidence": "high"
  },
  {
    "id": "gls_tiet_khi",
    "term_vi": "Tiết khí",
    "term_han": "節氣",
    "term_en": "Solar Terms",
    "short_definition": "The twenty-four annual solar markers used in Chinese calendrical segmentation.",
    "related_terms": ["Lịch pháp", "Trụ tháng", "Lập Xuân"],
    "source_candidates": ["ENG-001", "ENG-002", "ENG-008"],
    "confidence": "high"
  },
  {
    "id": "gls_tu_tru",
    "term_vi": "Tứ Trụ",
    "term_han": "四柱",
    "term_en": "Four Pillars",
    "short_definition": "A chart model using year, month, day, and hour pillars, each expressed as a stem-branch pair.",
    "related_terms": ["Bát tự", "Trụ năm", "Trụ tháng", "Trụ ngày", "Trụ giờ"],
    "source_candidates": ["ENG-021", "BOOK-001", "BOOK-002", "CASE-003"],
    "confidence": "medium"
  },
  {
    "id": "gls_bat_tu",
    "term_vi": "Bát tự",
    "term_han": "八字",
    "term_en": "Eight Characters; BaZi",
    "short_definition": "The eight characters formed by the four pillars in a stem-branch chart.",
    "related_terms": ["Tứ Trụ", "Can Chi"],
    "source_candidates": ["CASE-003", "CASE-004", "BOOK-001"],
    "confidence": "medium"
  },
  {
    "id": "gls_ngu_hanh",
    "term_vi": "Ngũ hành",
    "term_han": "五行",
    "term_en": "Five Phases",
    "short_definition": "The five-phase framework commonly rendered in English as Wood, Fire, Earth, Metal, and Water.",
    "related_terms": ["Âm dương", "Vượng suy", "Thập thần"],
    "source_candidates": ["BOOK-001", "BOOK-003", "BOOK-012"],
    "confidence": "high"
  },
  {
    "id": "gls_am_duong",
    "term_vi": "Âm dương",
    "term_han": "陰陽",
    "term_en": "Yin-Yang",
    "short_definition": "The binary polarity framework used across stems, branches, and five-phase relationships.",
    "related_terms": ["Ngũ hành", "Thiên Can", "Địa Chi"],
    "source_candidates": ["BOOK-003", "RUL-005"],
    "confidence": "high"
  },
  {
    "id": "gls_nhat_chu",
    "term_vi": "Nhật chủ",
    "term_han": "日主",
    "term_en": "Day Master",
    "short_definition": "A label used in many Bazi schools for the day stem as the chart’s reference stem.",
    "related_terms": ["Trụ ngày", "Thập thần"],
    "source_candidates": ["RUL-010", "CASE-004", "BOOK-003"],
    "confidence": "medium"
  },
  {
    "id": "gls_thap_than",
    "term_vi": "Thập thần",
    "term_han": "十神",
    "term_en": "Ten Gods",
    "short_definition": "A relationship classification system derived from the interaction between the reference day stem and other stems.",
    "related_terms": ["Nhật chủ", "Ngũ hành", "Tàng Can"],
    "source_candidates": ["RUL-007", "RUL-009", "BOOK-003"],
    "confidence": "medium"
  },
  {
    "id": "gls_tang_can",
    "term_vi": "Tàng can",
    "term_han": "藏干",
    "term_en": "Hidden Stems",
    "short_definition": "Stems traditionally assigned within each Earthly Branch in many Bazi lineages.",
    "related_terms": ["Địa Chi", "Thập thần"],
    "source_candidates": ["RUL-006", "RUL-008", "BOOK-003"],
    "confidence": "medium"
  },
  {
    "id": "gls_hop",
    "term_vi": "Hợp",
    "term_han": "合",
    "term_en": "Combination",
    "short_definition": "A relationship label used for certain stem or branch pairings in classical rule systems.",
    "related_terms": ["Xung", "Hình", "Hại", "Phá"],
    "source_candidates": ["BOOK-001", "BOOK-003"],
    "confidence": "medium"
  },
  {
    "id": "gls_xung",
    "term_vi": "Xung",
    "term_han": "沖",
    "term_en": "Clash",
    "short_definition": "A relationship label used for opposing stem/branch interactions in classical rule systems.",
    "related_terms": ["Hợp", "Hình", "Hại", "Phá"],
    "source_candidates": ["BOOK-001", "BOOK-003"],
    "confidence": "medium"
  },
  {
    "id": "gls_hinh",
    "term_vi": "Hình",
    "term_han": "刑",
    "term_en": "Punishment",
    "short_definition": "A classical interaction label applied to specific branch configurations.",
    "related_terms": ["Hợp", "Xung", "Hại"],
    "source_candidates": ["BOOK-001", "BOOK-003"],
    "confidence": "medium"
  },
  {
    "id": "gls_hai",
    "term_vi": "Hại",
    "term_han": "害",
    "term_en": "Harm",
    "short_definition": "A classical interaction label for certain branch relationships.",
    "related_terms": ["Hợp", "Xung", "Hình", "Phá"],
    "source_candidates": ["BOOK-001"],
    "confidence": "medium"
  },
  {
    "id": "gls_pha",
    "term_vi": "Phá",
    "term_han": "破",
    "term_en": "Break; Destruction",
    "short_definition": "A relationship label used in some branch interaction schemes.",
    "related_terms": ["Hợp", "Xung", "Hại"],
    "source_candidates": ["BOOK-003", "RUL-007"],
    "confidence": "low"
  },
  {
    "id": "gls_truong_sinh",
    "term_vi": "Trường sinh mười hai cung",
    "term_han": "十二長生",
    "term_en": "Twelve Stages of Growth",
    "short_definition": "A twelve-stage vitality sequence used in some classical and later Bazi analyses.",
    "related_terms": ["Vượng suy", "Ngũ hành"],
    "source_candidates": ["BOOK-001", "BOOK-004"],
    "confidence": "medium"
  },
  {
    "id": "gls_vuong_suy",
    "term_vi": "Vượng suy",
    "term_han": "旺衰",
    "term_en": "Prosperity and decline; strength state",
    "short_definition": "A chart-strength vocabulary for judging relative seasonal/structural support.",
    "related_terms": ["Ngũ hành", "Trường sinh mười hai cung"],
    "source_candidates": ["BOOK-001", "BOOK-003", "BOOK-004"],
    "confidence": "medium"
  },
  {
    "id": "gls_dai_van",
    "term_vi": "Đại vận",
    "term_han": "大運",
    "term_en": "Major Luck Cycle; Ten-Year Luck Pillar",
    "short_definition": "A long-cycle pillar sequence used in many Bazi systems for temporal layering.",
    "related_terms": ["Lưu niên", "Tứ Trụ"],
    "source_candidates": ["BOOK-001", "ENG-003", "ENG-020"],
    "confidence": "medium"
  },
  {
    "id": "gls_luu_nien",
    "term_vi": "Lưu niên",
    "term_han": "流年",
    "term_en": "Annual Influence; Annual Cycle",
    "short_definition": "The year-by-year temporal layer commonly compared against a natal chart.",
    "related_terms": ["Đại vận", "Can Chi năm"],
    "source_candidates": ["BOOK-001", "ENG-003", "ENG-020"],
    "confidence": "medium"
  },
  {
    "id": "gls_dung_than",
    "term_vi": "Dụng thần",
    "term_han": "用神",
    "term_en": "Useful God; Functional Reference",
    "short_definition": "A school-dependent selecting concept used to identify a chart’s key balancing or functional factor.",
    "related_terms": ["Hỷ thần", "Kỵ thần", "Vượng suy"],
    "source_candidates": ["BOOK-003", "RUL-008"],
    "confidence": "low"
  }
]
```

### rules_candidate.json

These are **candidate rules only**. They are intentionally phrased as extractable research statements, not approved engine logic. Where a rule is purely calendrical and supported by high-confidence sources, the confidence is higher. Where school variation is obvious, the status stays conservative. citeturn13view3turn13view4turn14view1turn34view0turn31search1turn31search3

```json
[
  {
    "id": "rule_calendar_new_moon_month_start",
    "topic": "Lịch pháp",
    "rule_name": "Chinese lunar month starts on the day containing the astronomical conjunction",
    "condition": "When computing month boundaries in the modern Chinese calendar",
    "meaning_short": "Use new moon/conjunction as month start",
    "source_candidates": ["ENG-006", "ENG-015"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_calendar_month11_winter_solstice",
    "topic": "Lịch pháp",
    "rule_name": "Month 11 contains winter solstice",
    "condition": "When numbering months within a suì",
    "meaning_short": "Winter-solstice month is month 11",
    "source_candidates": ["ENG-006", "ENG-015"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_calendar_leap_month_no_major_term",
    "topic": "Lịch pháp",
    "rule_name": "Leap month is the first month without a major solar term",
    "condition": "If a suì contains 13 lunar months",
    "meaning_short": "First month lacking a major term becomes leap month",
    "source_candidates": ["ENG-006", "ENG-015"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_calendar_new_year_second_regular_month",
    "topic": "Lịch pháp",
    "rule_name": "Chinese New Year is the first day of the second regular month after month 11",
    "condition": "Modern Chinese calendar year computation",
    "meaning_short": "Year starts at second regular month after month 11",
    "source_candidates": ["ENG-006", "ENG-015"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_ganzhi_parity_pairing",
    "topic": "Can Chi",
    "rule_name": "Valid stem-branch pairings preserve parity",
    "condition": "When constructing 60 combinations",
    "meaning_short": "Only same-parity stem/branch pairings occur",
    "source_candidates": ["ENG-003", "ENG-007", "ENG-022"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_hour_branch_double_hour",
    "topic": "Tứ Trụ",
    "rule_name": "Hour branch follows the twelve double-hour system",
    "condition": "When assigning hour branch from local birth time",
    "meaning_short": "Map civil/solar time into 12 branch-based two-hour blocks",
    "source_candidates": ["ENG-003"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_hour_stem_from_day_stem",
    "topic": "Tứ Trụ",
    "rule_name": "Hour stem derives from day stem plus hour branch table",
    "condition": "After day stem and hour branch are known",
    "meaning_short": "Use canonical lookup table to derive hour stem",
    "source_candidates": ["ENG-003"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_day_pillar_from_continuous_day_cycle",
    "topic": "Tứ Trụ",
    "rule_name": "Day pillar follows the continuous sexagenary day cycle",
    "condition": "Given a fixed day-count system and timezone convention",
    "meaning_short": "Compute day pillar from continuous day indexing",
    "source_candidates": ["ENG-007", "ENG-009"],
    "confidence": "high",
    "status": "candidate"
  },
  {
    "id": "rule_year_pillar_boundary_lichun",
    "topic": "Tứ Trụ",
    "rule_name": "Many Bazi engines use Lập Xuân rather than lunar new year for year pillar boundary",
    "condition": "When assigning the natal year pillar in Bazi-specific logic",
    "meaning_short": "Year-pillar boundary may be solar-term-based, not festival-based",
    "source_candidates": ["ENG-001", "ENG-021", "CASE-003"],
    "confidence": "low",
    "status": "needs_review"
  },
  {
    "id": "rule_month_pillar_by_solar_terms",
    "topic": "Tứ Trụ",
    "rule_name": "Month pillar in many Bazi systems follows solar-term segmentation",
    "condition": "When assigning natal month pillar",
    "meaning_short": "Month pillar may be tied to term boundaries rather than lunar month name",
    "source_candidates": ["ENG-001", "ENG-021", "CASE-004"],
    "confidence": "medium",
    "status": "needs_review"
  },
  {
    "id": "rule_hidden_stems_branch_table",
    "topic": "Tàng can",
    "rule_name": "Each Earthly Branch carries a conventional hidden-stem table",
    "condition": "When expanding branch content in a chart",
    "meaning_short": "Assign embedded stems per branch using canonical table",
    "source_candidates": ["BOOK-003", "RUL-006", "RUL-008"],
    "confidence": "medium",
    "status": "needs_review"
  },
  {
    "id": "rule_ten_gods_from_day_master_relation",
    "topic": "Thập thần",
    "rule_name": "Ten Gods classification is based on relation to the day stem",
    "condition": "After day stem and comparison stem are known",
    "meaning_short": "Classify by five-phase relation plus polarity",
    "source_candidates": ["BOOK-003", "RUL-007", "RUL-009"],
    "confidence": "medium",
    "status": "needs_review"
  },
  {
    "id": "rule_branch_interaction_sets",
    "topic": "Hợp xung hình hại phá",
    "rule_name": "Branch interaction labels exist as combination, clash, punishment, harm, and break sets",
    "condition": "When scanning chart relationships",
    "meaning_short": "Interaction tables are available but activation logic varies",
    "source_candidates": ["BOOK-001", "BOOK-003"],
    "confidence": "medium",
    "status": "needs_review"
  },
  {
    "id": "rule_twelve_growth_stages",
    "topic": "Vượng suy",
    "rule_name": "Twelve growth stages are used as a vitality sequence in some lineages",
    "condition": "When evaluating support/decline states",
    "meaning_short": "Use twelve-stage sequence only after lineage/source adjudication",
    "source_candidates": ["BOOK-001", "BOOK-004"],
    "confidence": "medium",
    "status": "needs_review"
  },
  {
    "id": "rule_dayun_direction_school_variation",
    "topic": "Đại vận",
    "rule_name": "Direction of major luck cycles varies by school formula",
    "condition": "When determining forward or backward cycle flow",
    "meaning_short": "Do not hard-code until the chosen lineage is fixed",
    "source_candidates": ["BOOK-001", "CASE-001", "CASE-003"],
    "confidence": "low",
    "status": "needs_review"
  },
  {
    "id": "rule_dayun_start_age_interval_method",
    "topic": "Đại vận",
    "rule_name": "Start age of major luck cycles may be computed from interval to nearby solar-term boundary",
    "condition": "When deriving first cycle start age",
    "meaning_short": "Method appears in practice but needs lineage-specific adjudication",
    "source_candidates": ["BOOK-001", "CASE-001", "ENG-001"],
    "confidence": "low",
    "status": "needs_review"
  },
  {
    "id": "rule_yongshen_school_specific",
    "topic": "Dụng thần",
    "rule_name": "Useful-god selection is school-specific and should not be auto-promoted to core",
    "condition": "Whenever source material presents a preferred useful element/factor",
    "meaning_short": "Keep as comparative doctrine until conflict review is complete",
    "source_candidates": ["BOOK-003", "RUL-008"],
    "confidence": "low",
    "status": "needs_review"
  }
]
```

## Licensing posture and exclusion logic

The legal picture is not binary. There is a genuinely useful **open** layer, but it is smaller than many teams assume. DILA’s Time Authority materials are open but share-alike licensed. CC-CEDICT is also openly reusable under share-alike. Wikimedia Commons free-content scans are promising, but only exact file provenance and edition freeze will keep reuse clean. HKO pages are public and authoritative, yet their reuse terms distinguish non-commercial versus commercial conditions, so they should not be treated as “copy freely into the product.” citeturn18view0turn18view1turn18view2turn30search2turn14view8turn16view3turn16view4

The biggest risk is not only copyright; it is **false confidence from convenient but weak sources**. Practitioner pages are useful for terminology discovery and conflict spotting, but they are not a safe basis for engine truth. Pirated uploads and commercial calculators should be removed from the pipeline entirely, both for legal reasons and because they usually do not expose methodology well enough for source-critical use. citeturn31search1turn31search6turn31search3turn31search5turn8search2turn24search0turn12search10turn31search0turn31search8

## Conversion path from raw sources to a real Knowledge Base

The next step should be a **two-track normalization pass**.

Track one is the **calendar/engine track**. Freeze a core validation pack from HKO, Y. T. Liu, DILA, and the GB/T standard record. Build a rule matrix that records, for every engine-relevant question, the primary normative source, secondary validation source, covered date range, timezone convention, and any known ambiguity. That matrix should include at least: new moon month start, month-11/winter-solstice rule, leap-month rule, sexagenary day index, hour-branch bins, hour-stem lookup, and any true-solar-time adjustments. citeturn13view3turn13view4turn14view1turn14view4turn18view1turn21search3

Track two is the **textual/reference track**. For each classical work, pin at least one bibliographic record, one text-access record, and one scan candidate if available. Do **not** move directly from “book title discovered” to “rules extracted.” Instead, create a conflict log keyed by topic: hidden stems, Ten Gods naming, combination/clash sets, twelve growth stages, vượng-suy logic, cấu trúc/cách cục, and dụng thần doctrines. Only rules that survive cross-source comparison should move into the future `approved_core` lane. citeturn13view5turn13view7turn13view8turn34view0turn34view4

A practical sequence for converting this raw map into a production-grade KB is:

- **freeze IDs and metadata first**  
  Give every kept source a permanent internal ID, source snapshot date, and rights flag.

- **normalize terminology next**  
  Build the multilingual glossary before extracting higher-level rules, because inconsistent term naming will corrupt downstream comparison.

- **extract only non-interpretive rules first**  
  Calendar mechanics, pillar derivation mechanics, lookup tables, and stable relationship tables.

- **separate doctrine from mechanics**  
  Anything that reflects school preference or interpretive ranking stays in `candidate` or `needs_review`.

- **introduce a rights gate before quotation**  
  No scan OCR, no excerpt bank, and no long textual reuse should move forward until the rights lane is explicitly greenlit.

That sequence is consistent with the project’s own principle: **calculation first, books after, web as display, AI only on audited data**. citeturn13view3turn18view0turn16view2

## Open questions and limitations

The most important unresolved issue is **lineage selection** for Bazi-specific doctrine. The research pass clearly found strong calendar sources, but it did **not** find a single uncontested, openly licensed, source-critical package for later interpretive layers such as dụng thần, hỷ thần, kỵ thần, chart strength, or đại vận start method. Those remain candidate domains that need explicit adjudication. citeturn31search3turn31search6turn31search5turn34view4

A second limitation is that several strong classical scan candidates still need **OCR and edition control**. Public-domain or free-content status at the host level is helpful, but not enough by itself. The downstream project still needs one chosen base edition per text, plus a way to reconcile scan, OCR text, and reference transcription. citeturn14view6turn14view8turn16view6

A third limitation is legal architecture. Open datasets such as DILA and CC-CEDICT are useful, but their share-alike obligations may affect how the future Knowledge Base is stored, transformed, and redistributed. That should be addressed before any ingestion work, not after. citeturn18view0turn18view1turn18view2turn30search2

## Final count report

The first-pass triage result is:

| Metric | Count |
|---|---:|
| Total sources found | **55** |
| Sources usable for engine | **16** |
| Sources usable for reference | **26** |
| Sources needing explicit copyright/license check | **18** |
| Sources that should be rejected | **5** |

The best next move is to convert this raw map into a **frozen source registry**, then build three separate review queues: **calendar-core**, **textual-reference**, and **doctrine-conflict**. Only after those queues are resolved should anything be promoted into a real Tứ Trụ Knowledge Base.