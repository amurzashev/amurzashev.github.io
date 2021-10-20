let ITEMS = null;
let CAROUSEL_ITEMS = null;
let FINISHED = false;
const CAROUSEL = document.getElementById('carousel');

const loadItems = async () => {
  const response = await fetch('data.json');
  const { data } = await response.json();
  ITEMS = data.items;
  CAROUSEL_ITEMS = [...ITEMS.slice(ITEMS.length - 4), ...ITEMS, ...ITEMS.slice(0, 4)];
};

const drawCarousel = () => {
  const wrap = document.createElement('div');
  wrap.style.width = `fit-content`;
  wrap.style.display = 'flex';
  CAROUSEL_ITEMS.forEach(item => {
    const cardWrap = document.createElement('div');
    cardWrap.style.width = '240px';
    const card = document.createElement('div');
    card.className = 'item item--horizontal';
    card.style.background = 'darkgray';
    const p = document.createElement('p');
    p.textContent = item.title_en;
    card.append(p);
    cardWrap.append(card);
    wrap.append(cardWrap);
  });
  CAROUSEL.append(wrap);
};

const init = async () => {
 await loadItems();
 drawCarousel();
};

init();
