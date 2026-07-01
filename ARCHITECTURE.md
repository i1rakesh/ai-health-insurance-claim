# Architecture

## Overview

The project is an AI-assisted health insurance claim processing system.

The goal is to automate as much of the claim review process as possible while keeping every decision explainable.

The system combines AI document extraction with a rule-based workflow engine.

---

## High Level Flow

User Uploads Documents
        │
        ▼
AI Document Extraction
(OpenRouter Vision)
        │
        ▼
Structured Claim Data
        │
        ▼
Document Validation
        │
        ▼
Workflow Engine
    ├── Document Verification
    ├── Consistency Check
    ├── Policy Validation
    └── Fraud Detection
        │
        ▼
Decision + Explainable Trace

---

## Components

### 1. Frontend

The frontend is built using Next.js and React.

The user can:

- Upload medical documents
- Review AI extracted information
- Edit extracted values if needed
- Submit the claim
- View the final decision
- View the complete reasoning trace

The goal was to make the process simple and transparent instead of showing only the final decision.

---

### 2. AI Extraction Layer

This is the first intelligent step in the workflow.

Uploaded images (and PDF pages after conversion) are sent to the vision model.

The AI extracts information like:

- Patient Name
- Hospital Name
- Diagnosis
- Treatment Date
- Claimed Amount
- Document Type

The extraction result is structured JSON.

The workflow never directly trusts the AI output. Every extracted value is validated again by rule-based checks.

---

### 3. Document Gate

Before processing the claim, the system checks whether all required documents are present.

For example:

Consultation claims require:

- Prescription
- Hospital Bill

If something is missing, processing stops immediately and the user receives a clear message about what needs to be uploaded.

This avoids unnecessary AI and workflow execution.

---

### 4. Workflow Engine

The workflow engine is completely rule based.

Each step performs one responsibility.

Current steps are:

- Document Verification
- Consistency Check
- Policy Validation
- Fraud Detection

Each step returns:

- Success or Failure
- Decision
- Human-readable explanation

The workflow records every step into a trace.

---

### 5. Decision Engine

Depending on the workflow results, the engine returns one of:

- APPROVED
- PARTIAL
- REJECTED
- MANUAL_REVIEW
- INCOMPLETE

Every decision includes the complete reasoning trace.

---

## Why this architecture?

I intentionally separated AI from business logic.

The AI only extracts information.

The workflow engine makes every business decision.

This makes the system:

- easier to test
- easier to explain
- easier to modify
- independent from any AI provider

If the AI model changes in the future, the business rules remain exactly the same.

---

## Design Decisions

Some decisions I intentionally made:

### AI only extracts information

I did not allow the AI to approve or reject claims.

Insurance decisions should always be deterministic and explainable.

---

### Small independent workflow modules

Instead of one large function, every validation is its own module.

This makes debugging much easier.

---

### Explainable trace

Every step records why it passed or failed.

This makes the system transparent for users and reviewers.

---

## What I considered but didn't use

I considered letting the LLM make the final approval decision.

I rejected this because:

- responses may change
- decisions become difficult to explain
- testing becomes unreliable

A rule engine gives consistent outputs every time.

---

## Current Limitations

Some limitations still exist.

- OCR quality depends on image quality.
- Fraud detection currently uses simple rules.
- Policy rules are stored in JSON instead of a database.
- PDF conversion currently happens before AI extraction, which adds processing time.

---

## Scaling the system

If this system handled 10x more traffic, I would:

- move document processing into background jobs
- store uploaded files in cloud storage
- replace JSON policies with a database
- cache policy lookups
- add queue-based AI processing
- split AI extraction and workflow engine into separate services

The workflow itself would remain the same because it is already modular.