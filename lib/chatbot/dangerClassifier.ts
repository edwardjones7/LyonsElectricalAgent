/**
 * Safety-critical pre-classifier.
 *
 * Goal: any message that describes an active electrical hazard must be flagged
 * BEFORE the LLM gets a chance to attempt advice. False positives are acceptable
 * (the worst case is "we told the user to call us when they didn't strictly
 * need to"). False negatives are not (the worst case is "the LLM tried to
 * troubleshoot a sparking outlet over chat").
 *
 * The order of operations in /api/chat/route.ts is:
 *   1. Run `classifyDanger` (regex, instant, deterministic)
 *   2. If `verdict === 'danger'` → short-circuit, render DangerPanel
 *   3. Otherwise → pass to main chat turn
 *
 * Optionally, an LLM classifier can be layered on top for messages the regex
 * marked safe but contain risk-adjacent terms — see `classifyDangerLLM`.
 */

export type DangerVerdict = "danger" | "safe";

export type DangerResult = {
  verdict: DangerVerdict;
  reason?: string;
  matched?: string[];
};

// Hazard signals — any single match flips to "danger".
// Patterns must be designed for false-positive tolerance, not surgical accuracy.
const HARD_SIGNALS: Array<{ name: string; pattern: RegExp }> = [
  { name: "sparking", pattern: /\b(spark(?:s|ing|ed)?|arc(?:ing|ed|s)?|arcing)\b/i },
  { name: "fire", pattern: /\b(fire|flame|smoke|smold(?:er(?:ing)?)?|on fire)\b/i },
  { name: "burning_smell", pattern: /\b(burn(?:ing|t)?|burned)\b.*\b(smell|odor)\b|\b(smell|odor|smells|odors)\b.*\b(burn(?:ing|t)?|burned|hot plastic|fish)\b|\bhot plastic\b|\bfish smell\b/i },
  { name: "shock", pattern: /\b(shock(?:ed|ing)?|electrocut(?:ed|ion|e)|got zapped|been zapped)\b/i },
  { name: "exposed_wire", pattern: /\b(exposed|bare|live|naked)\b\s+(wire|wires|wiring|cable|cables)\b|\bwires?\b\s+(?:are\s+|is\s+)?(exposed|sticking out|hanging)\b/i },
  { name: "melted_charred", pattern: /\b(melt(?:ed|ing)?|charr?ed|scorch(?:ed|ing)?|blacken(?:ed)?)\b.*\b(outlets?|switch(?:es)?|wires?|panels?|breakers?|plugs?|cords?|sockets?)\b|\b(outlets?|switch(?:es)?|wires?|panels?|breakers?|plugs?|cords?|sockets?)\b.*\b(melt(?:ed|ing)?|charr?ed|scorch(?:ed|ing)?|blacken(?:ed)?)\b/i },
  { name: "hot_outlet", pattern: /\b(outlets?|switch(?:es)?|plugs?|cords?|panels?|breakers?|sockets?)\b\s+(?:is\s+|are\s+|feels?\s+|felt\s+|getting\s+|got\s+|seems\s+)?(hot|warm|too hot|burning hot|burning|red hot)\b/i },
  { name: "child_outlet", pattern: /\b(kid|child|son|daughter|baby|toddler|grandchild)\b.*\b(?:stuck|stick(?:ing)?|put|pushed|jammed|poked|shoved|inserted)\b.*\b(fork|key|metal|finger|wire|object|hairpin|paperclip|nail|knife)\b.*\b(outlet|socket)\b|\bfork\b.*\bin\b.*\boutlet\b|\b(outlet|socket)\b.*\b(kid|child|baby|toddler)\b.*\b(fork|paperclip|key|metal|finger)\b/i },
  { name: "downed_wire", pattern: /\b(power|electric|service|electrical)\s+(line|wire|cable)\b\s+(?:is\s+|has\s+)?(down|on the ground|in (?:the\s+)?(?:yard|street|tree|driveway|grass|fence)|into\s+(?:the\s+|a\s+)?(?:yard|street|tree|driveway|fence)|sparking|fell|fallen|dropped|snapped|severed|broke(?:n)?|came down|cut)\b|\b(downed|fallen)\s+(power|electric|service|electrical)?\s*(line|wire|cable)\b|\b(power|service|electric)\s+(line|wire)\b\s+(?:fell|hit|landed)\b/i },
  { name: "flooded_panel", pattern: /\b(flood(?:ed|ing)?|leak(?:ed|ing)?|drip(?:ped|ping)?|puddle|wet|water|rain(?:water)?|moist(?:ure)?|condensation)\b.*\b(panels?|breakers?|outlets?|sockets?|switch(?:es)?|wires?|wiring|service|electrical|electric|fuse ?box(?:es)?|meters?)\b|\b(panels?|breakers?|outlets?|sockets?|switch(?:es)?|wires?|wiring|electrical|fuse ?box(?:es)?|meters?)\b.*\b(flood(?:ed|ing)?|leak(?:ed|ing)?|drip(?:ped|ping)?|wet|water|rain(?:water)?|moist(?:ure)?)\b/i },
  { name: "imminent_fire", pattern: /\b(about to catch fire|catching fire|caught fire|gonna burn|going to burn|smell of fire|electrical fire)\b/i },
  { name: "breaker_won't_reset", pattern: /\b(breaker|fuse)\b\s+(?:keeps\s+|won'?t\s+|wont\s+|will not\s+|trips?\s+immediately|trips?\s+right\s+away|won'?t\s+stay\s+(?:on|reset)|trips?\s+as\s+soon\s+as)\b/i },
  { name: "doing_live_work", pattern: /\b(should I|can I|how do I|im going to|i'?m going to|trying to|about to)\b.*\b(replace|change|swap|fix|rewire|wire up|hook up|install)\b.*\b(breaker|panel|wire|circuit|outlet)\b.*\b(live|hot|energized|without (?:turning off|shutting off|cutting))\b|\bworking on\b.*\b(live|hot|energized)\b.*\b(panel|circuit|wire|breaker)\b/i },
];

/**
 * Synchronous, deterministic regex pass. Always run this first.
 */
export function classifyDanger(input: string): DangerResult {
  const text = input.toLowerCase();
  const matched: string[] = [];
  for (const sig of HARD_SIGNALS) {
    if (sig.pattern.test(text)) {
      matched.push(sig.name);
    }
  }
  if (matched.length > 0) {
    return { verdict: "danger", reason: matched.join(", "), matched };
  }
  return { verdict: "safe" };
}

/**
 * Risk-adjacent terms that ought to trigger a second-look classifier even
 * when the hard signals didn't match. Used to gate the LLM classifier so we
 * only spend a Haiku call on actually-suspicious messages.
 */
const RISK_ADJACENT = /\b(panel|breaker|fuse|wire|outlet|switch|circuit|electrical|electric|hot|burn|spark|smell|water|flood|exposed|live|broken|damaged|emergency|urgent|help|scared|smoke)\b/i;

export function looksRiskAdjacent(input: string): boolean {
  return RISK_ADJACENT.test(input);
}
