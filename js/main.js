get('.save').addEventListener('click', function(event) {
  event.preventDefault();
  clearInput();
  let id = localStorage.length;
  let title = get('#title').value;
  let body = get('#body').value;
  let newIdea = new Idea(id, title, body);
  addCard(newIdea);
})

function get(element) {
  return document.querySelector(element);
}

function clearInput() {
  get('#title').value = null;
  get('#body').value = null;
}

function addCard(idea) {
  let newCard = document.createElement('article');
  newCard.innerHTML = `<h2>${idea.title}</h2>
  <p>${idea.body}</p>
  <div>
    <img src="images/downvote.svg" alt="downvote">
    <img src="images/upvote.svg" alt="upvote">
    Quality: ${idea.quality}
    <img src="images/delete.svg" alt="delete">
  </div>`;
  select('section').prepend(newCard);
}