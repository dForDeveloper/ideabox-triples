class Idea {
  constructor(inId, inTitle, inBody, inQuality) {
    this.id = inId;
    this.title = inTitle;
    this.body = inBody;
    this.quality = inQuality || 0;
  }

  saveToStorage(ideasArray, isNewCard) {
    isNewCard && ideasArray.push(this);
    localStorage.setItem('ideas', JSON.stringify(ideasArray));
  }

  deleteFromStorage(index, ideasArray) {
    ideasArray.splice(index, 1);
    this.saveToStorage(ideasArray);
  }

  updateSelf(inTitle, inBody, ideasArray, index) {
    this.title = inTitle;
    this.body = inBody;
    ideasArray.splice(index, 1, this)
    this.saveToStorage(ideasArray);
  }

  updateQuality(direction, ideasArray) {
    direction === 'up' && this.quality !== 2 && this.quality++ ||
      direction === 'down' && this.quality !== 0 && this.quality--;

    this.saveToStorage(ideasArray);
    return this.quality;
  }
}
