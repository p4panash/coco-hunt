/**
 * The ONE file you edit before launch.
 *
 * Everything that varies between hunts (recipient name, the location, the code,
 * copy, the deadline) lives here. Replace the REPLACE_ME / placeholder values
 * before launch; the rest of the app reads from this object.
 *
 * This is the SINGLE-STOP cut of birthday-hunt: one clue, straight to the
 * Easybox. (The type still carries three checkpoint slots so the shared
 * components compile unchanged — only slot 0 is ever reached. Leave [1] and
 * [2] as-is.)
 *
 * Copy supports [VAR] template substitution — see `src/lib/tpl.ts`. The only
 * substituted var is FRIEND_NAME, and only in strings passed through tpl()
 * (currently: intro.headline, checkpoint teaser/realHint).
 */

export type Checkpoint = {
  id: 1 | 2 | 3;
  name: string;
  /** Cryptic, always-visible teaser shown on the location screen. */
  teaser: string;
  /** More explicit landmark clue, revealed inside the "stuck?" sheet. */
  realHint: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  /** Manual-entry fallback, case-insensitive, whitespace-trimmed. */
  code: string;
  /** Line shown after the reveal animation. */
  successCopy: string;
};

export type PhotoConfig = {
  src: string;
  caption: string;
  afterStep: 0 | 1 | 2;
  durationMs?: number;
};

export type HuntConfig = {
  friendName: string;

  intro: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
    finePrint: string;
  };

  gpsPreface: {
    headline: string;
    body: string;
    allowCta: string;
  };

  /** ISO 8601 timestamp — when the EasyBox returns the package. Drives the countdown. */
  deadlineISO: string;
  countdown: {
    eyebrow: string;
  };

  checkpoints: [Checkpoint, Checkpoint, Checkpoint];

  warmthStatuses: {
    veryFar: string; // >500m
    far: string; // 200–500m
    close: string; // 50–200m
    onTop: string; // <50m
  };

  stuckSheet: {
    title: string;
    realHintIntro: string;
    codeLabel: string;
    codePlaceholder: string;
    unlockCta: string;
    closeCta: string;
  };

  reveal: {
    headline: string;
    nextCta: string;
    finaleCta: string;
  };

  finale: {
    headline: string;
    subheadline: string;
    lockerHintLabel: string;
    instruction: string;
    qrBrightnessTip: string;
    openLockerMapLabel: string;
  };

  /** Where the EasyBox actually is — the friend scans the QR there to open it. */
  easyboxLocation: {
    name: string;
    hint: string;
    mapsUrl: string;
  };

  errors: {
    wrongCode: string;
    gpsDenied: string;
    gpsFlaky: string;
  };

  photos: PhotoConfig[];
  sound: {
    unlockSrc: string;
    finaleSrc: string;
  };
};

// The single stop: the Easybox itself. Replace lat/lng/code/hint with the real
// locker before launch.
const THE_STOP: Checkpoint = {
  id: 1,
  name: "Easybox Falticeni",
  teaser:
    "your whole hunt is one clue. Falticeni is three streets and a lake, and they all knot together in the same spot — go stand in that knot. the parcel locker is right there, waiting for you.",
  realHint:
    "the Easybox in the dead centre of town, by REPLACE_ME (store) on the main square — the one you pass every time you cut across.",
  // Falticeni town centre — REPLACE with the real Easybox coordinates.
  lat: 47.4592,
  lng: 26.3006,
  radiusMeters: 40,
  code: "BULLSEYE",
  successCopy: "bullseye. now the easy part.",
};

export const config: HuntConfig = {
  friendName: "Coco",

  intro: {
    eyebrow: "happy birthday",
    headline: "[FRIEND_NAME]. we hid your gift. this one's quick.",
    body: "normally there'd be a whole hunt — stops, clues, you sweating on a bike. but Falticeni is three streets and a lake. so: one clue, one locker. don't overthink it.",
    cta: "give me the clue →",
    finePrint: "",
  },

  gpsPreface: {
    headline: "we need to know where you are.",
    body: "otherwise this is just us describing a locker at you. your phone tracks you, not us — we only listen for the 'made it' ping.",
    allowCta: "allow location",
  },

  // REPLACE with the real EasyBox return time.
  deadlineISO: "2026-09-20T20:00:00+03:00",
  countdown: {
    eyebrow: "the locker takes your gift back in:",
  },

  // Only [0] is reached. [1] and [2] are unused filler — leave them.
  checkpoints: [
    THE_STOP,
    { ...THE_STOP, id: 2, name: "unused" },
    { ...THE_STOP, id: 3, name: "unused" },
  ],

  warmthStatuses: {
    veryFar: "somewhere out there.",
    far: "getting warmer...",
    close: "much warmer.",
    onTop: "you're basically on top of it. look around.",
  },

  stuckSheet: {
    title: "stuck?",
    realHintIntro: "ugh, fine. the plain version:",
    codeLabel: "got a code? type it.",
    codePlaceholder: "----",
    unlockCta: "unlock",
    closeCta: "close and pretend i didn't",
  },

  reveal: {
    headline: "GOTCHA.",
    nextCta: "continue →",
    finaleCta: "open the locker screen →",
  },

  finale: {
    headline: "THAT WAS THE WHOLE HUNT.",
    subheadline: "one locker, one code, one you. scan to open it.",
    lockerHintLabel: "you're standing at:",
    instruction:
      "hold the QR up to the Easybox scanner. try to look normal doing it.",
    qrBrightnessTip: "crank your screen brightness so the scanner reads it.",
    openLockerMapLabel: "open in maps",
  },

  easyboxLocation: {
    name: "Easybox Falticeni — REPLACE_ME (store)",
    hint: "REPLACE_ME (street), nr. REPLACE_ME. the locker right by the entrance. yes, that one.",
    mapsUrl: "https://maps.google.com/?q=easybox+falticeni",
  },

  errors: {
    wrongCode: "nope. that's not it. count the letters again, champ.",
    gpsDenied:
      "your phone won't share your location. cool. cool cool cool. type the code instead.",
    gpsFlaky: "your phone's a bit lost. waving at satellites...",
  },

  photos: [],

  sound: {
    unlockSrc: "sound/unlock.ogg",
    finaleSrc: "sound/finale.ogg",
  },
};

/** Lookup helper — kept for the photo interstitial; returns null with photos: []. */
export function photoAfter(n: 0 | 1 | 2): PhotoConfig | null {
  return config.photos.find((p) => p.afterStep === n) ?? null;
}
