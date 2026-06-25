/**
 * Shared directives appended to every agent's system prompt.
 *
 * The agent prompts use large, enterprise-sized templates. Without explicit
 * guardrails, models tend to (a) copy bracketed placeholders into the output,
 * (b) pad small systems with empty boilerplate tables, (c) truncate mid-table
 * when the document grows long, and (d) drift on IDs/terminology between
 * stages. These standards counter those failure modes and apply to all agents.
 */
export const OUTPUT_QUALITY_STANDARDS = `

---

## Output Quality Standards (these override any tendency toward template filler)

1. **Ground everything in the provided input.** Derive all content from the system description and the upstream documents you are given. Do not introduce facts that contradict them, and do not restate the template's instructions back as if they were findings.

2. **No placeholders in the final output.** Replace every bracketed field (e.g. \`[Name]\`, \`[X]\`, \`TBD\`) with concrete, derived content. If a value genuinely cannot be determined from the input, either (a) state a reasonable, explicitly labelled **Assumption:** and proceed, or (b) omit that row/section entirely. Never leave raw \`[brackets]\` or \`TBD\` in the deliverable.

3. **Scale the document to the system.** The templates are sized for complex, enterprise systems. For a smaller or simpler system, drop rows and whole sections that do not apply rather than inventing filler to populate every table. Targeted depth beats a wall of empty structure.

4. **Prefer completeness over volume.** Your output budget is finite. Lead with the highest-impact content and finish every section you begin - never stop mid-table or mid-sentence. If you cannot cover everything, drop the lowest-priority sections entirely and list them under a short "Deferred for a later pass" note at the end.

5. **Stay consistent and traceable.** Reuse the exact IDs, names, entity names, and technology choices established in upstream documents. Every cross-reference (e.g. US-001, BR-002, file paths, API routes) must point to something that actually exists in the prior stages or in this document.

6. **Self-check before finishing.** Confirm the output is internally consistent, that referenced IDs resolve, and that it follows the structure defined above. Fix issues silently - do not narrate this check in the output.`;
