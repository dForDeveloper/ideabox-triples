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
  addCard(newIdea);
  clearInput();
});

get('body').addEventListener('click', function(event) {
  if (event.target.classList.contains('delete')) {
    //Delete from local Storage
    ideas[event.target.closest('article').dataset.id].deleteFromStorage();
    //Delete from dataModel
    delete ideas[event.target.closest('article').dataset.id];
    //Delete from DOM
    event.target.closest('article').remove();

    // var deletedIdea = event.target.parentNode.parentNode;
    // var key = parseInt(deletedIdea.dataset.id);
    // ideas[key].deleteFromStorage();
    // ideas.splice(key, 1);
    // delete ideas[key];
    // deletedIdea.remove();
  }
  // userUpdateCard(event);
});
// form.addEventListener("blur", function( event ) {
//   event.target.style.background = "black";    
// }, true);


// Loses focus of target element 1 of 2
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
  document.querySelectorAll('.editable').forEach(e => e.addEventListener('blur', e => {
    saveUserEdits(e)}));
}

function saveUserEdits(event){
     //grabs the id from parent card
     var id = event.target.closest('article').dataset.id
     //gets dom data from title/body of focused card
     var cardTitle = get(`article[data-id='${id}'] .card-title`).innerText;
     var cardBody = get(`article[data-id='${id}'] .card-body`).innerText;
      //save to datamodel & localstorage
      ideas[id].updateSelf(cardTitle, cardBody);
     //  get(event.target.closest('article'));
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
  newCard.addEventListener('blur', e => saveUserEdits(e));
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
   var hasLastCard = false; 
  //  var isLastCard= false;
// function userUpdateCard(e){
//   if(!e.target.closest('article') || e.target.closest('article').dataset.id != lastCardId &&
//       hasLastCard){
//     console.log("NOT A CARD BRO");

//   }else(e.target.closest('article').dataset.id)
    // e.target.closest('article').dataset.id
  //store last id
  // if last id  != current id
  // update last card from last id
  // console.log(e.target.closest('article').dataset.id);
// }