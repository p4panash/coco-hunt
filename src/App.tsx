import { useReducer } from "react";
import {
  STORAGE_KEY,
  huntReducer,
  initialState,
  type CheckpointIndex,
  type HuntState,
} from "./state/huntReducer";
import {
  loadFromStorage,
  useLocalStorageSync,
} from "./lib/useLocalStorageSync";
import { detectTestMode } from "./lib/testMode";
import PortraitLock from "./components/PortraitLock";
import Starfield from "./components/Starfield";
import CountdownBanner from "./components/CountdownBanner";
import ProgressScaffold from "./components/ProgressScaffold";
import TestModeBadge from "./components/TestModeBadge";
import Intro from "./screens/Intro";
import GpsPreface from "./screens/GpsPreface";
import LocationActive from "./screens/LocationActive";
import Reveal from "./screens/Reveal";
import PhotoInterstitial from "./screens/PhotoInterstitial";
import Finale from "./screens/Finale";

// Single-stop hunt: no QR slicing. One image, shown whole on the reveal,
// in the progress cell, and on the finale.
const QR_SRC = `${import.meta.env.BASE_URL}qr.jpg`;

function init(seed: HuntState): HuntState {
  const stored = loadFromStorage<HuntState | null>(STORAGE_KEY, null);
  // testMode is derived from the URL on every load, never from persisted state,
  // so a previously-tested device falls back to a clean (no dev tools) view.
  return { ...(stored ?? seed), testMode: detectTestMode() };
}

export default function App() {
  const [state, dispatch] = useReducer(huntReducer, initialState, init);
  useLocalStorageSync(STORAGE_KEY, state);

  const showChrome =
    state.step.kind !== "intro" && state.step.kind !== "gps-preface";
  const currentN = currentCheckpoint(state);
  const revealingN = state.step.kind === "reveal" ? state.step.n : null;

  return (
    <PortraitLock>
      <Starfield />
      <div className="app-shell">
        {showChrome && <CountdownBanner />}
        {showChrome && state.step.kind !== "finale" && (
          <ProgressScaffold
            qrUrl={QR_SRC}
            unlocked={state.unlocked}
            currentN={currentN}
            revealingN={revealingN}
          />
        )}
        <Router state={state} dispatch={dispatch} qrUrl={QR_SRC} />
        {state.testMode && (
          <TestModeBadge dispatch={dispatch} currentN={currentN} />
        )}
      </div>
    </PortraitLock>
  );
}

function currentCheckpoint(state: HuntState): CheckpointIndex | null {
  switch (state.step.kind) {
    case "location":
    case "reveal":
      return state.step.n;
    case "photo":
      return Math.min(2, state.step.afterN + 1) as CheckpointIndex;
    default:
      return null;
  }
}

function Router({
  state,
  dispatch,
  qrUrl,
}: {
  state: HuntState;
  dispatch: React.Dispatch<Parameters<typeof huntReducer>[1]>;
  qrUrl: string;
}) {
  const { step } = state;
  switch (step.kind) {
    case "intro":
      return <Intro dispatch={dispatch} />;
    case "gps-preface":
      return <GpsPreface dispatch={dispatch} />;
    case "location":
      return (
        <LocationActive
          dispatch={dispatch}
          n={step.n}
          testMode={state.testMode}
        />
      );
    case "reveal":
      return <Reveal dispatch={dispatch} n={step.n} slice={qrUrl} />;
    case "photo":
      return <PhotoInterstitial dispatch={dispatch} afterN={step.afterN} />;
    case "finale":
      return <Finale dispatch={dispatch} testMode={state.testMode} />;
  }
}
