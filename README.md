1. Create a file .env and include value MONGO_URI
2. npm install
3. npm install -g netlify-cli
4. netlify dev

The state of the study is configured in the MongoDB collection "state". There's a single document in that collection. Editing different values has different effects on the study.
State keys:

active ∈ {true, false} determines whether or not participants are allowed past the initial waiting room into the study

condition ∈ {"accuracy", "directional"} determines whether participants see the accuracy or directional based content

policy ∈ {"pro", "anti"} determines whether participants are given the pro- or anti-ai based content

arrived ∈ integers tracks how many people have arrived at the second waiting room (before the policy messaging is presented)

arrivedIDs = [] tracks which IDs have arrived at the second waiting room (to avoid double-counting people on connection drops or page reloads)

participants ∈ integers sets how many participants have to arrive at the second waiting room before all participants are sent to the policy messaging
