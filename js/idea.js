class Idea {
  constructor(inId, inTitle, inBody, inQuality) {
    this.id = inId;
    this.title = inTitle;
    this.body = inBody;
    this.qualityArray = ['swill', 'genius', 'plausible'];
    this.quality = inQuality || this.qualityArray[0];
  }

  saveToStorage() {
    ideas.push(this);
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  }

  updateSelf(inTitle, inBody) {
    this.title = inTitle;
    this.body = inBody;
    this.saveToStorage();
  }

  updateQuality(direction) {
    if (direction === 'up' && this.qualityArray[0] !== 'genius') {
      this.qualityArray.unshift(this.qualityArray.pop());
      this.quality = this.qualityArray[0];
    } else if (direction === 'down' && this.qualityArray[0] !== 'swill') {
      this.qualityArray.push(this.qualityArray.shift());
      this.quality = this.qualityArray[0];
    }
    this.saveToStorage();
    ideas.indexOf()
  }
}
