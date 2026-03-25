---
title: "Accidental vs Essential Complexity"
one_liner: "Some complexity is inherent to the problem. Some is created by the solution. Learning to tell the difference is a superpower."
question_hook: "Is this complexity coming from the problem itself, or from how we've chosen to solve it?"
description: "Some complexity is inherent to the problem. Some is created by the solution. Learning to tell the difference is a superpower."
icon: "⌬⌬"
difficulty: "Intermediate"
disciplines:
  - "Engineering"
  - "Systems Thinking"
usecases:
  - "Solving Problems"
tags:
  - "Brooks"
  - "software"
  - "design"
  - "simplicity"
related_models:
  - "complexity-bias"
  - "premature-optimisation"
  - "occams-razor"
---

## How it works

Fred Brooks distinguished between essential complexity (inherent to the problem) and accidental complexity (created by the solution). Building a bridge has essential complexity — physics, materials, load calculations. But if you use a construction management system so convoluted that half your time is spent fighting the tools rather than building the bridge, that's accidental complexity.

Most mature systems are drowning in accidental complexity: processes added to fix other processes, tools layered on tools, organisational structures designed around people who left years ago.

## Case study: How the U.S. tax code grew from 27 pages to 75,000 through accumulated accidental complexity

The original 1913 U.S. income tax code was 27 pages. By 2024, it exceeded 75,000 pages. Each addition solved a real problem — closing a loophole, incentivising a behaviour, addressing a special case. But the accumulated weight of a century of patches created a system so complex that Americans spend over 6 billion hours per year on tax compliance.

The essential complexity of taxation is modest: determine income, apply a rate. The accidental complexity — exceptions, deductions, credits, phase-outs, alternative minimums — makes the simple task functionally impossible without professional help. The solution has become more complex than the problem.

## When to use it

Apply this distinction whenever a system feels harder than it should be. Ask: "Is this difficulty coming from the problem itself, or from how we've chosen to solve it?"

## Try it now

Pick a process in your work that feels unnecessarily complicated. Separate the essential complexity (what's genuinely hard about the underlying problem) from the accidental complexity (what's hard because of the tools, processes, or structures you've built around it). Could you solve the essential problem with a simpler approach?
