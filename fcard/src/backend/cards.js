import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Card from './model/cardsModel.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 1234;

const uri = 'mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority';

mongoose.connect(uri)
.then(() => {
    console.log("Connected to DB")
    app.listen(PORT,() => console.log("Server is Running"))})
.catch((err) => console.log(err));

/* Loading Cards */

app.get("/Cards/:username", async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }

        // Fetch data from the database
        const data = await Card.find({ username: username });
        data.forEach((data_item) =>{
            // console.log("Question: ",data_item['_doc']['subsets']['cards']['question'],"\nAnswer: ",data_item['_doc']['subsets']['cards']['answer'],"\nisLearned: ",data_item['_doc']['subsets']['cards']['learnVal']);
            //console.log("Type: ",typeof data_item, "  is Array?: ", Array.isArray(data_item), "data: ",data_item, "length: ", );//di array pero object
            //console.log(Object.keys(data_item));//[ '$__', '$isNew', '_doc' ]
            //console.log("Type: ",typeof data_item['_doc'], "  is Array?: ", Array.isArray(data_item['_doc']), "data: ",data_item['_doc'], "length: ", data_item['_doc'].length);

            // Object.keys(data_item['_doc']).forEach((key) => {
            //     // Print the key and its corresponding value from data_item['_doc']
            //     console.log(`Key: ${key} => Value:`, data_item['_doc'][key]);
            // });
            //console.log(data_item['_doc']['subsets']);
            //console.log("Type: ",typeof data_item['_doc']['subsets'], "  is Array?: ", Array.isArray(data_item['_doc']['subsets']), "data: ",data_item['_doc']['subsets'], "length: ", data_item['_doc']['subsets'].length);
            
            data_item['_doc']['subsets'].forEach((subsets_item) =>{
                //console.log(Object.keys(subsets_item),"\n\n");
                // if(Object.keys(subsets_item) == '_doc'){
                //     console.log("\n\nType: ",typeof subsets_item['_doc'], "\nis Array?: ", Array.isArray(subsets_item['_doc']), "\ndata: ",subsets_item['_doc'], "\nlength: ", subsets_item['_doc'].length);//di array pero object
                // } 
                //console.log(Object.keys(subsets_item['_doc']['cards']),"\n\n\n");
                Object.keys(subsets_item['_doc']['cards']).forEach((cardIndex) => {
                    const card = subsets_item['_doc']['cards'][cardIndex];

                    // Now, iterate over the keys of the card
                    Object.keys(card).forEach((key) => {
                        // Print the key and its corresponding value
                        console.log(`Card ${cardIndex} - Key: ${key} => Value:`, card[key]);
                        
                    });
                    
                });
                console.log("\n");
            });
           
        });

        res.json({ success: true, data: data });

    } catch (e) {
        console.error("Error loading data:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

