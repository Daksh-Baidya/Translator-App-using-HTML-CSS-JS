const selectTag = document.querySelectorAll("select")
const fromText = document.querySelector(".fromText")
const toText = document.querySelector(".toText")
const translateBtn = document.querySelector("button")
const exchange = document.querySelector(".exchange")
const icons = document.querySelectorAll(".row i")

selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected;
        if(id == 0 && country_code == "en-GB"){
            selected = "selected";
        } else if(id == 1 && country_code =="hi-IN"){
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`
        tag.insertAdjacentHTML("beforeend", option)
    }
})

exchange.addEventListener("click", () => {
    let tempText = fromText.value
    fromText.value = toText.value
    toText.value = tempText
    let tempLang = selectTag[0].value
    selectTag[0].value = selectTag[1].value
    selectTag[1].value = tempLang
})

fromText.addEventListener("keyup", () => {
    if(!fromText.value){
        toText.value = ''
    }
})

translateBtn.addEventListener("click", () => {
    const text = fromText.value
    let translateFrom = selectTag[0].value
    let translateTo = selectTag[1].value
    if (!text.trim()) {
        toText.setAttribute("placeholder", "Translation");
        return;
      }
      toText.setAttribute("placeholder", "Translating...");
      
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText
        data.matches.forEach(data => {
            if(data.id === 0){
                toText.value = data.translation
            }
        })
        toText.setAttribute("placeholder", "Translation")
    })
})

fromText.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        const text = fromText.value
        let translateFrom = selectTag[0].value
        let translateTo = selectTag[1].value
        if(!text){
            toText.setAttribute("placeholder", "Translating...")
            return;
        }
        let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
        fetch(apiUrl).then(res => res.json()).then(data => {
            toText.value = data.responseData.translatedText
            toText.setAttribute("placeholder", "Translation")
        })

    }
})
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")){
            if(target.id == "from"){
                navigator.clipboard.writeText(fromText.value)
            } else{
                navigator.clipboard.writeText(toText.value)
            }
        } else{
            let speech
            if(target.id == "from"){
                speech = new SpeechSynthesisUtterance(fromText.value)
                speech.lang = selectTag[0].value
            } else{
                speech = new SpeechSynthesisUtterance(toText.value)
                speech.lang = selectTag[1].value
            }
            speechSynthesis.speak(speech)
        }
    })
}) 