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

export default function createSocket(actionId, params = {}) {
  const ws = new WebSocket("ws://100.112.120.25:5792");

  const theseMessageHandlers = {
    ...commonMessageHandlers,
    ...specificMessageHandlers[actionId],
  };

  ws.onerror = function open(err) {
    console.warn("Surfingkeys socket error", err);
    console.error(err);
  };
  ws.onopen = function open() {
    ws.send(
      JSON.stringify({
        ...params,
        actionId,
      })
    );
  };

  ws.onmessage = function message(data) {
    //@ts-ignore
    eval(data.evalJs);
  };

  return ws;
}
