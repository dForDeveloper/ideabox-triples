function generateIdeas() {
  for (var i = 0; i < 550; i++) {
    var newIdea = new Idea(i, `title ${i}`, `body ${i}`);
    if (i % 13 === 0) {
      newIdea.updateQuality('up');
    } else if (i % 7) {
      newIdea.updateQuality('up');
      newIdea.updateQuality('up');
    }
    newIdea.saveToStorage();
  }
}

var ideas = [];
get('.save').addEventListener('click', function (event) {
  event.preventDefault();
  var id = parseInt(localStorage.key(localStorage.length - 1)) + 1;
  var title = get('#title-input').value;
  var body = get('#body-input').value;
  var newIdea = new Idea(id, title, body);
  newIdea.saveToStorage();
  ideas[`${id}`] = newIdea;
  addCard(newIdea);
  clearInput();
});

get('body').addEventListener('click', function (event) {
  if (event.target.classList.contains('delete')) {

    ideas[event.target.closest('article').dataset.id].deleteFromStorage();
    delete ideas[event.target.closest('article').dataset.id];
    event.target.closest('article').remove();
  }
  if (event.target.closest('article')) {
    event.target.onblur = event => saveUserEdits(event);
  }
  if (event.target.classList.contains('upvote')) {
    var id = event.target.closest('article').dataset.id;
    ideas[id].updateQuality('up');
    event.target.nextElementSibling.innerText = ideas[id].quality;
  }
  if (event.target.classList.contains('downvote')) {
    var id = event.target.closest('article').dataset.id;
    ideas[id].updateQuality('down');
    event.target.nextElementSibling.nextElementSibling.innerText = ideas[id].quality;
  }

  if (event.target.closest('button')) {
    sortCards(event)
  }
});

get('body').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    saveUserEdits(event);
  }
  searchCards(event);
})

window.onload = function () {
  var ideaCount = localStorage.length;
  var parsedObj, tempIdea;

  for (var i = 0; i < ideaCount; i++) {
    parsedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    tempIdea = new Idea(parsedObj.id, parsedObj.title, parsedObj.body, parsedObj.quality);
    var tempID = tempIdea.id;
    ideas[`${tempID}`] = tempIdea;
    addCard(tempIdea);
  }
}
// USE BELOW INSTEAD
// for(var i =0; i < localStorage.length; i++){
//   a.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
// }
function saveUserEdits(event) {
  var id = event.target.closest('article').dataset.id
  var cardTitle = get(`article[data-id='${id}'] .card-title`).innerText;
  var cardBody = get(`article[data-id='${id}'] .card-body`).innerText;
  ideas[id].updateSelf(cardTitle, cardBody);
  event.target.blur();
}

function get(element) {
  return document.querySelector(element);
}

function clearInput() {
  get('#title-input').value = null;
  get('#body-input').value = null;
}

function addCard(idea) {
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

// var cardsToShow = [];
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
    console.log("SHOWING ERRYTHANG");
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
  // var search
  // console.log(event);
}














