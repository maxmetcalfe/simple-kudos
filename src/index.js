
class SimpleKudos {

  constructor(options) {
    this.text = options.text;
    this.emoji = options.emoji;
    this.id = options.id;
    this.elementId = options.elementId;
    this.serviceURL = "https://simple-kudos.vercel.app/api/kudos";
    this.increment = 1;
    this.count = null;

    // Styles
    this.element = document.getElementById(this.elementId);
    this.element.style.cursor = "pointer";
    this.element.style.borderRadius = "20px";
    this.element.style.padding = "5px";
    this.element.style.display = "inline-block";

    if (!this.element) {
      console.warn(`Make sure your page contains an element with id equal to "${this.elementId}"!`)
    } else {
      this.element.addEventListener("click", this._update.bind(this));
      this._render();
      this._update();
    }
  }

  _render() {
    if (this.count === null) {
      this.element.innerHTML = this.emoji;
    } else {
      this.element.innerHTML = this.emoji + " " + this.count;
    }
  }

  _update(event) {
    if (event) {
      this.count = this.count + this.increment;
    }

    this._render();

    if (event) {
      var url = this.serviceURL + "?id=" + this.id + "&add=" + this.increment;
    } else {
      var url = this.serviceURL + "?id=" + this.id;
    }

    fetch(url)
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          console.warn(data.error)
          return;
        }

        if (data.count >= this.count) {
          this.count = data.count;
        }

        this._render(data.count)
        this.mounted = true;
      })
  }
}

window.SimpleKudos = SimpleKudos;
