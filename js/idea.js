class Idea {
  constructor(inId, inTitle, inBody, inQuality) {
    this.id = inId;
    this.title = inTitle;
    this.body = inBody;
    this.qualityArray = ['swill', 'genius', 'plausible'];
    this.quality = inQuality || this.qualityArray[0];
  }

  saveToStorage(ideasArray) {
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

  updateQuality(direction) {
    if (direction === 'up' && this.qualityArray[0] !== 'genius') {
      this.qualityArray.unshift(this.qualityArray.pop());
      this.quality = this.qualityArray[0];
    } else if (direction === 'down' && this.qualityArray[0] !== 'swill') {
      this.qualityArray.push(this.qualityArray.shift());
      this.quality = this.qualityArray[0];
    }
    this.saveToStorage(ideasArray);
  }
}
