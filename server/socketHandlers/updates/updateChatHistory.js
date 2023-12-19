//check this

const Conversation = require("../../models/conversation");
const serverStore = require("../../serverStore");

const updateChatHistory = async (conversationId, toSpecifiedSocketId) => {
  const conversation = await Conversation.findById(conversationId).populate({
    path: "meassage",
    model: "author",
    populate: {
      path: "author",
      model: "User",
      select: "username_Id",
    },
  });
  if (conversation) {
    const io = serverStore.getSocketServerInstance();

    if (toSpecifiedSocketId) {
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participates: conversation.participates,
      });
      //initail update of chat history
    }
    // check if user of this conversation are onle and emit if yes to the update of message

    conversation.participates.forEach((userId) => {
      const activeConnections = serverStore.getActiveConnections(
        userId.toString()
      );
      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages: conversation.messages,
          participates: conversation.participates,
        });
      });
    });
  }
};

module.exports = { updateChatHistory };
