import { Storage } from '../utils/Storage';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
}

export interface RunStats {
  score: number;
  gatesPassed: number;
  runNumber: number;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first-flight', title: 'First Flight', description: 'Launch your first neon run.' },
  { id: 'neon-rookie', title: 'Neon Rookie', description: 'Reach score 5.' },
  { id: 'gate-runner', title: 'Gate Runner', description: 'Reach score 15.' },
  { id: 'cyber-ace', title: 'Cyber Ace', description: 'Reach score 30.' },
  { id: 'untouchable', title: 'Untouchable', description: 'Pass 10 gates in one run without collision.' },
  { id: 'persistent', title: 'Persistent', description: 'Play 10 runs.' },
  { id: 'comeback', title: 'Comeback', description: 'Restart after death 5 times.' },
];

export class AchievementManager {
  private static readonly unlockedKey = 'achievements';

  static getUnlocked(): Set<string> {
    return new Set(Storage.getStringArray(this.unlockedKey));
  }

  static isUnlocked(id: string): boolean {
    return this.getUnlocked().has(id);
  }

  static unlock(id: string): boolean {
    const unlocked = this.getUnlocked();
    if (unlocked.has(id)) return false;
    unlocked.add(id);
    Storage.setStringArray(this.unlockedKey, [...unlocked]);
    return true;
  }

  static evaluateRun(stats: RunStats): AchievementDefinition[] {
    const newlyUnlocked: AchievementDefinition[] = [];
    const check = (id: string, condition: boolean) => {
      if (condition && this.unlock(id)) {
        const achievement = ACHIEVEMENTS.find((item) => item.id === id);
        if (achievement) newlyUnlocked.push(achievement);
      }
    };

    check('first-flight', stats.runNumber >= 1);
    check('neon-rookie', stats.score >= 5);
    check('gate-runner', stats.score >= 15);
    check('cyber-ace', stats.score >= 30);
    check('untouchable', stats.gatesPassed >= 10);
    check('persistent', stats.runNumber >= 10);
    check('comeback', Storage.getNumber('restartsAfterDeath', 0) >= 5);

    return newlyUnlocked;
  }
}
