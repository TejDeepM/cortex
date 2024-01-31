
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

var input = document.getElementById("mainTextInput")
input.addEventListener("keydown", runScript)

document.getElementById("mainButton").addEventListener("click", mainFunc)


function runScript(event) {
    console.log("I'm here")
    if (event.keyCode == 13) {
        mainFunc()
    }
}

function mainFunc() {

    document.getElementById("responseText").innerHTML = "..."
    
    const MODEL_NAME = "gemini-pro";
    const API_KEY = "AIzaSyDVigTO9l-21jvtAidvPC29SV2aYcxVlqY";
    
    async function runChat() {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
        const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
        };
    
        const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        ];
    
        const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
        ],
        });

        function removeDoubleAsterisks(text) {
            return text.replace(/\*\*/g, '');
        }

        var toAdd = ""
        let optionsMenu = document.getElementById("responseLengthOptionMenu")

        if (optionsMenu.value == "Short") {
            toAdd = "Answer in brief: "
        } else if (optionsMenu.value == "Points") {
            toAdd = "Answer in points: "
        } else if (optionsMenu.value == "Long") {
            toAdd = "Answer in detail: "
        }

        console.log(toAdd)

        const msg = toAdd + document.getElementById("mainTextInput").value;

        console.log(msg)

        const result = await model.generateContentStream(msg);
        
        let text = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += removeDoubleAsterisks(chunkText);
            document.getElementById("responseText").textContent = text
        }

    }
    
    runChat();
}
