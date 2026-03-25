---
title: "Single Point of Failure"
one_liner: "Any component whose failure causes the entire system to fail. The question isn't whether it will fail — it's whether you've prepared for when it does."
question_hook: "If this one thing breaks, does everything break?"
description: "Any component whose failure causes the entire system to fail. The question isn't whether it will fail — it's whether you've prepared for when it does."
icon: "⊗⊗⊗"
difficulty: "Foundation"
disciplines:
  - "Engineering"
  - "Systems Thinking"
usecases:
  - "Managing Risk"
  - "Solving Problems"
tags:
  - "reliability"
  - "redundancy"
  - "systems"
  - "design"
related_models:
  - "redundancy"
  - "margin-of-safety"
  - "antifragility"
---

## How it works

A single point of failure (SPOF) is any component whose failure causes the entire system to fail. The most dangerous single points of failure are the ones you haven't identified — the dependencies so embedded in your system that you don't notice them until they break.

Every critical system should be audited for SPOFs: one key employee, one supplier, one server, one revenue source, one communication channel, one decision-maker. If any single element's failure would be catastrophic, you have a design problem.

## Case study: How one engineer's bus accident revealed Facebook's single point of failure

In Facebook's early years, the company had one engineer who understood the ad targeting system. When he was hit by a bus (this actually happened — he survived), Facebook discovered that no one else could maintain or debug the system that generated the majority of their revenue.

The incident gave rise to the term "bus factor" in Silicon Valley — the number of people who would need to be hit by a bus before a project becomes unmaintainable. A bus factor of 1 means a single person's absence would cripple the system. Facebook subsequently instituted code documentation requirements, pair programming on critical systems, and knowledge-sharing protocols. The near-disaster created resilience.

## When to use it

Audit any important system for single points of failure. Ask: "If this one thing breaks — this person, this tool, this supplier, this process — does everything stop?" For anything critical, the answer should be no.

## Common mistakes

The main mistake is eliminating all single points of failure, which creates enormous redundancy costs. Not everything needs a backup. Focus on the components whose failure would be catastrophic and irreversible.

## Try it now

Map the critical dependencies in your most important project. Which ones have no backup? What's the bus factor for your team's key knowledge? For anything with a bus factor of 1, what's the simplest way to add redundancy?
