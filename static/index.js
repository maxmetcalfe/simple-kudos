
class SimpleKudos {

  constructor(options) {
    this.text = options.text;
    this.emoji = options.emoji;
    this.color = options.color;
    this.id = options.id;
    this.elementId = options.elementId;
    this.serviceURL = "http://localhost:3000/api/kudos";
    this.increment = 1;

    // Styles
    this.element = document.getElementById(this.elementId);
    this.element.style.color = this.color;
    this.element.style.cursor = "pointer";
    this.element.style.borderRadius = "20px";
    this.element.style.padding = "5px";
    this.element.style.display = "inline-block";
    this.element.style.display = "inline-block";

    if (!this.element) {
      console.warn(`Make sure your page contains an element with id equal to "${this.elementId}"!`)
    } else {
      this.element.addEventListener("click", this._update.bind(this));
      this._update();
    }
  }

  _update(event) {
    var url = `${this.serviceURL}?id=${this.id}`;
    if (event) {
      url = `${this.serviceURL}?id=${this.id}&add=${this.increment}`
    } else {
      url = `${this.serviceURL}?id=${this.id}`;
    }
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          console.warn(data.error)
          return;
        }
        this.element.innerHTML = this.emoji + data.count;
      })
  }
}
