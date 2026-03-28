---
title: "AI Thinking Advisor"
description: "Describe your situation in plain language and get personalised mental model recommendations powered by AI. The smartest way to find the right framework."
icon: "🧠"
weight: -1
time_estimate: "1–2 minutes"
---

<div id="ai-matcher-app"></div>
<script src="/js/models-data.js"></script>
<script src="/js/tools/ai-matcher.js"></script>

## How it works

Unlike the standard [Toolkit Matcher](/tools/toolkit-matcher/) which uses keyword matching, the AI Thinking Advisor uses Claude (by Anthropic) to understand your situation in natural language and recommend the most relevant mental models with personalised explanations of why each one applies.

**Step 1.** Describe your situation, challenge, or decision in your own words — as much or as little detail as you like.

**Step 2.** The AI analyses your situation and matches it against all 150 mental models in the ThinkingKit library.

**Step 3.** You get 3–5 personalised recommendations with specific explanations of how each model applies to your situation.

All processing happens via the Anthropic API. Your situation description is sent to Claude for analysis but is not stored.

**Prefer a non-AI approach?** Use the [standard Toolkit Matcher](/tools/toolkit-matcher/) which works entirely client-side with no external calls.
