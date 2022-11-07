const played: Set<string> = new Set();
const sounds = Object.keys(import.meta.glob('../public/assets/*')).map(x => x.replace('../public', ''));

export function playSound() {
    if(played.size === sounds.length) played.clear();
    const available = sounds.filter(x => !played.has(x));
    const sound = available[Math.floor((Math.random() * available.length))];
    played.add(sound);
    new Audio(sound).play();
}