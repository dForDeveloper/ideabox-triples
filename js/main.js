var ideasArray = [];

function generateIdeasArray() {
  for (var i = 0; i < 5000; i++) {
    var newIdea = new Idea(i, `title ${i}`, `body ${i}`);
    if (i % 13 === 0) {
      newIdea.updateQuality('up');
    } else if (i % 7) {
      newIdea.updateQuality('up');
      newIdea.updateQuality('up');
    }
    // ideasArray.push(newIdea);
    newIdea.saveToStorage(ideasArray, true);
  }
}
generateIdeasArray();
//IGNORE ABOVE IT IS FOR GENERATING TEST CARDS//



window.onload = function () {
  //I could make this one line...but that is probably pushing it, readability wise
  //Can be function
  if (localStorage.getItem('ideas')) {
    ideasArray = JSON.parse(localStorage.getItem('ideas'));
    ideasArray = ideasArray.map(eachObj => eachObj = new Idea(eachObj.id, eachObj.title, eachObj.body, eachObj.quality));
    ideasArray.forEach(eachObj => addCardToDOM(eachObj));
  }
}

//turn all into functions inside this
get('body').addEventListener('click', function (event) {
  event.preventDefault();
  if (event.target.classList.contains('delete')) {
    var id = event.target.closest('article').dataset.id;
    var index = returnIndexOfIdeaByID(id);
    //delete from local storage and data model
    ideasArray[index].deleteFromStorage(index, ideasArray);
    //delete from dom
    event.target.closest('article').remove();
  }

  //need to relook at this logic
  if (event.target.closest('article')) {
    var id = event.target.closest('article').dataset.id;
    event.target.onblur = event => saveUserEdits(id);
  }

  if (event.target.classList.contains('upvote')) {
    var id = event.target.closest('article').dataset.id;
    var index = returnIndexOfIdeaByID(id);
    ideasArray[index].updateQuality('up', ideasArray);
    event.target.nextElementSibling.innerText = ideasArray[index].quality;
  }

  if (event.target.classList.contains('downvote')) {
    var id = event.target.closest('article').dataset.id;
    var index = returnIndexOfIdeaByID(id);
    ideasArray[index].updateQuality('down', ideasArray);
    event.target.nextElementSibling.nextElementSibling.innerText = ideasArray[index].quality;
  }

  if (event.target.closest('button')) {
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
  if (event.key === 'Enter') {
    saveUserEdits(event);
  }
  searchCards(event);
})

function saveUserEdits(id) {
  var cardTitle = get(`article[data-id='${id}'] .card-title`).innerText;
  var cardBody = get(`article[data-id='${id}'] .card-body`).innerText;
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
  newCard.dataset.id = idea.id;
  newCard.innerHTML =
    `<span class="searchable"><h2 class="card-title editable" contenteditable="true">${idea.title}</h2>
  <p class="card-body editable" contenteditable="true">${idea.body}</p></span>
  <div class="idea-footer">
  <img src="images/downvote.svg" alt="downvote" class="downvote">
  <img src="images/upvote.svg" alt="upvote" class="upvote">
  Quality: <span class="quality">${idea.quality}</span>
  <img src="images/delete.svg" alt="delete" class="delete">
  </div>`;
  get('section').prepend(newCard);
}

function sortCards(e) {
  e.preventDefault();
  var clickedButton = e.target;
  var clickedButtonText = e.target.innerText.toLowerCase();

  if (clickedButtonText !== 'unfilter') {
    console.log(clickedButtonText);
    document.querySelectorAll('.quality').forEach(function (span) {
      if (clickedButtonText === span.innerText) {
        span.closest('article').classList.remove('hidden');
      } else {
        span.closest('article').classList.add('hidden');
      }
    });
  } else {
    document.querySelectorAll('.quality').forEach(function (span) {
      span.closest('article').classList.remove('hidden');
    });
  }

  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = false;
  });

  clickedButton.disabled = true;
}

function searchCards(event) {
  get('.unfilter-button').disabled = false;
  get('.unfilter-button').click();
  if (event.target.id === 'search') {
    document.querySelectorAll('.searchable').forEach(elem => {
      if (!elem.innerText.includes(event.target.value)) {
        elem.closest('article').classList.add('hidden');
      }
    });
  }
}

function returnIndexOfIdeaByID(inID) {
  return ideasArray.findIndex(obj => obj.id === parseInt(inID));
}