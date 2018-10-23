class Idea {
  constructor(inId, inTitle, inBody, inQuality) {
    this.id = inId;
    this.title = inTitle;
    this.body = inBody;
    this.quality = inQuality || 'swill';
  }

  saveToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  }

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  }

  updateSelf(inTitle, inBody) {
    this.title = inTitle;
    this.body = inBody;
    this.saveToStorage();
  }

  updateQuality(inQuality) {
    this.quality = inQuality;
  }
}
