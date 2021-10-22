/**
 * @typedef {Object} Item
 * @property {number} id
 * @property {string} title
 * @property {string} title_en
 * @property {string} image
 * @property {number} rarity
 */

/**
 * Return random number in range {min - max}
 * 
 * @param {number} min
 * @param {number} max
 * @return {number}
 */

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let finish = false;

async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();
  return data;
};

////////////////////////////////////////////////////////////////////////////

const INITIAL_TIME = 8000;

function spin(elapsed) {
  const itemsWrap = document.getElementById('itemsWrap');
  const speedMultiplier = 1.5;
  let x = elapsed * speedMultiplier;
  if (x > 8400) {
    const multiplier = Math.floor(x / 8400);
    x -= 8400 * multiplier;
  }
  itemsWrap.style.transform = `translateX(-${x}px)`;
}

function spinFromTo(from, to, duration, easing) {
  const itemsWrap = document.getElementById('itemsWrap');
  itemsWrap.animate([
    { transform: `translateX(-${from}px)` }, 
    { transform: `translateX(-${to}px)` }
  ], { 
    duration,
    easing
  });
  itemsWrap.style.transform = `translateX(-${to}px)`;
}

/**
 * Create card item element and return it
 *
 * @param {number} winnerId
 * @param {Item[]} items
 * @param {number} elapsed
 * @param {Item[]} originalItems
 */
function winnerPickSpin(winnerId, items, elapsed) {
  const indexOfWinner = items.findIndex(i => i.id == winnerId);
  const itemsWrap = document.getElementById('itemsWrap');
  const winnerCenterPosition = indexOfWinner * 240 + 600;
  const currentX = parseInt(itemsWrap.style.transform.match(/(\d+)/)[0]);
  if (winnerCenterPosition > currentX && winnerCenterPosition - currentX < 2400) {
    console.log('Stopping on winner now...');
    const duration = 2000;
    const randomWinnerPosition = winnerCenterPosition + randomIntFromInterval(-120, 120);
    spinFromTo(currentX, randomWinnerPosition, 2000, 'ease-out');
    setTimeout(() => {
      spinFromTo(randomWinnerPosition, winnerCenterPosition, 1000, 'ease-in-out');
      setTimeout(() => {
        renderStatus('finish');
      }, 1000);
    }, duration + 500);
    finish = true;
  } else {
    spin(elapsed);
  }

}

/**
 * Create card item element and return it
 *
 * @param {number} winnerId
 * @param {Item[]} items
 * @param {Item[]} originalItems
 */
function initializeSpin(winnerId, items) {
  let start = performance.now();
  function animate(timestamp) {
    const elapsed = timestamp - start > 0 ? timestamp - start : 1;
    if (elapsed < INITIAL_TIME) {
      spin(elapsed);
    } else {
      winnerPickSpin(winnerId, items, elapsed)
    }
    if (!finish) {
      window.requestAnimationFrame(animate);
    }
  }
  window.requestAnimationFrame(animate);
}


/**
 * Create card item element and return it
 *
 * @param {Item[]} visualItems
 * @param {Item[]} originalItems
 */
function renderCarousel(visualItems, originalItems) {
  const wrap = document.getElementById('carousel');
  const itemsWrap = document.createElement('div');
  itemsWrap.className = 'itemsWrap';
  itemsWrap.id = 'itemsWrap';
  visualItems.forEach(item => {
    itemsWrap.append(createItem(item, true));
  });
  wrap.append(itemsWrap);

  const winner = originalItems[Math.floor(Math.random() * originalItems.length)];
  console.log(`winner is ${winner.title_en}`);
  initializeSpin(winner.id, originalItems);
}

////////////////////////////////////////////////////////////////////////////

/**
 * Render status
 *
 * @param {('initial' | 'finish')} phase
 */

function renderStatus(phase) {
  const wrap = document.getElementById('status');
  if (phase == 'initial') {
    const h1 = document.createElement('h1');
    h1.textContent = 'Opening cases(see console for winner)🤔';
    wrap.append(h1);
  }
  if (phase == 'finish') {
    const h1 = wrap.firstChild;
    h1.textContent = 'Case is open!🥳'
  }
}

/**
 * A simplified and dumbed down version of ggdrop item color pallete
 *
 * @param {number} rarity - Item rarity
 * @return {string} Item rarity string representation
 */
function parseRarity(rarity) {
  if (rarity < 5) {
    return 'default';
  }
  if (rarity < 10) {
    return 'rare';
  }
  if (rarity < 15) {
    return 'epic';
  }
  return 'default';
}

/**
 * Create card item element and return it
 *
 * @param {Item} itemEl - Case item
 * @return {HTMLDivElement} Item card element
 */
function createItem(itemEl, horizontal = false) {
  const div = document.createElement('div');
  div.className = 'card';

  const item = document.createElement('div');
  item.className = `item item--${horizontal ? 'horizontal' : 'vertical'} item--${horizontal ? 'horizontal' : 'vertical'}--${parseRarity(itemEl.rarity)} item--${parseRarity(itemEl.rarity)}`;
  div.append(item);

  const elements = [];

  const [bigTitle, littleTitle] = itemEl.title_en.split(' | ');

  const bigTitleElement = document.createElement('p');
  bigTitleElement.textContent = bigTitle;
  bigTitleElement.className = 'bigTitle';
  elements.push(bigTitleElement);

  const littleTitleElement = document.createElement('p');
  littleTitleElement.textContent = littleTitle;
  elements.push(littleTitleElement);

  const img = document.createElement('img');
  img.src = `https://community.cloudflare.steamstatic.com/economy/image/${itemEl.image}`
  elements.push(img);

  elements.forEach(el => item.append(el));
  return div;
}

/**
 * Render small item cards for preview
 *
 * @param {Item[]} items - Case items
 */

function renderItems(items) {
  const caseItemsDIV = document.getElementById('caseItems');
  items.forEach(item => {
    caseItemsDIV.append(createItem(item));
  });
}

async function init() {
  const { data } = await loadData();
  const { items } = data;
  const visualItems = [...items.slice(items.length - 4), ...items, ...items.slice(0, 4)]
  renderCarousel(visualItems, items);
  renderStatus('initial');
  renderItems(items);
}

init();
