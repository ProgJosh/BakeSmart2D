import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { GS, type ActivityResult } from '../core/GameState';
import { LO1_REVEAL_STORY, type MentorStoryAction } from '../data/stories';
import { StoryController } from '../story/StoryController';
import { BakingSequencer, type BakingSequenceStep } from '../systems/BakingSequencer';
import { CharacterController } from '../systems/CharacterController';
import { cameraFadeIn } from '../systems/CinematicTransitions';
import { DialogueBox } from '../systems/DialogueSystem';
import { flourDust } from '../systems/ParticleEffects';
import { revealProduct } from '../systems/ProductReveal';
import { bgDecor, fadeToScene, makeButton, makeChip, makePanel } from '../ui/UiFactory';

interface RevealData {
  result?: ActivityResult;
}

export class LO1RevealScene extends Phaser.Scene {
  private result: ActivityResult | null = null;
  private sequencer?: BakingSequencer;
  private finished = false;

  constructor() {
    super('LO1Reveal');
  }

  init(data: RevealData): void {
    this.result = data.result ?? GS.lastResult;
    this.finished = false;
  }

  create(): void {
    if (!this.result) {
      fadeToScene(this, 'LearnHub');
      return;
    }

    bgDecor(this);
    void cameraFadeIn(this, 240);
    makeChip(this, GAME_W / 2, 64, 'LO1 · BAKING SIMULATION', C.primary, HEX.white, 14);
    this.add
      .text(GAME_W / 2, 106, 'From measured ingredients to finished product', {
        fontFamily: FONT,
        fontSize: '27px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0.5);
    makePanel(this, GAME_W / 2, 374, 1120, 480, C.cardWarm, 28);

    const instruction = this.add
      .text(GAME_W / 2, 148, 'Preparing the station…', { fontFamily: FONT, fontSize: '18px', color: HEX.inkSoft })
      .setOrigin(0.5);
    const ingredient = this.makeIngredient(250, 330);
    const bowl = this.makeBowl(500, 405);
    const mixer = this.makeWhisk(500, 310);
    const tray = this.makeTray(700, 425);
    const oven = this.makeOven(1015, 350);
    const product = this.makeProduct(1015, 350).setVisible(false);

    this.sequencer = new BakingSequencer(this)
      .register('ingredient', ingredient)
      .register('mixer', mixer)
      .register('tray', tray)
      .register('product', product);

    makeButton(this, 1130, 104, 196, 52, 'SKIP ANIMATION', () => this.skipToReveal(product, oven, instruction), {
      variant: 'secondary',
      fontSize: 15,
      radius: 26,
      once: true
    });

    const steps: BakingSequenceStep[] = [
      { type: 'action', run: () => instruction.setText('Adding the selected ingredients') },
      { type: 'move', target: 'ingredient', x: 475, y: 335, angle: -18, scale: 0.88, duration: 520 },
      { type: 'audio', cue: 'ingredientDrop' },
      { type: 'action', run: () => flourDust(this, 500, 365, 8) },
      { type: 'move', target: 'ingredient', alpha: 0, duration: 210 },
      { type: 'action', run: () => instruction.setText('Mixing into a uniform dough') },
      { type: 'audio', cue: 'mixing' },
      { type: 'move', target: 'mixer', angle: 130, duration: 340, ease: 'Sine.inOut' },
      { type: 'move', target: 'mixer', angle: 260, duration: 340, ease: 'Sine.inOut' },
      { type: 'move', target: 'mixer', angle: 360, duration: 300, ease: 'Sine.inOut' },
      { type: 'action', run: () => bowl.setScale(1.04) },
      { type: 'action', run: () => instruction.setText('Moving the tray into the preheated oven') },
      { type: 'action', run: () => this.setOvenStatus(oven, 'PREHEATED') },
      { type: 'action', run: () => this.animateOvenDoor(oven, true) },
      { type: 'move', target: 'tray', x: 965, y: 378, scale: 0.74, duration: 620 },
      { type: 'audio', cue: 'oven' },
      { type: 'action', run: () => this.animateOvenDoor(oven, false) },
      { type: 'action', run: () => this.setOvenStatus(oven, 'BAKING…') },
      { type: 'wait', duration: 520 },
      { type: 'action', run: () => instruction.setText('Bake complete — opening the oven') },
      { type: 'action', run: () => this.setOvenStatus(oven, 'COMPLETE') },
      { type: 'action', run: () => this.animateOvenDoor(oven, true) },
      { type: 'move', target: 'tray', alpha: 0, duration: 180 },
      { type: 'action', run: () => product.setVisible(true).setPosition(820, 370) }
    ];

    void this.sequencer.run(steps).then((completed) => {
      if (completed) void this.finishReveal(product, instruction);
    });
  }

  private skipToReveal(
    product: Phaser.GameObjects.Container,
    oven: Phaser.GameObjects.Container,
    instruction: Phaser.GameObjects.Text
  ): void {
    if (this.finished) return;
    this.sequencer?.cancel();
    const door = oven.getData('door') as Phaser.GameObjects.Container | undefined;
    door?.setScale(1, 0.18).setY(110);
    this.setOvenStatus(oven, 'COMPLETE');
    product.setVisible(true).setPosition(820, 370);
    this.time.delayedCall(80, () => void this.finishReveal(product, instruction));
  }

  private async finishReveal(product: Phaser.GameObjects.Container, instruction: Phaser.GameObjects.Text): Promise<void> {
    if (this.finished) return;
    this.finished = true;
    instruction.setText('Finished product ready for feedback');
    await revealProduct(this, product, { steam: true });
    if (!this.sys.isActive()) return;

    const productCard = this.add.container(820, 515).setAlpha(0);
    const card = this.add.graphics();
    card.fillStyle(C.card, 0.96).fillRoundedRect(-165, -32, 330, 64, 18);
    card.lineStyle(2, C.wheatDark, 1).strokeRoundedRect(-165, -32, 330, 64, 18);
    const label = this.add
      .text(0, 0, 'FINISHED BAKERY PRODUCT', { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: HEX.primaryDark })
      .setOrigin(0.5);
    productCard.add([card, label]);
    this.tweens.add({ targets: productCard, alpha: 1, y: 505, duration: 260, ease: 'Back.out' });

    const mentor = new CharacterController(this, { x: 250, y: 388, name: 'Mentor Mara', texture: 'mentor', color: C.primary });
    mentor.container.setDepth(25);
    const dialogue = new DialogueBox(this);
    const story = new StoryController<MentorStoryAction>(this, LO1_REVEAL_STORY, dialogue, async (action) => {
      if (action === 'mentor-happy') await mentor.celebrate();
      else mentor.syncDialogue(action === 'mentor-talk');
    });
    story.play(() => fadeToScene(this, 'Result', { result: this.result as ActivityResult }));
  }

  private makeIngredient(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(C.wheat, 1).fillRoundedRect(-54, -65, 108, 130, 18);
    g.lineStyle(3, C.crustDark, 0.7).strokeRoundedRect(-54, -65, 108, 130, 18);
    g.fillStyle(C.cardWarm, 1).fillRoundedRect(-40, -18, 80, 48, 12);
    const label = this.add.text(0, 6, 'FLOUR', { fontFamily: FONT, fontSize: '17px', fontStyle: 'bold', color: HEX.ink }).setOrigin(0.5);
    container.add([g, label]);
    return container;
  }

  private makeBowl(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(C.blue, 0.95).fillEllipse(0, 0, 230, 92);
    g.fillStyle(C.card, 1).fillEllipse(0, -12, 210, 62);
    g.fillStyle(C.wheat, 0.95).fillEllipse(0, -8, 150, 40);
    g.lineStyle(4, C.blue, 1).strokeEllipse(0, 0, 230, 92);
    container.add(g);
    return container;
  }

  private makeWhisk(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.lineStyle(7, C.inkSoft, 1).lineBetween(0, -72, 0, 25);
    g.lineStyle(3, C.inkSoft, 0.9).strokeEllipse(0, 45, 52, 68);
    container.add(g);
    return container;
  }

  private makeTray(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(C.inkSoft, 0.9).fillRoundedRect(-110, -35, 220, 70, 12);
    g.fillStyle(C.card, 0.75).fillRoundedRect(-98, -24, 196, 48, 9);
    [-60, 0, 60].forEach((offset) => g.fillStyle(C.wheatDark, 1).fillCircle(offset, 0, 22));
    container.add(g);
    return container;
  }

  private makeOven(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(C.blue, 0.7).fillRoundedRect(-125, -150, 250, 300, 24);
    g.lineStyle(4, C.inkSoft, 0.7).strokeRoundedRect(-125, -150, 250, 300, 24);
    g.fillStyle(C.gold, 0.44).fillRoundedRect(-78, -66, 156, 118, 12);
    [-70, -25, 20, 65].forEach((offset) => g.fillStyle(C.gold, 0.9).fillCircle(offset, 104, 9));
    const door = this.add.container(0, 0);
    const doorGraphic = this.add.graphics();
    doorGraphic.fillStyle(C.ink, 0.82).fillRoundedRect(-94, -82, 188, 150, 16);
    doorGraphic.fillStyle(C.blue, 0.3).fillRoundedRect(-76, -64, 152, 112, 12);
    doorGraphic.lineStyle(3, C.inkSoft, 0.9).strokeRoundedRect(-94, -82, 188, 150, 16);
    door.add(doorGraphic);
    const status = this.add
      .text(0, -120, 'READY', { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: HEX.white })
      .setOrigin(0.5);
    container.add([g, door, status]);
    container.setData('door', door);
    container.setData('status', status);
    return container;
  }

  private setOvenStatus(oven: Phaser.GameObjects.Container, label: string): void {
    const status = oven.getData('status') as Phaser.GameObjects.Text | undefined;
    status?.setText(label);
  }

  private animateOvenDoor(oven: Phaser.GameObjects.Container, open: boolean): Promise<void> {
    const door = oven.getData('door') as Phaser.GameObjects.Container | undefined;
    if (!door) return Promise.resolve();
    return new Promise((resolve) => {
      this.tweens.add({
        targets: door,
        scaleY: open ? 0.18 : 1,
        y: open ? 110 : 0,
        duration: 280,
        ease: 'Sine.inOut',
        onComplete: () => resolve()
      });
    });
  }

  private makeProduct(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setDepth(30);
    const g = this.add.graphics();
    g.fillStyle(C.crustDark, 1).fillEllipse(0, 10, 230, 122);
    g.fillStyle(C.crust, 1).fillEllipse(0, -2, 214, 102);
    g.lineStyle(6, C.crustDark, 0.75);
    [-48, 0, 48].forEach((offset) => g.lineBetween(offset - 15, -36, offset + 15, 12));
    container.add(g);
    return container;
  }
}
