const conversation = require("../models/conversation");
const message = require("../models/message");

const directMessageHandler = async (socket, data) => {
  console.log("direct message event is being handle");
  try {
    const { userId } = socket.userId;
    const { reciverUserId, content } = data;
    // create a new meesage
    const message = await message.create({
      authorId: userId,
      content: content,
      date: new Date(),
      type: "DIRECT",
    });
    // find if conversation exit with this two user, if not create new
    const conversation = await conversation.findOne({
      participate: {
        $all: [userId, reciverUserId],
      },
    });

    if (conversation) {
      // add message to conversation
      conversation.messages.push(message._id);
      await conversation.save();

      //perform and update to sender and receiver if is online
      chatUpdate.updateChatHistory()(conversation._id.toString());
    } else {
      // create new conversation
      const newConversation = await conversation.create({
        participate: [userId, reciverUserId],
        messages: [message._id],
      });
      //perform and update to sender and receiver if it online
      chatUpdate.updateChatHistory()(conversation._id.toString());
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directMessageHandler;
