// Builds the pre-painted hero that the browser can show before React exists.
//
// The snapshot in prerendered-hero.html holds the hero's SHAPE. The words come
// from live-overrides-*.json, which is what the admin panel publishes — so a
// headline Ronen changes today is baked into the next build automatically, and
// the snapshot only needs regenerating when the hero's code changes.
//
// Everything here is best-effort: any missing file or unexpected shape returns
// null and the page is built exactly as it was before.
import fs from "node:fs/promises";
import { parse } from "node-html-parser";

const SNAPSHOT = "prerendered-hero.html";
// The bare domain renders variant c; /a /b /d are rewrites of the same file,
// so the placeholder is removed for those at runtime rather than baked wrong.
const DEFAULT_VARIANT = "c";
const OVERRIDES = `live-overrides-${DEFAULT_VARIANT}.json`;

async function readJson(file) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return null; }
}

export async function buildPreheroBlock() {
  let snapshot;
  try { snapshot = await fs.readFile(SNAPSHOT, "utf8"); } catch { return null; }
  if (!snapshot.trim()) return null;

  const root = parse(snapshot, { comment: false });
  const hero = root.firstChild;
  if (!hero || !hero.querySelectorAll) return null;

  // Pour in the published text, exactly as applyOverridesToDOM does at runtime:
  // match on data-edit-id, ignore blanks (an empty override is an accident, not
  // an instruction to erase the line).
  // No readable overrides means no way to know the current wording. Baking the
  // snapshot's older copy would show a visitor the wrong headline for four
  // seconds and then swap it — worse than the blank screen this replaces, so
  // in that case there is simply no placeholder.
  const data = await readJson(OVERRIDES);
  if (!data || typeof data !== "object") return null;
  const overrides = { ...(data.overrides || {}), ...(data.overridesMobile || {}) };
  let applied = 0, missing = 0;
  for (const el of root.querySelectorAll("[data-edit-id]")) {
    const id = el.getAttribute("data-edit-id");
    if (!Object.prototype.hasOwnProperty.call(overrides, id)) { missing++; continue; }
    const desired = overrides[id];
    const visible = String(desired ?? "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    if (!visible) continue;
    el.set_content(String(desired));
    applied++;
  }

  // The stamps were only needed to find the slots; React re-adds its own.
  for (const el of root.querySelectorAll("[data-edit-id]")) el.removeAttribute("data-edit-id");

  // While this is on screen the rest of the page does not exist yet, so a tap
  // has nothing to scroll to and no real player to start. Both taps are
  // remembered instead and carried out the moment React is up — and because
  // the tap itself was a genuine gesture, the browser still lets the video
  // start with sound.
  for (const btn of root.querySelectorAll(".btn-primary")) {
    btn.setAttribute("onclick", "window.__cutsWantsCTA=1");
  }
  for (const btn of root.querySelectorAll(".hero-poster-btn")) {
    btn.setAttribute("onclick", "window.__cutsWantsVideo=1");
  }

  return { html: root.toString(), applied, missing };
}

export function preheroMarkup(html) {
  // Desktop already paints in under a second, and the snapshot is taken at
  // phone width — so this is a mobile-only stand-in, and never a second hero
  // for assistive tech.
  // Laid over the page rather than inside it. Sitting in normal flow, removing
  // it nudged everything below by a few pixels as React's hero replaced it —
  // small, but a layout shift I would have introduced. Out of flow, the swap
  // moves nothing at all.
  return `<style>#prehero{display:none}
@media(max-width:600px){#prehero{display:block;position:absolute;top:0;left:0;right:0;z-index:5}}</style>
<div id="prehero" class="theme-bold" aria-hidden="true"><div class="site-canvas">${html}</div></div>
<script>(function(){var p=document.getElementById("prehero");if(!p)return;
// /a /b /d are other variants of this same file; their hero is not this one.
if(!/^\\/(c)?$/.test(location.pathname)){p.remove();return}
function honour(sel,act,tries){var el=document.querySelector(sel);
if(el){act(el);return}if(tries>0)setTimeout(function(){honour(sel,act,tries-1)},120)}
var o=new MutationObserver(function(){var r=document.getElementById("root");
if(!r||!r.children.length)return;p.remove();o.disconnect();
if(window.__cutsWantsCTA)honour("#cta",function(e){e.scrollIntoView({behavior:"smooth"})},25);
if(window.__cutsWantsVideo)honour(".hero-poster-btn",function(e){e.click()},25)});
document.addEventListener("DOMContentLoaded",function(){var r=document.getElementById("root");
if(r)o.observe(r,{childList:true})})})();</script>`;
}
