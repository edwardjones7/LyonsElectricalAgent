/**
 * Removes the [[ESCALATE]], [[CALL_CTA]], and [[RESOURCE:slug]] markers from a
 * string so it's safe to render or speak. The server-side stream parser strips
 * these as it emits events; the voice client also needs to strip them before
 * passing text to TTS so we don't speak "double bracket resource colon..."
 */
export function stripMarkers(input: string): string {
  return input
    .replace(/\[\[ESCALATE\]\]/g, "")
    .replace(/\[\[CALL_CTA\]\]/g, "")
    .replace(/\[\[RESOURCE:[a-z0-9-]+\]\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
