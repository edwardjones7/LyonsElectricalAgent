import { describe, it, expect } from "vitest";
import { classifyDanger } from "./dangerClassifier";

describe("classifyDanger", () => {
  // The load-bearing tests. Each of these MUST be flagged. If a future change
  // breaks one of these, the safety guarantee is broken — fix the regex, do not
  // weaken the test.
  describe("hazards (must flag)", () => {
    const hazards = [
      ["sparking outlet", "my outlet is sparking"],
      ["sparking outlet variant", "the outlet sparked when I plugged in the toaster"],
      ["sparks from breaker", "I saw sparks coming out of my breaker box"],
      ["arcing wire", "there's a wire that keeps arcing in the basement"],
      ["fire", "I think there might be a fire behind the wall"],
      ["smoke from panel", "smoke came out of the electrical panel"],
      ["burning smell", "I smell something burning from my outlet"],
      ["burning smell from panel", "burning smell from the panel"],
      ["hot plastic smell", "there's a hot plastic smell near the breaker"],
      ["fish smell electrical", "weird fish smell in my laundry room near the outlet"],
      ["someone shocked", "my husband got shocked plugging in the dryer"],
      ["electrocuted", "I almost got electrocuted touching the switch"],
      ["exposed wire", "there's an exposed wire hanging out of the ceiling"],
      ["bare wire", "bare wire sticking out of the junction box"],
      ["live wire", "I have a live wire in my wall"],
      ["melted outlet", "the outlet is melted around the prongs"],
      ["charred socket", "the socket is charred and black"],
      ["scorched switch", "the switch plate is scorched"],
      ["hot outlet", "my outlet is hot to the touch"],
      ["warm panel", "the breaker panel feels warm"],
      ["child fork in outlet", "my kid stuck a fork in the outlet"],
      ["child poked outlet", "my toddler poked a paperclip into the socket"],
      ["downed wire", "a power line is down in my yard"],
      ["downed wire 2", "the service line fell into the tree"],
      ["water in panel", "water got into my breaker panel"],
      ["flooded panel", "my electrical panel is flooded"],
      ["leak on outlet", "rainwater is leaking onto my outlet"],
      ["wet wire", "the wires are wet from a roof leak"],
      ["electrical fire", "I think I have an electrical fire"],
      ["imminent fire", "the outlet is about to catch fire"],
      ["breaker won't reset", "the breaker trips immediately when I reset it"],
      ["breaker keeps tripping immediately", "breaker keeps tripping right away every time"],
      ["live work", "should I replace this breaker without turning off the panel"],
      ["live work 2", "I'm going to fix this wire while it's hot"],
    ] as const;

    for (const [name, msg] of hazards) {
      it(`flags: ${name}`, () => {
        const r = classifyDanger(msg);
        expect(r.verdict, `expected "danger" for: ${msg}`).toBe("danger");
      });
    }
  });

  // These should pass through to the LLM, not be falsely flagged.
  describe("benign (must NOT flag)", () => {
    const benign = [
      ["service area question", "do you serve cherry hill new jersey"],
      ["scheduling", "I'd like to schedule a panel upgrade quote"],
      ["financing", "do you offer financing"],
      ["hours", "what are your hours"],
      ["price question", "how much does it cost to upgrade a panel from 100A to 200A"],
      ["fixture install", "I want to install a new ceiling fan, can you help"],
      ["EV charger general", "I'm thinking about getting a level 2 ev charger installed"],
      ["just curious", "what's the difference between a master and journeyman electrician"],
      ["compliment", "you guys did a great job last time"],
      ["thanks", "thanks for the help"],
    ] as const;

    for (const [name, msg] of benign) {
      it(`safe: ${name}`, () => {
        const r = classifyDanger(msg);
        expect(r.verdict, `expected "safe" for: ${msg} (matched: ${r.matched?.join(",")})`).toBe("safe");
      });
    }
  });
});
