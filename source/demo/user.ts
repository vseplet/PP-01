const tunnelName = "sevapp";
// Tester
setInterval(async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/${tunnelName}/hohoho/keks?f=${Math.random()}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "blabla-blabla": `${Math.random()}`,
        },
        body: JSON.stringify({
          "data1": Math.random(),
          "data2": Math.random(),
        }),
      },
    );
    console.log(res);
    console.log(await res.text());

    // await fetch(
    //   `https://portal-vqhj.onrender.com/${tunnelName}/hohoho/keks?f=${Math.random()}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "blabla-blabla": `${Math.random()}`,
    //     },
    //     body: JSON.stringify({
    //       "data1": Math.random(),
    //       "data2": Math.random(),
    //     }),
    //   },
    // );
  } catch (e) {
    console.log(e);
  }
}, 2000);
