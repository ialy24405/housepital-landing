/* ═══════════════════════════════════════════════════════════════════════════════
   TextScramble - High-tech cyberpunk character-scrambling transitions
   ═══════════════════════════════════════════════════════════════════════════════ */

export function runTextScramble(el, duration = 1200) {
  if (!el) return;
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const targetText = el.innerText;
  const queue = [];
  
  for (let i = 0; i < targetText.length; i++) {
    const to = targetText[i];
    const start = Math.floor(Math.random() * 30);
    const end = start + Math.floor(Math.random() * 30);
    queue.push({ to, start, end, char: '' });
  }
  
  const startTime = performance.now();
  
  function update(time) {
    let output = '';
    let completeCount = 0;
    
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const progress = (time - startTime) / duration;
      
      if (progress >= 1) {
        output += item.to;
        completeCount++;
      } else {
        const charProgress = Math.min(Math.max((progress * 100 - item.start) / (item.end - item.start), 0), 1);
        if (charProgress === 1) {
          output += item.to;
          completeCount++;
        } else if (charProgress > 0) {
          if (Math.random() < 0.3) {
            item.char = chars[Math.floor(Math.random() * chars.length)];
          }
          // Highlight scrambling characters in purple
          output += `<span class="scramble-char" style="color: var(--color-purple); font-family: monospace;">${item.char}</span>`;
        } else {
          output += '';
        }
      }
    }
    
    el.innerHTML = output;
    
    if (completeCount < queue.length) {
      requestAnimationFrame(update);
    } else {
      el.innerHTML = targetText;
    }
  }
  
  requestAnimationFrame(update);
}
