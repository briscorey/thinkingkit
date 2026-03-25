---
title: "Base Rates and Priors"
one_liner: "Before evaluating specific evidence, check how common the thing is in general. The base rate is your starting point."
question_hook: "What's the background frequency before you consider the specific evidence?"
description: "Before evaluating specific evidence, check how common the thing is in general. The base rate is your starting point."
icon: "P"
difficulty: "Intermediate"
disciplines:
  - "Mathematics"
usecases:
  - "Evaluating Arguments"
  - "Making Decisions"
tags:
  - "Bayes"
  - "prior"
  - "statistics"
  - "probability"
related_models:
  - "bayesian-updating"
  - "base-rate-neglect"
  - "probabilistic-thinking"
---

## How it works

Base rates are the background frequency of an event in a population before you consider any specific evidence. Before asking "does this evidence mean X?", you need to ask "how common is X in general?" Without the base rate, even strong evidence can be misleading.

Bayes' theorem formalises this: your updated belief should combine the base rate (prior probability) with the strength of the new evidence (likelihood ratio). Most reasoning errors come from ignoring the base rate and focusing only on the specific evidence.

## Case study: How an Israeli psychologist saved lives by teaching doctors to think in frequencies

Gerd Gigerenzer found that most doctors couldn't correctly interpret a positive mammogram result. When told "the test is 90% sensitive and 93% specific," they estimated a 90% chance of cancer. The actual probability was around 9%.

Gigerenzer's solution was elegant: instead of percentages, present the same information as natural frequencies. "Out of 1,000 women, 10 have cancer. Of those 10, the test correctly identifies 9. Of the 990 without cancer, the test incorrectly flags 70." Now doctors could see immediately: of the 79 positive results, only 9 actually have cancer — about 11%. The math was identical. The representation changed everything.

## When to use it

Always check the base rate before interpreting specific evidence. Ask: "How common is this in general?" before asking "Does this evidence apply to my case?"

## Common mistakes

The main mistake is using base rates as the final answer. Base rates are your starting point — you should update from there based on specific evidence. The second mistake is ignoring base rates entirely and treating each case as unique.

## Try it now

Think of a prediction you're making. What's the base rate? For example, if you're predicting your startup will succeed, the base rate of startup success is roughly 10%. Start there, then adjust based on your specific evidence.
