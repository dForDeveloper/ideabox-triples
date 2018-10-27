var ideasArray = [];

function generateIdeasArray() {
  for (var i = 0; i < 50; i++) {
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
    let topTenIdeas = ideasArray.filter((idea,index)=>{
      return index >= ideasArray.length -10;
    })
    topTenIdeas.forEach(eachObj => addCardToDOM(eachObj));
    ideasArray = ideasArray.map(eachObj => eachObj = new Idea(eachObj.id, eachObj.title, eachObj.body, eachObj.quality));
  }
}

get('body').addEventListener('click', function (event) {
  event.preventDefault();
  showMoreOrLess(event);
  deleteCard(event);
  saveCardEditOnBlur(event);
  upvoteCard(event);  
  downvoteCard(event);  
  if (event.target.closest('.filter-quality')) {
    sortCards(event);
  }
  if (event.target.classList.contains('save')) {
    saveNewCard(event);
  }
});

get('body').addEventListener('keyup', function (event) {
  if (event.key === 'Enter' && event.target.closest('.card') !== null) {
    saveUserEdits(event.target.closest('.card').dataset.id);
  }
  searchCards(event);
})

function showMoreOrLess(event) {
  if(event.target.classList.contains('show-more-button')) {
    event.target.classList.value = 'show-less-button';
    get('.card-area').innerHTML = '';
    ideasArray.forEach(eachObj => addCardToDOM(eachObj));
  } else if (event.target.classList.contains('show-less-button')) {
    event.target.classList.value = 'show-more-button';
    get('.card-area').innerHTML = '';
    let TenIdeas = ideasArray.filter((idea, index) => index >= ideasArray.length - 10);
    TenIdeas.forEach(eachObj => addCardToDOM(eachObj));
  }
}

function deleteCard(event) {
  if (event.target.classList.contains('delete')) {
    var id = event.target.closest('.card').dataset.id;
    var index = returnIndexOfIdeaByID(id);
    ideasArray[index].deleteFromStorage(index, ideasArray);
    event.target.closest('.card').remove();
  }
}

function saveCardEditOnBlur(event) {
  if (event.target.closest('.card')) {
    var id = event.target.closest('.card').dataset.id;
    event.target.onblur = event => saveUserEdits(id);
  }
}

function upvoteCard(event) {
  if (event.target.classList.contains('upvote')) {
    const id = event.target.closest('.card').dataset.id;
    const index = returnIndexOfIdeaByID(id);
    const qualityIndex = ideasArray[index].updateQuality('up', ideasArray);
    const qualityArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
    event.target.nextElementSibling.innerText = `${qualityArray[qualityIndex]}`;
  }
}

function downvoteCard(event) {
  if (event.target.classList.contains('downvote')) {
    const id = event.target.closest('.card').dataset.id;
    const index = returnIndexOfIdeaByID(id);
    const qualityIndex = ideasArray[index].updateQuality('down', ideasArray);
    const qualityArray = ['Quality: Swill', 'Quality: Plausible', 'Quality: Genius'];
    event.target.nextElementSibling.nextElementSibling.innerText = `${qualityArray[qualityIndex]}`;
  }
}

function saveNewCard(event) {
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