function generateIdeas() {
  for (var i = 0; i < 5; i++) {
    var newIdea = new Idea(i, `title ${i}`, `body ${i}`);
    newIdea.saveToStorage();
  }
}  

var ideas = [];
get('.save').addEventListener('click', function(event) {
  event.preventDefault();
  var id = nextID();
  var title = get('#title-input').value;
  var body = get('#body-input').value;
  var newIdea = new Idea(id, title, body);
  newIdea.saveToStorage();
  addCard(newIdea);
  clearInput();
});

get('section').addEventListener('click', function() {
  if (event.target.classList.contains('delete')) {
    var deletedIdea = event.target.parentNode.parentNode;
    var index = parseInt(deletedIdea.dataset.id);
    ideas[index].deleteFromStorage();
    ideas.splice(index, 1);
    deletedIdea.remove();
  }
});

window.onload = function(){
  var ideaCount = localStorage.length;
  var parsedObj, tempIdea;
  for (var i = 0; i < ideaCount; i++){
    parsedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
    tempIdea = new Idea(parsedObj.id, parsedObj.title, parsedObj.body, parsedObj.quality);
    ideas.push(tempIdea);
    addCard(tempIdea);
    console.table(parsedObj);
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
  `<h2 class="card-title" contenteditable="true">${idea.title}</h2>
  <p class="card-body" contenteditable="true">${idea.body}</p>
  <div class="idea-footer">
  <img src="images/downvote.svg" alt="downvote" class="downvote">
  <img src="images/upvote.svg" alt="upvote" class="upvote">
  Quality: <span class="quality">${idea.quality}</span>
  <img src="images/delete.svg" alt="delete" class="delete">
  </div>`;
  get('section').prepend(newCard);
}

function nextID(){
  //iterates over data model looking for next 
  //available id by checking each items id
  //and returning the lowest available one
  var tempID = 0;
  for(var i = 0; i < ideas.length; i++){
    if(ideas[i].id === tempID){
      tempID++;
    }
  }
  return tempID;

  //Will assign lowest available id number, will change the order of items on load(CAN DELETE)
  // var tempID = 0;
  // for(var i = 0; i < ideas.length; i++){
  //   if(ideas[i].id > tempID){
  //     tempID++;
  //   }
  // }
  // return tempID;

  //Just to show how to get a variable key name from local storage(CAN DELETE)
  // for(var i = 0; i < localStorage.length; i++){
  //   console.log(localStorage.key(i));
  //               }
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
