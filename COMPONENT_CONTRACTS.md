# Component Contracts

This document describes the responsibility of every major component.

---

# UploadDocuments

## Input

- JPG
- JPEG
- PNG
- PDF files

## Output

A list of uploaded files.

## Possible Errors

- Unsupported file type
- Empty upload

---

# AI Extractor

## Input

Uploaded document images or converted PDF pages.

## Output

Structured claim information.

Example:

- Patient Name
- Hospital Name
- Diagnosis
- Treatment Date
- Claimed Amount
- Detected Documents
- Confidence Score
- Warnings

## Possible Errors

- AI request failed
- Invalid JSON response
- Image not readable
- PDF conversion failed

---

# PDF Converter

## Input

PDF document

## Output

One PNG image for each page.

## Possible Errors

- Invalid PDF
- Corrupted file
- Conversion failure

---

# Document Gate

## Input

Claim category

Detected document list

## Output

Whether all required documents are present.

Example:

Success

or

Missing:

- Hospital Bill

## Possible Errors

- Unknown claim category

---

# Document Verification

## Input

Claim information

Uploaded documents

## Output

Checks:

- Required documents exist
- Documents are readable
- Correct document types

Returns PASS or FAIL.

---

# Consistency Checker

## Input

Extracted document information

## Output

Checks whether all uploaded documents belong to the same patient.

Returns PASS or FAIL.

---

# Policy Engine

## Input

Claim information

Policy rules

## Output

Determines:

- Approved
- Partial
- Rejected

Also calculates approved amount.

Possible reasons include:

- Waiting period
- Exclusions
- Coverage limits

---

# Fraud Detector

## Input

Claim history

Current claim

## Output

Detects suspicious behaviour.

Current checks include:

- Multiple same-day claims

Returns either:

PASS

or

MANUAL REVIEW

---

# Workflow Engine

## Input

Validated claim object

## Output

Final decision.

Possible values:

- APPROVED
- PARTIAL
- REJECTED
- MANUAL_REVIEW
- INCOMPLETE

Also returns:

- Approved Amount
- Full Explainable Trace

---

# Evaluation API

## Input

Assignment test cases

## Output

Runs every test case through the workflow.

Returns:

- Expected Decision
- Actual Decision
- Match Result
- Full Trace

This is used by the Evaluation page to verify system behaviour.