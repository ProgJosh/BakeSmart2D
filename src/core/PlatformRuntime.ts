import Phaser from 'phaser';

export function installPlatformRuntime(game: Phaser.Game): () => void {
  const orientationOverlay = document.getElementById('orientation-lock');
  const orientationQuery = window.matchMedia('(orientation: portrait)');
  let pageHidden = document.visibilityState === 'hidden';
  let pageHiding = false;
  let pausedByRuntime = false;
  let resizeFrame = 0;

  const isPortrait = (): boolean => orientationQuery.matches && window.innerHeight > window.innerWidth;

  const syncRuntimeState = (): void => {
    const portrait = isPortrait();
    if (orientationOverlay) {
      orientationOverlay.hidden = !portrait;
      orientationOverlay.setAttribute('aria-hidden', String(!portrait));
    }

    const shouldPause = portrait || pageHidden || pageHiding;
    if (shouldPause && !pausedByRuntime) {
      game.loop.sleep();
      pausedByRuntime = true;
    } else if (!shouldPause && pausedByRuntime) {
      game.loop.wake();
      pausedByRuntime = false;
    }

    if (!shouldPause) game.scale.refresh();
  };

  const scheduleSync = (): void => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(syncRuntimeState);
  };
  const onVisibilityChange = (): void => {
    pageHidden = document.visibilityState === 'hidden';
    if (!pageHidden) pageHiding = false;
    syncRuntimeState();
  };
  const onPageHide = (): void => {
    pageHiding = true;
    syncRuntimeState();
  };
  const onPageShow = (): void => {
    pageHiding = false;
    pageHidden = document.visibilityState === 'hidden';
    syncRuntimeState();
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', scheduleSync, { passive: true });
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  orientationQuery.addEventListener('change', scheduleSync);

  const dispose = (): void => {
    window.cancelAnimationFrame(resizeFrame);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('resize', scheduleSync);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    orientationQuery.removeEventListener('change', scheduleSync);
  };

  game.events.once('destroy', dispose);
  syncRuntimeState();
  return dispose;
}
