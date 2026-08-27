import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, makeButton, fadeToScene, makeChip, makePanel } from '../ui/UiFactory';
import {
  LO2_TOPPINGS,
  LO2_REQ_BY_DIFFICULTY,
  LO2_PRESENTATION
} from '../data/challenges';
import { GS, type StageRecord } from '../core/GameState';

export class DecorateScene extends Phaser.Scene {
  private selectedTopping = 0;
  private placements: { color: number; kind: number }[] = [];
  private records: StageRecord[] = [];

  constructor() {
    super('Decorate');
  }

  init(): void {
    this.selectedTopping = 0;
    this.placements = [];
    this.records = [];
  }

  create(): void {
    this.renderDecorate();
  }

  private clearAll(): void {
    this.children.removeAll(true);
  }

  private renderDecorate(): void {
    this.clearAll();
    bgDecor(this);
    const cx = GAME_W / 2;
    const req = LO2_REQ_BY_DIFFICULTY[GS.difficulty];

    makeButton(this, 70, 82, 56, 56, '⟵', () => fadeToScene(this, 'LearnHub'), {
      variant: 'flat',
      fontSize: 28,
      radius: 28
    });
    makeChip(this, 150, 54, 'LO2 · Week 6', C.wheat, HEX.ink, 14);
    this.add
      .text(150, 92, 'Decoration Activity', { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: HEX.ink })
      .setOrigin(0, 0.5);
    this.add
      .text(150, 124, 'Decorate the product with toppings', { fontFamily: FONT, fontSize: '16px', color: HEX.inkSoft })
      .setOrigin(0, 0.5);

    const panelTop = 150;
    const panelBottom = 690;
    const panelH = panelBottom - panelTop;
    const panelY = (panelTop + panelBottom) / 2;
    makePanel(this, cx, panelY, 1060, panelH);

    this.add
      .text(cx, 190, 'Tap a topping to select it, then tap the product to place it.', {
        fontFamily: FONT,
        fontSize: '19px',
        color: HEX.primaryDark,
        wordWrap: { width: 980 },
        align: 'center'
      })
      .setOrigin(0.5);

    const px = cx;
    const py = 372;
    const pw = 380;
    const ph = 226;
    const prod = this.add.graphics();
    prod.fillStyle(C.ink, 0.08).fillRoundedRect(px - pw / 2 + 4, py - ph / 2 + 6, pw, ph, 40);
    prod.fillStyle(0xf3d9a8, 1).fillRoundedRect(px - pw / 2, py - ph / 2, pw, ph, 40);
    prod.fillStyle(0xe7b873, 1).fillEllipse(px, py - ph / 2 + 20, pw - 40, 60);
    prod.lineStyle(3, C.crustDark, 0.6).strokeRoundedRect(px - pw / 2, py - ph / 2, pw, ph, 40);

    const placedLayer = this.add.container(0, 0);

    const statusText = this.add
      .text(cx, 508, '', { fontFamily: FONT, fontSize: '16px', color: HEX.inkSoft })
      .setOrigin(0.5);
    const updateStatus = () => {
      const kinds = new Set(this.placements.map((p) => p.kind)).size;
      statusText.setText(
        `Toppings placed: ${this.placements.length} / ${req.count}   ·   Different kinds: ${kinds} / ${req.kinds}`
      );
    };
    updateStatus();

    const zone = this.add.zone(px, py, pw, ph).setInteractive({ useHandCursor: true });
    zone.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const lx = pointer.worldX - (px - pw / 2);
      const ly = pointer.worldY - (py - ph / 2);
      if (lx < 0 || ly < 0 || lx > pw || ly > ph) return;
      const topping = LO2_TOPPINGS[this.selectedTopping];
      const dot = this.add.circle(px - pw / 2 + lx, py - ph / 2 + ly, 9, topping.color);
      dot.setStrokeStyle(2, 0x000000, 0.15);
      placedLayer.add(dot);
      this.placements.push({ color: topping.color, kind: this.selectedTopping });
      updateStatus();
    });

    this.add
      .text(cx, 540, 'TOPPINGS', { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: HEX.inkSoft })
      .setOrigin(0.5)
      .setLetterSpacing(2);

    const paletteY = 580;
    const startX = cx - (LO2_TOPPINGS.length - 1) * 95;
    LO2_TOPPINGS.forEach((t, i) => {
      const x = startX + i * 190;
      const cont = this.add.container(x, paletteY);
      const g = this.add.graphics();
      const paint = (on: boolean) => {
        g.clear();
        g.fillStyle(on ? 0xfff3dd : C.card, 1).fillRoundedRect(-80, -26, 160, 52, 14);
        g.lineStyle(on ? 4 : 2, on ? C.primary : C.wheatDark, 1).strokeRoundedRect(-80, -26, 160, 52, 14);
      };
      paint(i === this.selectedTopping);
      const swatch = this.add.circle(-54, 0, 12, t.color).setStrokeStyle(2, 0x000000, 0.15);
      const label = this.add.text(-34, 0, t.name, { fontFamily: FONT, fontSize: '14px', color: HEX.ink, wordWrap: { width: 100 } }).setOrigin(0, 0.5);
      const z = this.add.zone(0, 0, 160, 52).setInteractive({ useHandCursor: true });
      z.on('pointerup', () => {
        this.selectedTopping = i;
        palettePaint();
      });
      cont.add([g, swatch, label, z]);
      cont.setData('palette', i);
      this.add.existing(cont);
    });

    const palettePaint = () => {
      this.children.list.forEach((o) => {
        if (o instanceof Phaser.GameObjects.Container && o.getData('palette') !== undefined) {
          const idx = o.getData('palette') as number;
          const gfx = o.list[0] as Phaser.GameObjects.Graphics;
          gfx.clear();
          gfx.fillStyle(idx === this.selectedTopping ? 0xfff3dd : C.card, 1).fillRoundedRect(-80, -26, 160, 52, 14);
          gfx.lineStyle(idx === this.selectedTopping ? 4 : 2, idx === this.selectedTopping ? C.primary : C.wheatDark, 1).strokeRoundedRect(-80, -26, 160, 52, 14);
        }
      });
    };

    makeButton(this, cx, 654, 280, 54, 'SUBMIT DECORATION', () => {
      const count = this.placements.length;
      const kinds = new Set(this.placements.map((p) => p.kind)).size;
      const score = (count >= req.count ? 50 : 0) + (kinds >= req.kinds ? 50 : 0);
      const fb =
        score === 100
          ? 'Good decoration: enough toppings and a variety of kinds for visual appeal (Week 6).'
          : `Decoration needs work: use at least ${req.count} toppings and ${req.kinds} different kinds for a balanced look.`;
      this.records.push({ label: 'Decoration', score, max: 100, feedback: fb });
      this.renderPresent();
    }, { variant: 'primary', fontSize: 20, radius: 27 });

    this.renderHint(`Use at least ${req.count} toppings and ${req.kinds} different kinds so the product looks balanced and appealing.`);
    this.add
      .text(cx, 700, `Hints left: ${GS.hintsLeft}`, { fontFamily: FONT, fontSize: '15px', color: HEX.inkSoft })
      .setOrigin(0.5);
  }

  private renderHint(hint: string): void {
    const cx = GAME_W / 2;
    const hintText = this.add
      .text(cx, 292, '', { fontFamily: FONT, fontSize: '15px', color: HEX.primaryDark, wordWrap: { width: 900 }, align: 'center', fontStyle: 'italic' })
      .setOrigin(0.5);
    const hintBtn = makeButton(this, GAME_W - 120, 112, 200, 40, 'SHOW HINT', () => {
      if (GS.spendHint()) {
        hintText.setText(hint);
        hintBtn.setVisible(false);
      }
    }, { variant: 'secondary', fontSize: 15, radius: 20 });
  }

  private renderPresent(): void {
    this.clearAll();
    bgDecor(this);
    const cx = GAME_W / 2;
    makeButton(this, 70, 82, 56, 56, '⟵', () => fadeToScene(this, 'LearnHub'), {
      variant: 'flat',
      fontSize: 28,
      radius: 28
    });
    makeChip(this, 150, 54, 'LO2 · Week 6', C.wheat, HEX.ink, 14);
    this.add.text(150, 96, 'Presentation', { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: HEX.ink }).setOrigin(0, 0.5);

    makePanel(this, cx, 410, 1060, 540);
    this.add
      .text(cx, 260, LO2_PRESENTATION.prompt, { fontFamily: FONT, fontSize: '22px', color: HEX.ink, wordWrap: { width: 980 }, align: 'center' })
      .setOrigin(0.5);

    const opts = LO2_PRESENTATION.options;
    const w = 820;
    const rowH = 64;
    const chosen = new Set<number>();
    const conts: Phaser.GameObjects.Container[] = [];
    const paintRow = (cont: Phaser.GameObjects.Container, on: boolean) => {
      const g = cont.list[0] as Phaser.GameObjects.Graphics;
      g.clear();
      g.fillStyle(C.ink, 0.06).fillRoundedRect(-w / 2 + 3, -rowH / 2 + 4, w, rowH, 12);
      g.fillStyle(on ? 0xfff3dd : C.card, 1).fillRoundedRect(-w / 2, -rowH / 2, w, rowH, 12);
      g.lineStyle(on ? 3 : 2, on ? C.primary : C.wheatDark, 1).strokeRoundedRect(-w / 2, -rowH / 2, w, rowH, 12);
      g.lineStyle(3, on ? C.primary : C.wheatDark, 1).strokeCircle(w / 2 - 30, 0, 13);
      if (on) {
        g.fillStyle(C.primary, 1).fillCircle(w / 2 - 30, 0, 13);
        g.lineStyle(3, 0xffffff, 1);
        g.beginPath();
        g.moveTo(w / 2 - 35, 0);
        g.lineTo(w / 2 - 31, 4);
        g.lineTo(w / 2 - 25, -5);
        g.strokePath();
      }
    };
    opts.forEach((opt, i) => {
      const y = 340 + i * (rowH + 12);
      const cont = this.add.container(cx, y);
      const g = this.add.graphics();
      const txt = this.add.text(-w / 2 + 24, 0, opt.text, { fontFamily: FONT, fontSize: '18px', color: HEX.ink, wordWrap: { width: w - 70 } }).setOrigin(0, 0.5);
      const z = this.add.zone(0, 0, w, rowH).setInteractive({ useHandCursor: true });
      z.on('pointerup', () => {
        chosen.clear();
        chosen.add(i);
        conts.forEach((c, j) => paintRow(c, chosen.has(j)));
      });
      cont.add([g, txt, z]);
      paintRow(cont, false);
      conts.push(cont);
      this.add.existing(cont);
    });

    makeButton(this, cx, 660, 240, 52, 'SUBMIT', () => {
      const pick = [...chosen][0];
      const ok = pick !== undefined && opts[pick].correct;
      this.records.push({
        label: 'Presentation',
        score: ok ? 100 : 0,
        max: 100,
        feedback: LO2_PRESENTATION.fb
      });
      const result = GS.finishActivity('LO2', 'LO2 decoration activity complete', this.records);
      fadeToScene(this, 'Result', { result });
    }, { variant: 'primary', fontSize: 20, radius: 26 });

    this.renderHint('Arrange items neatly on a clean plate — a tidy, even layout looks professional.');
    this.add
      .text(cx, 700, `Hints left: ${GS.hintsLeft}`, { fontFamily: FONT, fontSize: '15px', color: HEX.inkSoft })
      .setOrigin(0.5);
  }
}
