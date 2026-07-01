# AI Claims Processing System

## Overview

Short paragraph

## Features

- AI OCR
- PDF Support
- Vision LLM
- Document Verification
- Policy Engine
- Fraud Detection
- Explainable Trace
- Evaluation Dashboard

## Tech Stack

Next.js
TypeScript
Tailwind
OpenRouter
ShadCN
React Dropzone

## Local Setup

npm install

Create .env

OPENROUTER_API_KEY=

OPENROUTER_MODEL=qwen/qwen2.5-vl-72b-instruct:free

npm run dev

## Project Structure

app/

components/

lib/

data/

## Workflow

Upload

↓

OCR

↓

Document Validation

↓

Policy Engine

↓

Fraud Check

↓

Decision

↓

Trace

## Evaluation

The application includes a built-in evaluation dashboard available at:

/evaluation or click on the button View Evaluation Report

The dashboard executes all assignment test cases from `test_cases.json` and displays:

- Expected decision
- Actual decision
- Pass/Fail status
- Explainable trace

This serves as the evaluation report required by the assignment.
