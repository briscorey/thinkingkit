---
title: "Technical Debt"
one_liner: "Quick shortcuts today create compounding costs tomorrow. Like financial debt, technical debt accrues interest — and eventually the interest payments exceed the original savings."
question_hook: "Are you borrowing from the future to move faster today?"
description: "Quick shortcuts today create compounding costs tomorrow. Like financial debt, technical debt accrues interest — and eventually the interest payments exceed the original savings."
icon: "⊖⊖"
difficulty: "Intermediate"
disciplines:
  - "Engineering"
usecases:
  - "Managing Risk"
  - "Solving Problems"
tags:
  - "software"
  - "shortcuts"
  - "maintenance"
  - "compounding"
related_models:
  - "compounding"
  - "entropy"
  - "premature-optimisation"
---

## How it works

Ward Cunningham coined "technical debt" as a metaphor for the accumulated cost of expedient decisions in software development. Like financial debt, it has an initial benefit (faster delivery) and an ongoing cost (interest payments in the form of reduced development speed, increased bugs, and harder maintenance).

Some technical debt is strategic — deliberately chosen to ship faster with a plan to pay it down later. Some is unintentional — the result of poor decisions, insufficient knowledge, or evolving requirements. The most dangerous kind is invisible — debt you don't know you have until it comes due.

## Case study: How technical debt nearly killed Knight Capital in 45 minutes

On August 1, 2012, Knight Capital Group deployed new trading software that contained a critical technical debt item: old, unused code from eight years earlier that hadn't been removed. A deployment error accidentally activated this dead code, which began executing millions of erroneous trades.

In 45 minutes, Knight Capital lost $440 million — more than twice the firm's annual revenue. The company had to be rescued and was effectively acquired for a fraction of its previous value. The dead code — a piece of technical debt that "wasn't worth cleaning up" — destroyed a $1.5 billion company in less than an hour. The interest on the debt came due all at once.

## When to use it

Apply technical debt thinking beyond software — to any system where shortcuts create future costs. Ask: "Is this expedient choice creating a debt I'll have to pay later? What's the interest rate on this debt?"

## Common mistakes

The main mistake is treating all technical debt as bad. Strategic debt — taken deliberately, with a plan to pay it down — is like a business loan. The problem is unmanaged debt that accumulates without anyone tracking or planning to address it.

## Try it now

Identify one shortcut in your current systems — technical, organisational, or personal — that's creating ongoing friction. What would it cost to "pay it down" now? What's the ongoing "interest" you're paying by not addressing it?
