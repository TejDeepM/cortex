
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBxbbCpxBvU6HmCA6M-KyH9EJqwc5Htb0Q",
    authDomain: "cortex-c233b.firebaseapp.com",
    projectId: "cortex-c233b",
    storageBucket: "cortex-c233b.appspot.com",
    messagingSenderId: "285672106481",
    appId: "1:285672106481:web:a7786cf856093a12bcbc50",
    measurementId: "G-TDTGXCY342"
};

console.log("Firebase loaded");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const docRef = doc(db, "cortex-api-key", "0Cg9VOZNMsMtCMhQGfl7");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    var API_KEY = docSnap.data()["cortex-api"]
} else {
    window.alert("Cannot find API key")
}

const MODEL_NAME = "gemini-pro";

var input = document.getElementById("mainTextInput")
var sendButton = document.getElementById("mainButton")

input.addEventListener("keydown", runScript)
document.getElementById("resetButton").addEventListener("click", reset)
sendButton.addEventListener("click", check)
input.class = ""

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

var History = []
function reset() {
    History = []
    document.getElementById("responseText").textContent = "Reset Succesfully"
    document.getElementById("responseText").style.color = "rgb(0, 255, 0)"
}

reset()

var generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

var safetySettings = [
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

let Query = window.location["href"].split("?q=")[1]
if (Query != undefined) {
    input.value = Query.replace(/%20/g, " ")
    mainFunc("", Query)
}

function mainFunc(event, query = "") {

    document.body.style.backgroundColor = "rgb(30, 30, 30)";
    document.getElementById("responseText").style.color = "rgb(200, 200, 200)";

    document.getElementById("responseText").className = "animate__animated animate__zoomOut";
    document.getElementById("loadingIcon").hidden = false;
    document.getElementById("loadingIcon").className = "animate__animated animate__zoomIn"
    document.getElementById("mainButton").className = "animate__animated animate__jello"
    
    async function runChat() {

        var genAI = new GoogleGenerativeAI(API_KEY);
        var model = genAI.getGenerativeModel({ model: MODEL_NAME });

        var chat = model.startChat({
            history: History,
            generationConfig: generationConfig,
            safetySettings: safetySettings,
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

        var msg = document.getElementById("mainTextInput").value;
        var result = await chat.sendMessageStream(toAdd + msg);
        
        document.getElementById("responseText").className = "animate__animated animate__zoomOut";
        document.getElementById("responseText").className = "animate__animated animate__zoomIn";
        document.getElementById("responseText").hidden = false;
        document.getElementById("loadingIcon").hidden = true;
        document.getElementById("mainButton").className = ""

        var text = ""

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += removeDoubleAsterisks(chunkText);
            document.getElementById("responseText").textContent = text;
        }

        History.push({role: "user", parts: msg})
        History.push({role: "model", parts: text})

    }

    function handleError(error) {
        document.getElementById("responseText").textContent = error.message
        document.getElementById("responseText").hidden = false;
        document.body.style.backgroundColor = "rgb(40, 0, 0)";
        document.getElementById("responseText").style.color = "rgb(255, 150, 150)";
        console.log(error)
    }

    runChat().catch(handleError);

}
