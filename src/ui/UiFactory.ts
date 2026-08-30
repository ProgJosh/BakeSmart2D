import Phaser from 'phaser';
import { C, FONT, GAME_W, GAME_H, HEX } from '../core/theme';

export interface UIButton extends Phaser.GameObjects.Container {
  setEnabled(v: boolean): void;
}

export interface UIOptionTile extends Phaser.GameObjects.Container {
  setSelected(v: boolean): void;
  setEnabled(v: boolean): void;
}

type Variant = 'primary' | 'secondary' | 'flat' | 'danger';

export function bgDecor(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillGradientStyle(C.pageWarm, C.pageWarm, C.page, C.wheat, 1);
  g.fillRect(0, 0, GAME_W, GAME_H);

  // Lightweight original bakery interior: an awning, soft wall ornaments,
  // and a wooden worktop. It deliberately stays behind scene content.
  g.fillStyle(C.cardWarm, 0.94).fillRect(0, 0, GAME_W, 52);
  for (let x = -28, stripe = 0; x < GAME_W + 36; x += 72, stripe++) {
    g.fillStyle(stripe % 2 === 0 ? C.primary : C.wheat, 0.72).fillTriangle(x, 0, x + 42, 0, x + 22, 52);
  }
  g.fillStyle(C.wheat, 0.3).fillCircle(-64, 170, 220);
  g.fillStyle(C.peach, 0.25).fillCircle(GAME_W + 55, 185, 250);
  g.fillStyle(C.card, 0.54).fillRoundedRect(60, 92, 146, 118, 24);
  g.fillStyle(C.card, 0.54).fillRoundedRect(GAME_W - 206, 92, 146, 118, 24);
  g.lineStyle(3, C.wheatDark, 0.28).strokeRoundedRect(60, 92, 146, 118, 24);
  g.lineStyle(3, C.wheatDark, 0.28).strokeRoundedRect(GAME_W - 206, 92, 146, 118, 24);
  g.fillStyle(C.gold, 0.26).fillCircle(133, 151, 30);
  g.fillStyle(C.green, 0.2).fillCircle(GAME_W - 133, 151, 30);
  g.fillStyle(C.crustDark, 0.2).fillRect(0, GAME_H - 62, GAME_W, 62);
  g.fillStyle(C.crust, 0.38).fillRect(0, GAME_H - 62, GAME_W, 8);
  for (let x = 0; x < GAME_W; x += 74) {
    g.lineStyle(1, C.cocoa, 0.12).lineBetween(x, GAME_H - 54, x + 50, GAME_H);
  }
}

export function makePanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: number = C.card,
  radius = 22
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(C.ink, 0.12).fillRoundedRect(x - w / 2 + 5, y - h / 2 + 9, w, h, radius);
  g.fillStyle(C.wheat, 0.45).fillRoundedRect(x - w / 2 + 2, y - h / 2 + 3, w, h, radius);
  g.fillStyle(fill, 1).fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);
  g.lineStyle(2, C.wheatDark, 0.86).strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius);
  g.lineStyle(2, 0xffffff, 0.62).lineBetween(x - w / 2 + radius, y - h / 2 + 3, x + w / 2 - radius, y - h / 2 + 3);
  return g;
}

export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  onPress: () => void,
  opts: { variant?: Variant; fontSize?: number; radius?: number } = {}
): UIButton {
  const variant = opts.variant ?? 'secondary';
  const cont = scene.add.container(x, y);
  const g = scene.add.graphics();
  const txt = scene.add
    .text(0, 0, label, {
      fontFamily: FONT,
      fontSize: `${opts.fontSize ?? 22}px`,
      fontStyle: 'bold',
      color: variant === 'primary' || variant === 'danger' ? HEX.white : HEX.ink
    })
    .setOrigin(0.5);
  let enabled = true;
  const r = Math.min(opts.radius ?? 16, h / 2);
  const paint = () => {
    g.clear();
    const fill =
      variant === 'primary' ? C.primary : variant === 'danger' ? C.red : variant === 'flat' ? C.wheat : C.card;
    const edge = variant === 'primary' ? C.primaryDark : variant === 'danger' ? 0x9c4638 : C.wheatDark;
    g.fillStyle(C.ink, 0.15).fillRoundedRect(-w / 2 + 3, -h / 2 + 7, w, h, r);
    g.fillStyle(C.wheat, variant === 'primary' ? 0.34 : 0.5).fillRoundedRect(-w / 2 + 1, -h / 2 + 3, w, h, r);
    g.fillStyle(fill, 1).fillRoundedRect(-w / 2, -h / 2, w, h, r);
    g.lineStyle(2, edge, 0.95).strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    g.lineStyle(2, 0xffffff, variant === 'primary' ? 0.3 : 0.72).lineBetween(-w / 2 + r, -h / 2 + 3, w / 2 - r, -h / 2 + 3);
  };
  const zone = scene.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
  zone.on('pointerdown', () => {
    if (!enabled) return;
    cont.setScale(0.97);
    txt.y = 1;
  });
  zone.on('pointerout', () => {
    cont.setScale(1);
    txt.y = 0;
  });
  zone.on('pointerup', () => {
    if (!enabled) return;
    cont.setScale(1);
    txt.y = 0;
    onPress();
  });
  paint();
  cont.add([g, txt, zone]);
  (cont as UIButton).setEnabled = (v: boolean) => {
    enabled = v;
    g.alpha = v ? 1 : 0.5;
    txt.alpha = v ? 1 : 0.55;
    if (v) zone.setInteractive({ useHandCursor: true });
    else zone.disableInteractive();
  };
  return cont as UIButton;
}

