
class SimpleKudos {

  constructor(text, emoji, id, origin) {
    this.text = text;
    this.emoji = emoji;
    this.id = id;
    this.origin = origin;
    this.serviceURL = "http://localhost:3000/kudos";

    this.element = document.getElementById("kudos");
    if (!this.element) {
      console.warn(`Make sure your page contains an element with id = "kudos".`)
    } else {
      this.element.addEventListener("click", this._update.bind(this));
      this._update();
    }
  }

  _update() {
    fetch(`${this.serviceURL}?id=${this.id}`)
      .then(response => response.json())
      .then((count) => {
        console.log(count);
        this.element.innerHTML = this.text + count.count;
      });
  }
}