let ideasArray = [];

function generateIdeasArray(num) {
  for (var i = 0; i < (num || 50); i++) {
    var newIdea = new Idea(i, `title ${i}`, `body ${i}`);
    if (i % 13 === 0) {
      newIdea.updateQuality('up');
    } else if (i % 7) {
      newIdea.updateQuality('up');
      newIdea.updateQuality('up');
    }
    ideasArray.push(newIdea);
  }
  newIdea.saveToStorage(ideasArray);
}
// generateIdeasArray();
//IGNORE ABOVE IT IS FOR GENERATING TEST CARDS//

window.onload = () => localStorage.getItem('ideas') && loadFromStorage();

get('body').addEventListener('click', (event) => {
  event.preventDefault();
  event.target.closest('.card') && saveCardEditOnBlur(event);
  event.target.closest('.filter-quality') && sortCards(event);
  event.target.closest('.show-more-or-less') && showMoreOrLess(event);
  event.target.classList.contains('delete') && deleteCard(event);
  event.target.classList.contains('downvote') && downvoteCard(event);
  event.target.classList.contains('save') && saveNewCard(event);
  event.target.classList.contains('upvote') && upvoteCard(event);
});

get('body').addEventListener('keyup', (event) => {
  event.key === 'Enter' && event.target.closest('.card') !== null &&
    saveUserEdits(event.target.closest('.card').dataset.id);
  event.target.id === 'search' && searchCards(event);
})

function addCardToDOM(idea) {
  const newCard = document.createElement('article');
  const qArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
  newCard.dataset.id = idea.id;
  newCard.classList.add('card');
  newCard.innerHTML =
    `<span class="searchable">
    <h2 class="card-title editable" contenteditable="true">
      ${idea.title}
    </h2>
    <p class="card-body editable" contenteditable="true">
      ${idea.body}
    </p>
  </span>
  <div class="card-footer">
    <img src="images/downvote.svg" alt="downvote" class="downvote svg">
    <img src="images/upvote.svg" alt="upvote" class="upvote svg">
    <span class="quality">${qArray[idea.quality]}</span>
    <img src="images/delete.svg" alt="delete" class="delete svg">
  </div>`;
  get('.card-area').prepend(newCard);
}

function clearInput() {
  get('#title-input').value = null;
  get('#body-input').value = null;
}

function deleteCard(event) {
  const id = event.target.closest('.card').dataset.id;
  const index = returnIndexOfIdeaByID(id);
  ideasArray[index].deleteFromStorage(index, ideasArray);
  event.target.closest('.card').remove();
}

function downvoteCard(event) {
  const qualityTextElem = event.target.nextElementSibling.nextElementSibling;
  const id = event.target.closest('.card').dataset.id;
  const index = returnIndexOfIdeaByID(id);
  const qualityIndex = ideasArray[index].updateQuality('down', ideasArray);
  const qArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
  qualityTextElem.innerText = `${qArray[qualityIndex]}`;
}

function get(element) {
  return document.querySelector(element);
}

function getAll(element) {
  return document.querySelectorAll(element);
}

function loadFromStorage() {
  ideasArray = JSON.parse(localStorage.getItem('ideas'));
  ideasArray = ideasArray.map(idea => {
    return idea = new Idea(idea.id, idea.title, idea.body, idea.quality);
  });
  showTen();
}

function removeCardsFromDOM() {
  get('.card-area').innerHTML = '';
}

function returnIndexOfIdeaByID(inID) {
  return ideasArray.findIndex(obj => obj.id === parseInt(inID));
}

function saveCardEditOnBlur(event) {
  const id = event.target.closest('.card').dataset.id;
  event.target.onblur = event => saveUserEdits(id);
}

function saveNewCard(event) {
  let nextId;
  ideasArray.length !== 0 &&
    (nextId = ideasArray[ideasArray.length - 1].id + 1) || (nextId = 0);
  const title = get('#title-input').value;
  const body = get('#body-input').value;
  const newIdea = new Idea(nextId, title, body);
  newIdea.saveToStorage(ideasArray, true);
  addCardToDOM(newIdea);
  clearInput();
}

function saveUserEdits(id) {
  const cardTitle = get(`.card[data-id='${id}'] .card-title`).innerText;
  const cardBody = get(`.card[data-id='${id}'] .card-body`).innerText;
  const index = returnIndexOfIdeaByID(id);
  ideasArray[index].updateSelf(cardTitle, cardBody, ideasArray, index);
  event.target.blur();
}

function searchCards(event) {
  unfilterCards();
  removeCardsFromDOM();
  ideasArray.forEach(idea => addCardToDOM(idea));
  getAll('.searchable').forEach(elem => {
    !elem.innerText.includes(event.target.value) &&
      elem.closest('.card').remove();
  });
  event.target.value === '' && showTen();
  switchShowLessButton()
}

function showMore(e) {
  removeCardsFromDOM();
  ideasArray.forEach(idea => addCardToDOM(idea));
  e.target.remove();
  const newButton = document.createElement('button');
  newButton.classList.add('show-less-button');
  get('.show-more-or-less').append(newButton);
}

function showLess(e) {
  showTen();
  switchShowLessButton();
}

function showMoreOrLess(e) {
  e.target.classList.contains('show-more-button') && showMore(e);
  e.target.classList.contains('show-less-button') && showLess(e);
  return true;
}

function showSingleQuality(clickedButtonQuality) {
  removeCardsFromDOM();
  const filteredIdeas = ideasArray.filter(idea => {
    return idea.quality === parseInt(clickedButtonQuality);
  });
  filteredIdeas.forEach(idea => addCardToDOM(idea));
  switchShowLessButton()
  return true;
}

function showTen() {
  removeCardsFromDOM();
  const tenNewestIdeas = ideasArray.filter((idea, index) => {
    return index >= ideasArray.length - 10;
  })
  tenNewestIdeas.forEach(idea => addCardToDOM(idea));
}

function sortCards(event) {
  event.preventDefault();
  const clickedButtonQuality = event.target.dataset.quality;
  clickedButtonQuality !== 'all qualities' &&
    showSingleQuality(clickedButtonQuality) ||
    showTen();
  getAll('button').forEach(button => button.disabled = false);
  event.target.disabled = true;
}

function switchShowLessButton() {
  const newButton = document.createElement('button');
  newButton.classList.add('show-more-button');
  get('.show-more-or-less').innerHTML = '';
  get('.show-more-or-less').append(newButton);
}

function unfilterCards() {
  get('.unfilter-button').disabled = false;
  get('.unfilter-button').click();
}

function upvoteCard(event) {
  const qualityTextElem = event.target.nextElementSibling;
  const id = event.target.closest('.card').dataset.id;
  const index = returnIndexOfIdeaByID(id);
  const qualityIndex = ideasArray[index].updateQuality('up', ideasArray);
  const qArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
  qualityTextElem.innerText = `${qArray[qualityIndex]}`;
}