export function makeOptionTile(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  onPress: () => void,
  opts: { desc?: string; fontSize?: number } = {}
): UIOptionTile {
  const cont = scene.add.container(x, y);
  const g = scene.add.graphics();
  const fs = opts.fontSize ?? 20;
  const hasDesc = !!opts.desc;
  const titleTxt = scene.add
    .text(-w / 2 + 26, hasDesc ? -13 : 0, title, {
      fontFamily: FONT,
      fontSize: `${fs}px`,
      fontStyle: 'bold',
      color: HEX.ink,
      wordWrap: { width: w - 100 }
    })
    .setOrigin(0, 0.5);
  const parts: Phaser.GameObjects.GameObject[] = [titleTxt];
  if (hasDesc) {
    const descTxt = scene.add
      .text(-w / 2 + 26, 15, opts.desc ?? '', {
        fontFamily: FONT,
        fontSize: '14px',
        color: HEX.inkSoft,
        wordWrap: { width: w - 100 }
      })
      .setOrigin(0, 0.5);
    parts.push(descTxt);
  }
  let selected = false;
  let enabled = true;
  const paint = () => {
    g.clear();
    g.fillStyle(C.ink, 0.11).fillRoundedRect(-w / 2 + 3, -h / 2 + 7, w, h, 14);
    g.fillStyle(C.wheat, 0.42).fillRoundedRect(-w / 2 + 1, -h / 2 + 3, w, h, 14);
    g.fillStyle(selected ? 0xfff3dd : C.card, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    g.lineStyle(selected ? 4 : 2, selected ? C.primary : C.wheatDark, 0.95).strokeRoundedRect(
      -w / 2,
      -h / 2,
      w,
      h,
      14
    );
    const rx = w / 2 - 30;
    g.lineStyle(3, selected ? C.primary : C.wheatDark, selected ? 1 : 0.6).strokeCircle(rx, 0, 12);
    if (selected) {
      g.fillStyle(C.primary, 1).fillCircle(rx, 0, 12);
      g.lineStyle(3, 0xffffff, 1);
      g.beginPath();
      g.moveTo(rx - 5, 0);
      g.lineTo(rx - 1, 4);
      g.lineTo(rx + 5, -5);
      g.strokePath();
    }
  };
  const zone = scene.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
  zone.on('pointerup', () => {
    if (!enabled) return;
    onPress();
  });
  paint();
  cont.add([g, ...parts, zone]);
  (cont as UIOptionTile).setSelected = (v: boolean) => {
    selected = v;
    paint();
  };
  (cont as UIOptionTile).setEnabled = (v: boolean) => {
    enabled = v;
    g.alpha = v ? 1 : 0.45;
    if (v) zone.setInteractive({ useHandCursor: true });
    else zone.disableInteractive();
  };
  return cont as UIOptionTile;
}

export function makeChip(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  bg: number = C.wheat,
  color: string = HEX.ink,
  fontSize = 15
): Phaser.GameObjects.Container {
  const t = scene.add
    .text(0, 0, text, { fontFamily: FONT, fontSize: `${fontSize}px`, fontStyle: 'bold', color })
    .setOrigin(0.5);
  const w = t.width + 30;
  const h = 34;
  const g = scene.add.graphics();
  g.fillStyle(C.ink, 0.1).fillRoundedRect(-w / 2 + 2, -h / 2 + 3, w, h, h / 2);
  g.fillStyle(bg, 1).fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
  g.lineStyle(1, C.wheatDark, 0.75).strokeRoundedRect(-w / 2, -h / 2, w, h, h / 2);
  return scene.add.container(x, y, [g, t]);
}

export function makeDots(scene: Phaser.Scene, cx: number, y: number, total: number, current: number): void {
  if (total > 1) {
    scene.add.rectangle(cx, y, (total - 1) * 28, 3, C.wheatDark, 0.45).setOrigin(0.5);
  }
  for (let i = 0; i < total; i++) {
    const active = i === current;
    const done = i < current;
    scene.add.circle(cx + (i - (total - 1) / 2) * 28, y, active ? 8 : 6, done ? C.green : active ? C.gold : C.mutedStar);
  }
}

export function makeStars(scene: Phaser.Scene, cx: number, y: number, size: number, filled: number): void {
  for (let i = 0; i < 3; i++) {
    const s = scene.add.star(cx + (i - 1) * size * 2.4, y, 5, size * 0.5, size, i < filled ? C.gold : C.mutedStar);
    s.setStrokeStyle(2, 0xb99a55, 0.8);
  }
}

export function makeSectionLabel(scene: Phaser.Scene, x: number, y: number, label: string, color: number = C.primary): void {
  scene.add
    .text(x, y, label.toUpperCase(), { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: HEX.inkSoft })
    .setOrigin(0, 0.5)
    .setLetterSpacing(2);
  scene.add.rectangle(x + 12, y + 18, 74, 4, color, 0.95).setOrigin(0, 0.5);
}

export function fadeToScene(scene: Phaser.Scene, key: string, data?: Record<string, unknown>): void {
  scene.cameras.main.fadeOut(170, 43, 26, 15);
  scene.cameras.main.once('camerafadeoutcomplete', () => {
    scene.scene.start(key, data);
  });
}
