/**
 * @typedef {Object} Item
 * @property {number} id
 * @property {string} title
 * @property {string} title_en
 * @property {string} image
 * @property {number} rarity
 */

async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();
  return data;
};

////////////////////////////////////////////////////////////////////////////


const INITIAL_TIME = 10000;
const WINNER_PICK_TIME = 3000;
const TOTAL_TIME = INITIAL_TIME + WINNER_PICK_TIME;

function initialSpin(elapsed) {
  const itemsWrap = document.getElementById('itemsWrap');
  const speedMultiplier = 1.5;
  let x = elapsed * speedMultiplier;
  if (x > 8400) {
    const multiplier = Math.floor(x / 8400);
    x -= 8400 * multiplier;
  }
  itemsWrap.style.transform = `translateX(-${x}px)`;
}

function winnerPickSpin() {
  // console.log('winner')
}

/**
 * Create card item element and return it
 *
 * @param {number} winnerId
 */
function initializeSpin(winnerId) {
  let start = performance.now();
  function animate(timestamp) {
    const elapsed = timestamp - start > 0 ? timestamp - start : 1;
    if (elapsed < INITIAL_TIME) {
      initialSpin(elapsed);
    }
    if (elapsed > INITIAL_TIME && elapsed < TOTAL_TIME) {
      winnerPickSpin();
    }
    if (elapsed < TOTAL_TIME) {
      window.requestAnimationFrame(animate);
    } else {
      console.log('finish');
    }
  }
  window.requestAnimationFrame(animate);
}


/**
 * Create card item element and return it
 *
 * @param {Item[]} items
 */
function renderCarousel(items) {
  const wrap = document.getElementById('carousel');
  const itemsWrap = document.createElement('div');
  itemsWrap.className = 'itemsWrap';
  itemsWrap.id = 'itemsWrap';
  items.forEach(item => {
    itemsWrap.append(createItem(item, true));
  });
  wrap.append(itemsWrap);

  const winner = items[Math.floor(Math.random() * items.length)];
  initializeSpin(winner.id);
}


////////////////////////////////////////////////////////////////////////////

/**
 * Render status
 *
 * @param {('initial' | 'finish')} phase
 */

function renderStatus(phase) {
  const wrap = document.getElementById('status');
  const h1 = document.createElement('h1');
  if (phase == 'initial') {
    h1.textContent = 'Opening cases...';
  }
  if (phase == 'finish') {
    wrap.removeChild(wrap.firstChild);
  }
  wrap.append(h1);
}

/**
 * Parses rarity number into human readable string
 *
 * @param {Number} rarity - Item rarity
 * @return {String} Item rarity string representation
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
  item.className = `item item--${horizontal ? 'horizontal' : 'vertical  '} item--${parseRarity(itemEl.rarity)}`;
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
  const list = [...items.slice(items.length - 4), ...items, ...items.slice(0, 4)]
  renderCarousel(list);
  renderStatus('initial');
  renderItems(items);
}

init();
