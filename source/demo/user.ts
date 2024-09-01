const tunnelName = "sevapp";
// Tester
setInterval(async () => {
  try {
    await fetch(
      `http://localhost:3000/${tunnelName}/hohoho/keks?f=${Math.random()}`,
      {
        method: "POST",
        headers: {
          "blabla-blabla": `${Math.random()}`,
        },
        body: JSON.stringify({
          "data1": Math.random(),
          "data2": Math.random(),
        }),
      },
    );
  } catch (e) {}
}, 10000);
