const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');


const openai = new OpenAI({
  apiKey: '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', // Replace with your OpenAI API key
});


const app = express();
app.use(bodyParser.json());


const conversations = {};


const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/ai', async (req, res) => {
  const { prompt, userId } = req.body;

  
  if (!userId) {
    return res.status(400).send('User ID is required!');
  }

  
  if (!conversations[userId]) {
    conversations[userId] = [];
  }

  
  conversations[userId].push({ role: 'user', content: prompt });

  try {
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Esti o inteligenta artificiala, creeata de S3bi, numele tau este Zenithra esti aici ca sa ajuti elevii sa ia examenul de Bacalaureat de pe clasa a12a, o sa raspunzi la orice intrebare legata de materiile de liceu, inclusiv: Matematica, Romana, Geografie, etc. Vei explica totul in pasi simpli si usor de invatat de catre oricine. Vei incerca sa ajuti foarte bine si usor de inteles pe toata lumea, cu pasi mici si detaliati.' },
        ...conversations[userId], 
        { role: 'user', content: prompt }, 
      ],
    });

    
    const aiReply = response.choices[0].message.content;
    conversations[userId].push({ role: 'assistant', content: aiReply });

    
    res.json({ reply: aiReply });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
