const Realm = require("realm");

const go = async () => {
  const Message = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      error: "string?",
    },
  };

  const realm = await Realm.open({ schema: [Message] });

  async function trySendMessage(message) {
    try {
      await sendMessage(message);
    } catch (error) {
      await handleError(message, error.message);
    }
  }

  async function sendMessage(message) {
    await doSendMessage(message);
  }

  async function doSendMessage() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    throw new Error("error");
  }

  async function handleError(message, error) {
    realm.write(() => {
      console.log("Handling error");
      message.error = error;
      // ❌  ❌  JS task hangs on this line and never continues. The message is never updated in realm.
      console.log("Handled error");
    });
  }

  const message = realm.write(() => {
    return realm.create("Message", { _id: Realm.BSON.ObjectId() });
  });
  trySendMessage(message);
};

go();
