export interface FireBooster {
  timeLeft: number;
  flameMultiplier: number;
  flameIncrement: number;
}
export function areSameFireboosters(fb1: FireBooster, fb2: FireBooster) {
  return (
    fb1.timeLeft === fb2.timeLeft &&
    fb1.flameIncrement === fb2.flameIncrement &&
    fb1.flameMultiplier === fb2.flameMultiplier
  );
}
