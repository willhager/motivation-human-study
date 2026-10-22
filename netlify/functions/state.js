import { ObjectId } from 'mongodb';

import { getClientPromise } from './lib/mongo.js';

const sendJson = (statusCode, body) => ({
    statusCode,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
});

const id = "6ad678f761b961446f4150af"
export const handler = async (event) => {
    const method = event.httpMethod;
    const client = await getClientPromise();
    const collection = () => client.db("human_study_website").collection("state")

    try {

        if(method === "GET") {
            const state = await collection().findOne({ _id: new ObjectId(id) });
            if (!state) return sendJson(404, { error: "State object not found."});
            return sendJson(200, state);
        }
        
        if (method === "PATCH") {
            const body = event.body ? JSON.parse(event.body) : {};
            const result = await collection().updateOne(
                { _id: new ObjectId(id) },
                { $set: body }
            );
            return sendJson(200, result);
        }

        return sendJson(405, {error: `Method ${method} not allowed.`})
    }

    catch (error){
        console.error(error);
        return sendJson(500, {error: `Failed to ${method} pages`});
    }
}
