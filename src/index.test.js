const SimpleKudos = require("./index");

test("kudos fetches / renders count data", async () => {
  document.body.innerHTML = '<div id="kudos">' + "</div>";
  window.fetch = () => {
    return Promise.resolve({
      json: () => {
        return { 12345: 3 };
      },
    });
  };
  const kudos = new SimpleKudos({
    emoji: "🙌🏼",
    id: "12345",
    elementId: "kudos",
  });
  await new Promise(process.nextTick);
  expect(kudos.element.innerHTML).toBe("🙌🏼 3");
});

test("kudos with no value renders properly", async () => {
  document.body.innerHTML = '<div id="kudos">' + "</div>";
  window.fetch = () => {
    return Promise.resolve({
      json: () => {
        return { 666: 3 };
      },
    });
  };
  const kudos = new SimpleKudos({
    emoji: "😭",
    id: "12345",
    elementId: "kudos",
  });
  await new Promise(process.nextTick);
  expect(kudos.element.innerHTML).toBe("😭");
});

test("kudos with no value renders properly", async () => {
  document.body.innerHTML = '<div id="kfudos">' + "</div>";
  window.fetch = () => {
    return Promise.resolve({
      json: () => {
        return { 666: 3 };
      },
    });
  };
  const kudos = new SimpleKudos({
    emoji: "☠️",
    id: "12345",
    elementId: "kudos",
  });
  await new Promise(process.nextTick);
  expect(kudos.element).toBe(null);
});
