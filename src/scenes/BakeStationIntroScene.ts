import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { LO1_STATION_STORY, type MentorStoryAction } from '../data/stories';
import { StoryController } from '../story/StoryController';
import { CharacterController } from '../systems/CharacterController';
import { cameraFadeIn, slideIn } from '../systems/CinematicTransitions';
import { DialogueBox } from '../systems/DialogueSystem';
import { bgDecor, fadeToScene, makeChip, makePanel } from '../ui/UiFactory';

export class BakeStationIntroScene extends Phaser.Scene {
  constructor() {
    super('BakeStationIntro');
  }

  create(): void {
    bgDecor(this);
    void cameraFadeIn(this, 240);
    makeChip(this, GAME_W / 2, 70, 'LO1 · PREPARE BAKERY PRODUCTS', C.primary, HEX.white, 14);
    this.add
      .text(GAME_W / 2, 116, 'From lesson book to baking station', {
        fontFamily: FONT,
        fontSize: '30px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0.5);

    const station = this.add.container(GAME_W / 2, 328);
    const g = this.add.graphics();
    g.fillStyle(C.ink, 0.12).fillRoundedRect(-380, 86, 760, 78, 18);
    g.fillStyle(C.crust, 0.85).fillRoundedRect(-390, 72, 780, 74, 18);
    g.lineStyle(3, C.crustDark, 0.75).strokeRoundedRect(-390, 72, 780, 74, 18);
    g.fillStyle(C.card, 1).fillEllipse(-72, 32, 210, 78);
    g.lineStyle(4, C.blue, 0.9).strokeEllipse(-72, 32, 210, 78);
    g.fillStyle(C.wheat, 0.9).fillEllipse(-72, 24, 145, 42);
    station.add(g);
    makePanel(this, 1024, 318, 238, 250, C.cardWarm, 22);
    this.add.text(1024, 246, 'WORKSTATION', { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: HEX.primaryDark }).setOrigin(0.5);
    ['Ingredients', 'Equipment', 'Method'].forEach((label, index) => {
      this.add.circle(954, 290 + index * 45, 8, [C.gold, C.blue, C.green][index]);
      this.add.text(976, 290 + index * 45, label, { fontFamily: FONT, fontSize: '17px', color: HEX.ink }).setOrigin(0, 0.5);
    });
    void slideIn(this, station, -700, 420);

    const mentor = new CharacterController(this, { x: 252, y: 344, name: 'Mentor Mara', texture: 'mentor', color: C.primary });
    mentor.container.setDepth(20);
    const dialogue = new DialogueBox(this);
    const story = new StoryController<MentorStoryAction>(this, LO1_STATION_STORY, dialogue, async (action) => {
      if (action === 'mentor-happy') await mentor.celebrate();
      else mentor.syncDialogue(action === 'mentor-talk');
    });
    story.play(() => fadeToScene(this, 'Challenge'));
  }
}

