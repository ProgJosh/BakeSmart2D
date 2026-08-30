import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { bgDecor, makeButton, fadeToScene, makeChip, makePanel } from '../ui/UiFactory';
import { LO3_HANDLING, LO3_DESTS, LO3_PAIRS, LO3_PACKAGING } from '../data/challenges';
import { GS, type StageRecord } from '../core/GameState';

export class StoragePackScene extends Phaser.Scene {
  private records: StageRecord[] = [];
  private phase = 0;

  constructor() {
    super('StoragePack');
  }

  init(): void {
    this.records = [];
    this.phase = 0;
  }

  create(): void {
    this.renderPhase();
  }

  private clearAll(): void {
    this.children.removeAll(true);
  }

  private header(): void {
    const cx = GAME_W / 2;
    makeButton(this, 70, 82, 56, 56, '⟵', () => fadeToScene(this, 'LearnHub'), {
      variant: 'flat',
      fontSize: 28,
      radius: 28
    });
    makeChip(this, 150, 54, 'LO3 · Week 7', C.wheat, HEX.ink, 14);
    this.add
      .text(150, 96, 'Storage & Packaging', { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: HEX.ink })
      .setOrigin(0, 0.5);
    void cx;
  }

  private renderPhase(): void {
    this.clearAll();
    bgDecor(this);
    this.header();

    if (this.phase === 0) {
      this.renderMcq(LO3_HANDLING.prompt, LO3_HANDLING.options, LO3_HANDLING.fb, 'Handling',
        'Cool freshly baked goods on a wire rack first; sealing them hot or leaving them out harms quality and shelf life.',
        () => {
          this.phase = 1;
          this.renderPhase();
        });
    } else if (this.phase === 1) {
      this.renderMatching();
    } else {
      this.renderMcq(LO3_PACKAGING.prompt, LO3_PACKAGING.options, LO3_PACKAGING.fb, 'Packaging',
        'Choose sealed, labelled packaging — it protects quality and looks professional.',
        () => {
          const result = GS.finishActivity('LO3', 'LO3 storage & packaging complete', this.records);
          fadeToScene(this, 'Result', { result });
        });
    }
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

  private renderMcq(
    prompt: string,
    options: { text: string; correct: boolean }[],
    fb: string,
    label: string,
    hint: string,
    onDone: () => void
  ): void {
    const cx = GAME_W / 2;
    makePanel(this, cx, 410, 1060, 540);
    this.add
      .text(cx, 260, prompt, { fontFamily: FONT, fontSize: '22px', color: HEX.ink, wordWrap: { width: 980 }, align: 'center' })
      .setOrigin(0.5);

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
    options.forEach((opt, i) => {
      const y = 360 + i * (rowH + 14);
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
      const ok = pick !== undefined && options[pick].correct;
      this.records.push({ label, score: ok ? 100 : 0, max: 100, feedback: fb });
      onDone();
    }, { variant: 'primary', fontSize: 20, radius: 26 });

    this.renderHint(hint);
    this.add
      .text(cx, 700, `Hints left: ${GS.hintsLeft}`, { fontFamily: FONT, fontSize: '15px', color: HEX.inkSoft })
      .setOrigin(0.5);
  }

  private renderMatching(): void {
    const cx = GAME_W / 2;
    makePanel(this, cx, 400, 1060, 540);
    this.add
      .text(cx, 250, 'Match each product with the correct storage place.', {
        fontFamily: FONT,
        fontSize: '21px',
        color: HEX.ink,
        wordWrap: { width: 980 },
        align: 'center'
      })
      .setOrigin(0.5);

    const assignments: (number | null)[] = LO3_PAIRS.map(() => null);
    const selectedItem = { idx: -1 };

    const itemY = 320;
    const itemW = 360;
    const itemH = 66;
    const itemConts: Phaser.GameObjects.Container[] = [];
    LO3_PAIRS.forEach((pair, i) => {
      const x = cx - 320;
      const y = itemY + i * (itemH + 22);
      const cont = this.add.container(x, y);
      const g = this.add.graphics();
      const txt = this.add.text(-itemW / 2 + 18, 0, pair.item, { fontFamily: FONT, fontSize: '16px', color: HEX.ink, wordWrap: { width: itemW - 36 } }).setOrigin(0, 0.5);
      const paint = (on: boolean) => {
        g.clear();
        g.fillStyle(on ? 0xfff3dd : C.wheat, 1).fillRoundedRect(-itemW / 2, -itemH / 2, itemW, itemH, 14);
        g.lineStyle(on ? 4 : 2, on ? C.primary : C.wheatDark, 1).strokeRoundedRect(-itemW / 2, -itemH / 2, itemW, itemH, 14);
      };
      paint(false);
      const z = this.add.zone(0, 0, itemW, itemH).setInteractive({ useHandCursor: true });
      z.on('pointerup', () => {
        selectedItem.idx = i;
        itemConts.forEach((c, j) => paintItem(c, j === i));
      });
      cont.add([g, txt, z]);
      itemConts.push(cont);
      this.add.existing(cont);
    });

    const paintItem = (cont: Phaser.GameObjects.Container, on: boolean) => {
      const g = cont.list[0] as Phaser.GameObjects.Graphics;
      g.clear();
      g.fillStyle(on ? 0xfff3dd : C.wheat, 1).fillRoundedRect(-itemW / 2, -itemH / 2, itemW, itemH, 14);
      g.lineStyle(on ? 4 : 2, on ? C.primary : C.wheatDark, 1).strokeRoundedRect(-itemW / 2, -itemH / 2, itemW, itemH, 14);
    };

    const destW = 420;
    const destH = 90;
    const destConts: Phaser.GameObjects.Container[] = [];
    const destLabels: Phaser.GameObjects.Text[] = [];
    LO3_DESTS.forEach((dest, d) => {
      const x = cx + 240;
      const y = 330 + d * (destH + 18);
      const cont = this.add.container(x, y);
      const g = this.add.graphics();
      const title = this.add.text(-destW / 2 + 18, -destH / 2 + 16, dest, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: HEX.ink, wordWrap: { width: destW - 36 } }).setOrigin(0, 0);
      const label = this.add.text(0, destH / 2 - 22, '', { fontFamily: FONT, fontSize: '15px', color: HEX.primaryDark, wordWrap: { width: destW - 36 } }).setOrigin(0.5);
      destLabels.push(label);
      const paint = (on: boolean) => {
        g.clear();
        g.fillStyle(C.ink, 0.06).fillRoundedRect(-destW / 2 + 3, -destH / 2 + 4, destW, destH, 14);
        g.fillStyle(C.card, 1).fillRoundedRect(-destW / 2, -destH / 2, destW, destH, 14);
        g.lineStyle(on ? 4 : 2, on ? C.primary : C.wheatDark, 1).strokeRoundedRect(-destW / 2, -destH / 2, destW, destH, 14);
      };
      paint(false);
      const z = this.add.zone(0, 0, destW, destH).setInteractive({ useHandCursor: true });
      z.on('pointerup', () => {
        if (selectedItem.idx < 0) return;
        assignments[selectedItem.idx] = d;
        selectedItem.idx = -1;
        itemConts.forEach((c) => paintItem(c, false));
        destLabels.forEach((l, j) => {
          const itemIdx = assignments.indexOf(j);
          l.setText(itemIdx >= 0 ? LO3_PAIRS[itemIdx].item : '');
        });
      });
      cont.add([g, title, label, z]);
      destConts.push(cont);
      this.add.existing(cont);
    });
    void destConts;

    makeButton(this, cx, 668, 240, 52, 'SUBMIT', () => {
      const correct = assignments.filter((d, i) => d !== null && LO3_DESTS[d!] === LO3_PAIRS[i].dest).length;
      const score = Math.round((correct / LO3_PAIRS.length) * 100);
      const fb =
        score === 100
          ? 'All products matched to the correct storage place, protecting quality and shelf life (Week 7).'
          : `Storage check: ${correct}/${LO3_PAIRS.length} matched correctly. Match each product to its right condition to protect shelf life.`;
      this.records.push({ label: 'Storage matching', score, max: 100, feedback: fb });
      this.phase = 2;
      this.renderPhase();
    }, { variant: 'primary', fontSize: 20, radius: 26 });

    this.renderHint('Match each product to the storage condition that keeps it fresh and safe the longest.');
    this.add
      .text(cx, 700, `Hints left: ${GS.hintsLeft}`, { fontFamily: FONT, fontSize: '15px', color: HEX.inkSoft })
      .setOrigin(0.5);
  }
}
