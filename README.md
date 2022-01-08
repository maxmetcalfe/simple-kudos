# Simple Kudos

Add a simple emoji kudos button to your website!

Just include the below script tag in your HTML.

```js
<script src="https://simple-kudos.vercel.app/simple-kudos.js"></script>
```

Add an HTML element where you want the kudos button.

```js
<a id="kudos"></a>
```

And then in another script tag, create a SimpleKudos and provide it with the element ID of the target element.

```js
<script>
  let kudos = new SimpleKudos({
    emoji: "🙌🏼", // Any emoji to use as the button.
    id: "12345", // An arbitrary string to use as an ID.
    elementId: "kudos" // The ID of the element to attach to.
  });
</script>
```

And, that's it! You'll have a nice little kudos button where your friends can give you kudos!

You can also add multiple SimpleKudos on a single page by creating 