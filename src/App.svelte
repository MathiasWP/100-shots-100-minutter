<script lang="ts">
  import { initiateSounds, playSound } from "./sound";

  let round = 0;
  let seconds = 0;
  let counting = false;
  let weight = 75;
  let gender: "male" | "female" = "male";

  $: bac =
    (round * (0.4 * 4.7 * 0.8)) / (weight * (gender === "male" ? 0.68 : 0.55)) -
    0.15 * Math.floor(round / 60);

  function animationInterval(ms: number, callback: any) {
    const start = document.timeline
      ? document.timeline.currentTime
      : performance.now();

    function frame(time: number) {
      if (!counting) return;
      callback(time);
      scheduleFrame(time);
    }

    function scheduleFrame(time: number) {
      const elapsed = time - start;
      const roundedElapsed = Math.round(elapsed / ms) * ms;
      const targetNext = start + roundedElapsed + ms;
      const delay = targetNext - performance.now();
      setTimeout(() => requestAnimationFrame(frame), delay);
    }

    scheduleFrame(start);
  }

  function start() {
    if (counting) return;
    counting = true;
    if (round === 100) round = 0;
    animationInterval(1000, () => seconds++);
    initiateSounds()
  }

  function onKeyPress(e: KeyboardEvent) {
    if (e.key === " ") start();
  }

  $: {
    if (seconds > 60) {
      seconds = 0;
      round++;
      playSound();
      if (round === 100) {
        counting = false;
      }
    }
  }
</script>

<svelte:window on:keypress={onKeyPress} />

<h1>
  {#if round === 100}
    Ferdig 🎉
  {:else}
    Neste shot: {Math.abs(60 - seconds)}s
  {/if}
</h1>
<section class="game">
  <p>
    <b>Runde:</b>
    {round}
  </p>
  <p>
    <b>Liter drukket:</b>
    {round * 0.04}L
  </p>
  <p>
    <strong>Kjønn:</strong>
    <select bind:value={gender}>
      <option value="male">Mann</option>
      <option value="female">Kvinne</option>
    </select>
  </p>
  <p>
    <strong>Vekt:</strong>
    <select bind:value={weight}>
      {#each new Array(20).fill(0).map((_, i) => i * 5 + 40) as amount (amount)}
        <option value={amount}>
          {amount}kg
        </option>
      {/each}
    </select>
  </p>
  <p>
    <b>Estimert promille :</b>
    {bac.toFixed(2)}
  </p>
  {#if !counting}
    <button on:click={start}>
      Start {#if round === 100}på nytt{/if}
    </button>
  {/if}
</section>

<div style:height="{(seconds * 100) / 60}%" class="seconds" />
