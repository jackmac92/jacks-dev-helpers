import WebSocket from "ws";

const specificMessageHandlers = {
  leetcode: {
    replaceValue: (msg) => {
      const data = JSON.parse(msg);
      document.querySelector(data.targetSelector).value = data.newValue;
    },
  },
};
const commonMessageHandlers = {
  replaceValue: (msg) => {
    const data = JSON.parse(msg);
    document.querySelector(data.targetSelector).value = data.newValue;
  },
};

function createSocketServer(actionId, params = {}) {
  const ws = new WebSocket("ws://100.112.120.25:5792", {
    perMessageDeflate: false,
  });

  const theseMessageHandlers = {
    ...commonMessageHandlers,
    ...specificMessageHandlers[actionId],
  };

  ws.on("open", function open() {
    ws.send(
      JSON.stringify({
        ...params,
        actionId,
      })
    );
  });

  ws.on("message", function message(data) {
    //@ts-ignore
    eval(data.evalJs);
  });

  return ws;
}
