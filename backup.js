const VERTICAL_ITEM_WIDTH = 240;
const CONTAINER_WIDTH = 960;

function getProgress(elapsed, total) {
  return Math.min(elapsed / total, 1);
}

function easeOut(progress) {
  return Math.pow(--progress, 5) + 1;
}

function updateItems() {

}

function initialSpin() {

}

function winnerPickSpin() {

}

class Animate {
  constructor(items) {
    this.wrap = document.getElementById('itemsWrap');
    this.items = items;
  }
  updateItems(x) {
    console.log(`total items width: ${this.items.length * VERTICAL_ITEM_WIDTH}`);
    console.log(`items off screen: ${Math.ceil(x / VERTICAL_ITEM_WIDTH)}`);
    // const newArr = [...this.items, ...this.items.slice(0, Math.ceil(x / VERTICAL_ITEM_WIDTH))];
    // renderCarousel(newArr);
  }
  initialSpin(x) {
    this.wrap.style.transform = `translateX(-${x}px)`;
  }
  winnerPickSpin() {
  }
}

function initScroll(items, winnerId) {
  const initialTime = 1000;
  const winnerPickTime = 3000;
  const totalTime = initialTime + winnerPickTime;
  let start = performance.now();
  const wrap = document.getElementById('itemsWrap');
  const itemsAnimation = new Animate(items);
  function animate(now) {
    const elapsed = now - start;
    const progress =  getProgress(elapsed, initialTime);
    const easing = easeOut(progress);
    const x = progress * initialTime;
    if (elapsed < initialTime) {
      itemsAnimation.initialSpin(x);
    } else {
      itemsAnimation.winnerPickSpin();
    }
    if (elapsed < totalTime) {
      itemsAnimation.updateItems(x);
      window.requestAnimationFrame(animate);
    } else {
      renderStatus('finish');
    }
  }
  window.requestAnimationFrame(animate);
}

/**
 * Render carousel
 *
 * @param {Item[]} items
 */

function renderCarousel(items) {
  const carousel = document.getElementById('carousel');
  const itemsWrap = document.createElement('div');
  itemsWrap.id = 'itemsWrap';
  itemsWrap.className = 'itemsWrap';
  items.forEach(item => {
    itemsWrap.append(createItem(item, true));
  });
  carousel.append(itemsWrap);
  const winner = items[Math.floor(Math.random() * items.length)];
  initScroll(items, winner.id);
}