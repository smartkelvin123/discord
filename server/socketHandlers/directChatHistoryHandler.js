const Conversation = require("../models,conversation");
const chatUpdate = require("./updates/chat");

const directChatHistoryHandler = async (Socket, data) => {
  try {
    const { userId } = Socket.user;
    const { receiverUserId } = data;

    const conversation = await Conversation.findOne({
      participate: {
        $all: [userId, receiverUserId],
      },
      type: "DIRECT",
    });
    if (conversation) {
      chatUpdate.updateChatHistory()(conversation._id.toString(), Socket.id);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directChatHistoryHandler;
