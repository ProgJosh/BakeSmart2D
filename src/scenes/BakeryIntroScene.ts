import Phaser from 'phaser';
import { C, FONT, GAME_W, HEX } from '../core/theme';
import { BAKERY_INTRO_STORY, type MentorStoryAction } from '../data/stories';
import { StoryController } from '../story/StoryController';
import { CharacterController } from '../systems/CharacterController';
import { cameraFadeIn } from '../systems/CinematicTransitions';
import { DialogueBox } from '../systems/DialogueSystem';
import { bgDecor, fadeToScene, makeChip, makePanel } from '../ui/UiFactory';

export class BakeryIntroScene extends Phaser.Scene {
  constructor() {
    super('BakeryIntro');
  }

  create(): void {
    bgDecor(this);
    void cameraFadeIn(this, 280);

    makeChip(this, GAME_W / 2, 72, 'OPENING · THE BAKESMART2D BAKERY', C.wheat, HEX.ink, 14);
    this.add
      .text(GAME_W / 2, 118, 'Knowledge meets the worktable', {
        fontFamily: FONT,
        fontSize: '32px',
        fontStyle: 'bold',
        color: HEX.ink
      })
      .setOrigin(0.5);

    makePanel(this, 730, 324, 920, 310, C.cardWarm, 28);
    this.drawBakeryStation();

    const mentor = new CharacterController(this, {
      x: -120,
      y: 334,
      name: 'Mentor Mara',
      texture: 'mentor',
      color: C.primary,
      animations: {
        idle: 'mentor_idle',
        walk: 'mentor_walk',
        talk: 'mentor_talk',
        happy: 'mentor_happy'
      }
    });
    mentor.container.setDepth(20);

    const dialogue = new DialogueBox(this);
    const story = new StoryController<MentorStoryAction>(this, BAKERY_INTRO_STORY, dialogue, async (action) => {
      if (action === 'mentor-enter') await mentor.moveTo(278, 350, 720);
      else if (action === 'mentor-talk') mentor.syncDialogue(true);
      else if (action === 'mentor-idle') mentor.syncDialogue(false);
      else await mentor.celebrate();
    });
    story.play(() => fadeToScene(this, 'LearnHub'));
  }

  private drawBakeryStation(): void {
    const g = this.add.graphics();
    g.fillStyle(C.wheatDark, 0.55).fillRoundedRect(450, 380, 710, 72, 18);
    g.fillStyle(C.crust, 0.8).fillRoundedRect(465, 394, 680, 52, 14);
    g.lineStyle(3, C.crustDark, 0.7).strokeRoundedRect(450, 380, 710, 72, 18);

    g.fillStyle(C.blue, 0.42).fillRoundedRect(910, 192, 190, 182, 20);
    g.fillStyle(C.ink, 0.78).fillRoundedRect(938, 226, 134, 100, 14);
    g.fillStyle(C.gold, 0.72).fillCircle(958, 344, 8);
    g.fillStyle(C.gold, 0.72).fillCircle(985, 344, 8);
    g.fillStyle(C.gold, 0.72).fillCircle(1012, 344, 8);

    g.fillStyle(C.card, 1).fillEllipse(650, 352, 185, 65);
    g.lineStyle(4, C.blue, 0.8).strokeEllipse(650, 352, 185, 65);
    g.fillStyle(C.wheat, 0.85).fillEllipse(650, 344, 130, 38);

    ['INGREDIENTS', 'TECHNIQUES', 'OVEN CONTROL'].forEach((label, index) => {
      this.add
        .text(510 + index * 205, 272, label, { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: HEX.primaryDark })
        .setOrigin(0.5);
      this.add.circle(510 + index * 205, 310, 22, [C.wheat, C.primary, C.gold][index], 0.9);
    });
  }
}

