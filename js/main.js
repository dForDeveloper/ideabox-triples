var ideas = [];

get('.save').addEventListener('click', function(event) {
  event.preventDefault();
  var id = localStorage.length;
  var title = get('#title-input').value;
  var body = get('#body-input').value;
  var newIdea = new Idea(id, title, body);
  newIdea.saveToStorage();
  addCard(newIdea);
  clearInput();
});

get('section').addEventListener('click', function() {
  if (event.target.classList.contains('delete-button')) {
    var deletedIdea = event.target.parentNode.parentNode;
    deletedIdea.remove();
  }
});

window.onload = function(){
  var ideaCount = localStorage.length;
  var tempObj;
  var tempIdea;
  for(var i = 0; i < ideaCount; i++){
    tempObj = JSON.parse(localStorage.getItem(i));
    tempIdea = new Idea(tempObj.id, tempObj.title, tempObj.body, tempObj.quality);
    ideas.push(tempIdea);
    addCard(tempIdea);
  }
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
  `<h2>${idea.title}</h2>
  <p>${idea.body}</p>
  <div class="idea-footer">
  <img src="images/downvote.svg" alt="downvote">
  <img src="images/upvote.svg" alt="upvote">
  Quality: <span class="quality">${idea.quality}</span>
  <img src="images/delete.svg" alt="delete" class="delete-button">
  </div>`;
  get('section').prepend(newCard);
}

/*
Updating Cards
  User will click on idea to edit
  User will press return on idea to commit changes
  event listener will 
    get the object by id from .dataset
    get changes to title and body, getID from dom
    call updateSelf(id, title, body);
    */
