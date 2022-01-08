
class SimpleKudos {

  constructor(options) {
    this.text = options.text;
    this.emoji = options.emoji;
    this.id = options.id;
    this.elementId = options.elementId;
    this.serviceURL = "https://simple-kudos.vercel.app/api/kudos";
    this.increment = 1;
    this._count = options.count || 0;
    this.autoFetch = options.autoFetch === undefined ? true : options.autoFetch;
    
    this.element = document.getElementById(this.elementId);
    this.element.style.cursor = "pointer";
    this.element.style.borderRadius = "20px";
    this.element.style.padding = "5px";
    this.element.style.display = "inline-block";
    
    if (!this.element) {
      console.warn(`Make sure your page contains an element with id equal to "${this.elementId}"!`)
    } else {
      this.element.addEventListener("click", this.update.bind(this));
      this.render();
      if (this.autoFetch) {
        this.update();
      }
    }
  }

  get count() {
    return this._count;
  }

  set count(count) {
    this._count = count;
  }

  render() {
    if (this.count === null) {
      this.element.innerHTML = this.emoji;
    } else {
      this.element.innerHTML = this.emoji + " " + this.count || "0";
    }
  }

  update(event) {
    if (event) {
      this.count = this.count + this.increment;
    }

    this.render();

    if (event) {
      var url = this.serviceURL + "?ids=" + this.id + "&add=" + this.increment;
    } else {
      var url = this.serviceURL + "?ids=" + this.id;
    }
    
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        var count = data[this.id];
        if (count >= this.count) {
          this.count = count;
        }
        
        this.render()
        this.mounted = true;
      })
  }
}

class SimpleKudosList {
  constructor(simpleKudos) {
    this.simpleKudos = simpleKudos;
    this.serviceURL = "https://simple-kudos.vercel.app/api/kudos";
  }

  update() {
    var url = this.serviceURL + "?ids=" + this.simpleKudos.map((simpleKudo) => {
      return simpleKudo.id
    });

    fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.simpleKudos.forEach((k) => {
          var count = data[k.id];
          k.count = count;
          k.render();
        });
      })
  }
}

window.SimpleKudos = SimpleKudos;
window.SimpleKudosList = SimpleKudosList;
