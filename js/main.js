function generateIdeas() {
  for (var i = 0; i < 5; i++) {
    var newIdea = new Idea(i, `title ${i}`, `body ${i}`);
    newIdea.saveToStorage();
  }
}  

var ideas = {};
get('.save').addEventListener('click', function(event) {
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

get('body').addEventListener('click', function(event) {
  if (event.target.classList.contains('delete')) {
    ideas[event.target.closest('article').dataset.id].deleteFromStorage();
    delete ideas[event.target.closest('article').dataset.id];
    event.target.closest('article').remove();
  }
  if(event.target.closest('article')){
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
});

get('section').addEventListener('keypress', function(event){
 if(event.key === 'Enter'){
  saveUserEdits(event);
 }
})

window.onload = function(){
  var ideaCount = localStorage.length;
  var parsedObj, tempIdea;
  for (var i = 0; i < ideaCount; i++){
    parsedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    tempIdea = new Idea(parsedObj.id, parsedObj.title, parsedObj.body, parsedObj.quality);
    var tempID = tempIdea.id;
    ideas[`${tempID}`]  = tempIdea;
    addCard(tempIdea);
  }
  // document.querySelectorAll('.editable').forEach(e => e.addEventListener('blur', e => {
  //   saveUserEdits(e)}));
}

function saveUserEdits(event){
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
  `<h2 class="card-title editable" contenteditable="true">${idea.title}</h2>
  <p class="card-body editable" contenteditable="true">${idea.body}</p>
  <div class="idea-footer">
  <img src="images/downvote.svg" alt="downvote" class="downvote">
  <img src="images/upvote.svg" alt="upvote" class="upvote">
  Quality: <span class="quality">${idea.quality}</span>
  <img src="images/delete.svg" alt="delete" class="delete">
  </div>`;
  // newCard.addEventListener('blur', e => saveUserEdits(e));
  get('section').prepend(newCard);
}

function sortCards(e){
  document.querySelectorAll('.quality').forEach(function(quality){
    if(quality.target.innerText !== e.target.innerText){
      quality.target.closest('article').classList.add('hidden')
    }
  }
}



















