---
title: "Ergodicity"
one_liner: "The average outcome for a group can be completely different from the typical outcome for an individual over time."
question_hook: "Is the 'expected value' actually what you should expect to experience?"
description: "The average outcome for a group can be completely different from the typical outcome for an individual over time."
icon: "⍟"
difficulty: "Advanced"
disciplines:
  - "Mathematics"
  - "Economics"
usecases:
  - "Managing Risk"
  - "Making Decisions"
tags:
  - "Taleb"
  - "probability"
  - "risk"
  - "Peters"
related_models:
  - "probabilistic-thinking"
  - "antifragility"
  - "asymmetric-risk"
---

## How it works

A process is ergodic when the average outcome across many parallel attempts equals the average outcome for one person over many sequential attempts. Coin flips are ergodic: flip 1,000 coins once or flip one coin 1,000 times — you'll get roughly the same average.

But many real-world situations are non-ergodic. Russian roulette has a positive expected value across a group ($5 million payout, 5/6 probability = $4.17 million expected value per round). But for any individual playing repeatedly, the time-average outcome is death. The group average is meaningless for the individual.

This distinction, championed by Ole Peters and amplified by Nassim Taleb, has profound implications: in non-ergodic systems, you cannot use the ensemble average (group average) to make decisions for an individual acting over time.

## Case study: How the Kelly Criterion saved gamblers from ruin

In the 1960s, mathematician Ed Thorp used card counting to gain a small edge in blackjack. But having an edge wasn't enough — he needed to know how much to bet. Betting too little wasted the edge. Betting too much risked total ruin from an unlucky streak.

The answer was the Kelly Criterion, derived from information theorist John Kelly: bet a fraction of your bankroll proportional to your edge. With a 2% edge, bet roughly 2% of your bankroll. This strategy maximises long-term wealth growth while ensuring you never go broke.

The Kelly Criterion works because gambling (and investing) is non-ergodic. The ensemble average (expected value across many parallel bets) is positive. But the time average (one gambler over many sequential bets) leads to ruin if bets are too large, because a single catastrophic loss eliminates you. The Kelly Criterion respects the non-ergodic nature of sequential risk-taking.

## Real-world examples

**Investing with leverage.** A leveraged portfolio might have a higher expected return than an unleveraged one. But a single bad year can wipe out the leveraged portfolio entirely. The ensemble average (across all possible market states) looks great. The time average (for one investor over many years) often leads to ruin.

**Career gambles.** Taking a high-risk career bet makes sense if you have many careers to live. With only one, you need to ensure the downside doesn't eliminate you from the game entirely.

## When to use it

Apply ergodicity thinking whenever you're making decisions where ruin is possible. Ask: "Can I survive the worst-case outcome and continue playing?" If no, the expected value calculation is misleading — even if the expected value is positive.

## Common mistakes

The main mistake is assuming all positive expected value bets are worth taking. In non-ergodic settings, survival comes first. The second mistake is using this as an excuse to never take risks. The point is to take risks where you survive the downside, not to avoid all risk.

## Try it now

Think of a decision you're facing with significant upside and downside. Ask: "If this goes badly, am I still in the game? Or does the downside eliminate me?" If elimination is possible, the expected value may be irrelevant — survival takes precedence.
