const express = require('express')
const cors = require('cors')
const PORT = 3000;
const { db } = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Voyagio API is running");
});

app.get("/test-db", async (req,res) => {
  try{
    const testRef = await db.collection("test").add({ok: true});
    res.send({success: true});
  }catch (err) {
    res.send({success: false, error: err.message});
  }
});

app.get("/destinations", async (req,res) => {
  try{
    const snapshot = await db.collection("destinations").get();
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.send(list);
  } catch (error){
    res.status(500).send({error: error.message});
  }
});

app.post("/destinations", async (req, res) => {
  try{
    const data = req.body;
    const ref = await db.collection("destinations").add(data);
    res.send({id: ref.id, ...data});
  } catch (error) {
    res.status(500).send({error: err.message});
  }
});

app.delete("/destinations/:id", async (req,res) => {
  try{
    const id = req.params.id;
    await db.collection("destinations").doc(id).delete();
    res.send({ success: true});
  } catch (error) {
    res.status(500).send({error: err.message});
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));