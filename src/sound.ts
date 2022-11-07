const played: Set<string> = new Set();
const paths = Object.keys(import.meta.glob("../public/assets/*"));

let initiated = false;
let sounds = [];

export function initiateSounds() {
  if (initiated) return;

  sounds = paths
    .map((x) => x.replace("../public", ""))
    .map((x) => ({
      name: x,
      audio: new Audio(x),
    }));
  initiated = true;
}

export function playSound() {
  if (played.size === sounds.length) played.clear();
  const available = sounds.filter((x) => !played.has(x.name));
  const sound = available[Math.floor(Math.random() * available.length)];
  played.add(sound.name);
  sound.audio.play();
}
