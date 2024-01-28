
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

var input = document.getElementById("mainTextInput")
input.addEventListener("keydown", runScript)

document.getElementById("mainButton").addEventListener("click", mainFunc) // Call the function by its assigned name


function runScript(event) {
    console.log("I'm here")
    if (event.keyCode == 13) {
        mainFunc()
    }
}

function mainFunc() {

    console.log("Yay")
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
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        ];
    
        const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
        ],
        });
    
        const result = await chat.sendMessage(input.value);
        const response = result.response;
        
        console.log(response.text())

        var i = 0
        var txt = response.text()

        function removeBold(text) {
            return text.replace(/\*\*(.*?)\*\*/g, "$1");
          }
        
        txt = removeBold(txt)
        console.log(txt)

        document.getElementById("responseText").textContent = ""

        function typeEffect() {
            document.getElementById("responseText").textContent += txt.charAt(i)
            window.setTimeout(typeEffect, 10)
            i++
        }

        typeEffect()

    }
    
    runChat();
}
