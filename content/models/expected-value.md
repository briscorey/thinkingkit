---
title: "Expected Value"
one_liner: "Multiply each possible outcome by its probability and sum them. The mathematically optimal choice is the one with the highest expected value."
question_hook: "What's the probability-weighted average outcome of each option?"
description: "Multiply each possible outcome by its probability and sum them. The mathematically optimal choice is the one with the highest expected value."
icon: "Σ"
difficulty: "Intermediate"
disciplines:
  - "Mathematics"
  - "Economics"
usecases:
  - "Making Decisions"
  - "Managing Risk"
tags:
  - "probability"
  - "decision-theory"
  - "gambling"
  - "risk"
related_models:
  - "probabilistic-thinking"
  - "asymmetric-risk"
  - "ergodicity"
---

## How it works

Expected value is the probability-weighted average of all possible outcomes. For each possible outcome, multiply its value by its probability, then sum. The result tells you what a decision is "worth" on average over many repetitions.

A bet that pays $100 with 30% probability and loses $20 with 70% probability has an expected value of (0.30 × $100) + (0.70 × -$20) = $30 - $14 = $16. Over many repetitions, you'd average $16 per bet. Positive expected value decisions are worth taking repeatedly; negative expected value decisions are not.

## Case study: How casino games are designed around expected value asymmetry

Every casino game has a negative expected value for the player and a positive expected value for the house. In European roulette, betting $1 on red has an expected value of -$0.027 (the house edge is 2.7%). This seems tiny per bet, but over millions of bets, the casino reliably extracts 2.7% of all money wagered.

The mathematical certainty of the house edge is so reliable that casinos can predict their revenue within a few percentage points each quarter. They don't need to win every hand — they just need the expected value to be in their favour. Time and volume do the rest.

## When to use it

Use expected value calculations for any decision you'll face repeatedly or that can be decomposed into probability and payoff. Ask: "What are the possible outcomes, how likely is each, and what is each worth?"

## Common mistakes

The biggest mistake is applying expected value to one-shot decisions where ruin is possible. A bet with positive expected value but a 10% chance of bankruptcy should be rejected — expected value assumes you survive to play again. This is the ergodicity problem.

## Try it now

Take a decision you're facing. List three possible outcomes with their approximate probabilities and values. Calculate the expected value. Does the math match your intuition?
