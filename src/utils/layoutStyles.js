// Shared layout styles for consistent UI across all pages
export const pageBackground = {
  minHeight: '100vh',
  bgcolor: 'background.default',
  backgroundImage: (t) =>
    t.palette.mode === 'dark'
      ? 'repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.1) 0, rgba(148, 163, 184, 0.1) 1px, transparent 1px, transparent 26px), repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.1) 0, rgba(148, 163, 184, 0.1) 1px, transparent 1px, transparent 26px), radial-gradient(circle at 18% 12%, rgba(30, 41, 59, 0.45), transparent 58%), linear-gradient(180deg, #0f172a 0%, #162033 100%)'
      : 'repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.12) 0, rgba(148, 163, 184, 0.12) 1px, transparent 1px, transparent 26px), repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.12) 0, rgba(148, 163, 184, 0.12) 1px, transparent 1px, transparent 26px), radial-gradient(circle at 18% 12%, rgba(15, 23, 42, 0.08), transparent 45%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
  backgroundSize: '26px 26px, 26px 26px, 100% 100%, 100% 100%',
  backgroundPosition: '0 0, 0 0, center, center',
  backgroundAttachment: 'scroll, scroll, fixed, fixed',
  backgroundRepeat: 'repeat, repeat, no-repeat, no-repeat',
};
