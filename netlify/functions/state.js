import { ObjectId } from "mongodb";
import { getClientPromise } from "./lib/mongo.js";

const sendJson = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const STATE_ID = new ObjectId("6ad678f761b961446f4150af");

const publicState = ({ arrivedIDs, ...rest }) => rest;

export const handler = async (event) => {
  const method = event.httpMethod;

  try {
    const client = await getClientPromise();
    const collection = client.db("human_study_website").collection("state");

    if (method === "GET") {
      const state = await collection.findOne({ _id: STATE_ID });
      if (!state) return sendJson(404, { error: "State object not found." });
      return sendJson(200, publicState(state));
    }

    if (method === "PATCH") {
      let body = {};
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch {
        return sendJson(400, { error: "Invalid JSON." });
      }

      const { prolificID } = body;
      if (typeof prolificID !== "string" || !prolificID.trim()) {
        return sendJson(400, { error: "prolificID is required." });
      }

      const updated = await collection.findOneAndUpdate(
        { _id: STATE_ID },
        [
          {
            $set: {
              arrivedIDs: {
                $setUnion: [{ $ifNull: ["$arrivedIDs", []] }, [prolificID]],
              },
            },
          },
          { $set: { arrived: { $size: "$arrivedIDs" } } },
        ],
        { returnDocument: "after" }
      );

      const doc = updated?.value ?? updated;
      if (!doc) return sendJson(404, { error: "State object not found." });
      return sendJson(200, publicState(doc));
    }

    return sendJson(405, { error: `Method ${method} not allowed.` });
  } catch (error) {
    console.error(error);
    return sendJson(500, { error: `Failed to ${method} state.` });
  }
};