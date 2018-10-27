var ideasArray = [];

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



window.onload = function () {
  if (localStorage.getItem('ideas')) {
    ideasArray = JSON.parse(localStorage.getItem('ideas'));
    let topTenIdeas = ideasArray.filter((idea, index) => {
      return index >= ideasArray.length - 10;
    })
    topTenIdeas.forEach(eachObj => addCardToDOM(eachObj));
    ideasArray = ideasArray.map(eachObj => eachObj = new Idea(eachObj.id, eachObj.title, eachObj.body, eachObj.quality));
  }
}

function showAll() {
  ideasArray.forEach(e => addCardToDOM(e));
  return 'Show Less';
}
function showLess() {
  const topTenIdeas = ideasArray.filter((idea, index) => {
    return index >= ideasArray.length - 10;
  })
  topTenIdeas.forEach(eachObj => addCardToDOM(eachObj));
  return 'Show More';
}
function showMore(e) {
  const showMoreButton = e.target;
  get('.card-area').innerHTML = '';
  showMoreButton.innerText = showMoreButton.innerText === 'Show More' ? showAll() : showLess();
  return (true);
}

//turn all into functions inside this
get('body').addEventListener('click', function (event) {
  event.preventDefault();
  console.log(event.target.closest('.show-more-or-less') ? showMore(event) : 'do nothing');


  if (event.target.classList.contains('delete')) {
    var id = event.target.closest('.card').dataset.id;
    var index = returnIndexOfIdeaByID(id);
    //delete from local storage and data model
    ideasArray[index].deleteFromStorage(index, ideasArray);
    //delete from dom
    event.target.closest('.card').remove();
  }

  //need to relook at this logic
  if (event.target.closest('.card')) {
    var id = event.target.closest('.card').dataset.id;
    event.target.onblur = event => saveUserEdits(id);
  }

  if (event.target.classList.contains('upvote')) {
    const id = event.target.closest('.card').dataset.id;
    const index = returnIndexOfIdeaByID(id);
    const qualityIndex = ideasArray[index].updateQuality('up', ideasArray);
    const qualityArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
    event.target.nextElementSibling.innerText = `${qualityArray[qualityIndex]}`;
  }

  if (event.target.classList.contains('downvote')) {
    const id = event.target.closest('.card').dataset.id;
    const index = returnIndexOfIdeaByID(id);
    const qualityIndex = ideasArray[index].updateQuality('down', ideasArray);
    const qualityArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
    event.target.nextElementSibling.nextElementSibling.innerText = `${qualityArray[qualityIndex]}`;
  }

  if (event.target.closest('.filter-quality')) {
    sortCards(event);
  }

  if (event.target.classList.contains('save')) {
    if (ideasArray.length !== 0) {
      var nextId = ideasArray[ideasArray.length - 1].id + 1
    } else {
      var nextId = 0;
    }
    var title = get('#title-input').value;
    var body = get('#body-input').value;
    var newIdea = new Idea(nextId, title, body);
    newIdea.saveToStorage(ideasArray, true);
    addCardToDOM(newIdea);
    clearInput();
  }
});

get('body').addEventListener('keyup', function (event) {
  if (event.key === 'Enter' && event.target.closest('.card') !== null) {
    saveUserEdits(event.target.closest('.card').dataset.id);
  }
  searchCards(event);
})

function saveUserEdits(id) {
  var cardTitle = get(`.card[data-id='${id}'] .card-title`).innerText;
  var cardBody = get(`.card[data-id='${id}'] .card-body`).innerText;
  var index = returnIndexOfIdeaByID(id);
  ideasArray[index].updateSelf(cardTitle, cardBody, ideasArray, index);
  event.target.blur();
}

function get(element) {
  return document.querySelector(element);
}

function clearInput() {
  get('#title-input').value = null;
  get('#body-input').value = null;
}

function addCardToDOM(idea) {
  var newCard = document.createElement('article');
  let qualityArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
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
    <span class="quality">${qualityArray[idea.quality]}</span>
    <img src="images/delete.svg" alt="delete" class="delete svg">
  </div>`;
  get('.card-area').prepend(newCard);
}

function sortCards(e) {
  e.preventDefault();
  var clickedButton = e.target;
  var clickedButtonQuality = e.target.dataset.quality;
  let id, index;
  if (clickedButtonQuality !== 'all qualities') {
    document.querySelectorAll('.quality').forEach(function (span) {
      id = span.closest('.card').dataset.id;
      index = returnIndexOfIdeaByID(id);
      if (parseInt(clickedButtonQuality) === ideasArray[index].quality) {
        span.closest('.card').classList.remove('hidden');
      } else {
        span.closest('.card').classList.add('hidden');
      }
    });
  } else {
    document.querySelectorAll('.quality').forEach(function (span) {
      span.closest('.card').classList.remove('hidden');
    });
  }

  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = false;
  });

  clickedButton.disabled = true;
}

function searchCards(event) {
  if (event.target.id === 'search') {
    get('.unfilter-button').disabled = false;
    get('.unfilter-button').click();
    document.querySelectorAll('.searchable').forEach(elem => {
      if (!elem.innerText.includes(event.target.value)) {
        elem.closest('.card').classList.add('hidden');
      }
    });
  }
}

function returnIndexOfIdeaByID(inID) {
  return ideasArray.findIndex(obj => obj.id === parseInt(inID));
}