// Motion primitives — barrel export. Site-specific subset (no R3F deps).
export { default as TextReveal } from "./TextReveal";
export { default as MagneticButton } from "./MagneticButton";
export { default as CardTiltLayer } from "./CardTiltLayer";
export { default as Marquee } from "./Marquee";
export { default as StickyScrollSection } from "./StickyScrollSection";
export { default as NumberCounter } from "./NumberCounter";
export { default as ImageRevealMask } from "./ImageRevealMask";
export { default as ScrollProgress } from "./ScrollProgress";
export { default as CursorFollower } from "./CursorFollower";
export { default as FadeUp, StaggerChildren } from "./FadeUp";

// Wave 2a additions
export { default as LiquidHover } from "./LiquidHover";
export { default as GlassCursorHighlight } from "./GlassCursorHighlight";
export { default as TextScramble } from "./TextScramble";

// Wave 2a+ premium accents
export { default as BurnTransition } from "./BurnTransition";
export { default as Jitter } from "./Jitter";

// Chrome/cinematic atmosphere
export { default as FilmGrain } from "./FilmGrain";
export { default as Vignette } from "./Vignette";
export { default as ScrollSectionDots } from "./ScrollSectionDots";
export { default as LoadingScreen } from "./LoadingScreen";
export { default as ScrollHint } from "./ScrollHint";
export { default as CornerBadge } from "./CornerBadge";

// Wave 3 — entrance staging + ambient canvas
export { default as EntranceSequencer } from "./EntranceSequencer";
export { default as CanvasAtmosphere } from "./CanvasAtmosphere";

// Wave 4 — scroll choreography
export { default as PinnedHorizontalSlideshow } from "./PinnedHorizontalSlideshow";
export type { SlideshowItem } from "./PinnedHorizontalSlideshow";
export { default as StackedCardPeel } from "./StackedCardPeel";
export type { PeelCard } from "./StackedCardPeel";
export { default as FullscreenSequential } from "./FullscreenSequential";
export type { SequentialItem } from "./FullscreenSequential";
export { default as HorizontalScrollTrack } from "./HorizontalScrollTrack";
export type { TrackItem } from "./HorizontalScrollTrack";
export { default as FlipCard } from "./FlipCard";

// Hero scroll text
export { default as HeroScrollText } from "./HeroScrollText";
export type { HeroChapter } from "./HeroScrollText";
