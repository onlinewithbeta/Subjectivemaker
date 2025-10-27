import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config();

const apikey = process.env.APIKEY;

const app = new express();
app.use(express.json());
app.disable("x-powered-by");

const PORT = process.env.PORT || 2023;

async function generateContent(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apikey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error calling Gemini API:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate content.");
  }
}


app.post('/', async (req, res)=> {
  const comparisonData = req.body.exampaper;
  console.log(comparisonData)
  const myPrompt = `Compare each user input with the correct answer and question.
  And determine if the user input is correct.
  
  Return only an array where 1 means correct (same meaning) and 0 means wrong (different meaning).

  Example : [1,0,0,1,1,0].


  Data to compare: ${JSON.stringify(comparisonData)}

  Consider synonyms, different word forms, and semantic meaning.


  `;

  let rest = await generateContent(myPrompt)

  
  let mm = rest.candidates[0].content.parts[0].text;
  mm = JSON.parse(mm)
  
  res.send(mm)
})

app.use((req,res)=>{
  res.send("mm")
})
app.listen(PORT, async ()=> {
  console.log(`http://localhost:${PORT}`);
}) 

