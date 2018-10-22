class Idea{
    constructor(inId, inTitle, inBody, inQuality){
        this.id = inId;
        this.title = inTitle;
        this.body = inBody;
        if(inQuality === 'genius' ||
           inBody === 'plausible' ||
           inQuality === 'swill'){
            this.quality = inQuality;

        }
    }

    saveToStorage(){
        localStorage.setItem(this.id, JSON.stringify(this));
    }

    deleteFromStorage(){
        localStorage.removeItem(this.id);
    }

    updateSelf(){
        this.saveToStorage();
    }

    updateQuality(inQuality){
        this.quality = inQuality;
    }
    
}
