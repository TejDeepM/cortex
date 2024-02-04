
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

var input = document.getElementById("mainTextInput")
input.addEventListener("keydown", runScript)
input.class = ""

document.getElementById("mainButton").addEventListener("click", check)

let Query = window.location["href"].split("?q=")[1]
if (Query != undefined) {
    mainFunc("", Query)
}

function runScript(event) {
    if (event.keyCode == 13) {
        check()
    }
}

function check() {
    if (document.getElementById("mainTextInput").value != "") {
        mainFunc()
    }
}

function mainFunc(event, query = "") {

    document.body.style.backgroundColor = "rgb(30, 30, 30)";
    document.getElementById("responseText").style.color = "rgb(200, 200, 200)";

    document.getElementById("responseText").className = "animate__animated animate__zoomOut";
    document.getElementById("loadingIcon").hidden = false;
    document.getElementById("loadingIcon").className = "animate__animated animate__zoomIn"
    document.getElementById("mainButton").className = "animate__animated animate__jello"
    
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
        } else {
            toAdd = query
        }

        const msg = toAdd + document.getElementById("mainTextInput").value;
        const result = await model.generateContentStream(msg);
        
        document.getElementById("responseText").className = "animate__animated animate__zoomOut";
        document.getElementById("responseText").className = "animate__animated animate__zoomIn";
        document.getElementById("responseText").hidden = false;
        document.getElementById("loadingIcon").hidden = true;
        document.getElementById("mainButton").className = ""

        let text = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += removeDoubleAsterisks(chunkText);
            document.getElementById("responseText").textContent = text
        }

    }

    function handleError(error) {
        document.getElementById("responseText").textContent = error.message
        document.body.style.backgroundColor = "rgb(40, 0, 0)";
        document.getElementById("responseText").style.color = "rgb(255, 150, 150)";
    }

    runChat().catch(handleError);

}
