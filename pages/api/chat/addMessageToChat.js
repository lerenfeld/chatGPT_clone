import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("ChatGPT_clone");

    const { chatId, role, content } = req.body;
    let objectId;

    //validate valid mongo ObjectID
    try {
      objectId = new ObjectId(chatId);
    } catch (e) {
      return res.status(422).json({
        message: "Invalid chat ID",
      });
    }

    //validate content
    if (
      !content ||
      typeof content !== "string" ||
      (role === "user" && content.length > 200) ||
      (role === "assistant" && content.length > 100000)
    ) {
      return res.status(422).json({
        message: "content is required and must be less than 200 chatacters",
      });
    }

    //validate role
    if (!["user", "assistant"].includes(role)) {
      return res.status(422).json({
        message: "role must be either 'user' or 'assistant' ",
      });
    }

    const chat = await db.collection("chats").findOneAndUpdate(
      {
        _id: objectId,
        userId: user.sub,
      },
      {
        $push: {
          messages: {
            role,
            content,
          },
        },
      },
      {
        returnDocument: "after",
      }
    );

    res.status(200).json({
      chat: {
        ...chat.value,
        _id: chat.value._id.toString(),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred when adding message to chat" });
    console.log("AN ERROR OCCURRED IN ADD MESSAGE TO CHAT", error);
  }
}
