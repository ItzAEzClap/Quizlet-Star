const selected = "AssemblyButtonBase AssemblyIconButton AssemblyIconButton--highlight AssemblyIconButton--circle AssemblyButtonBase--medium AssemblyButtonBase--circle"
chrome.runtime.onMessage.addListener(gotMessage)

function gotMessage(message, sender, sendResponse) {
    if (message.type === 'save') {
        const items = document.getElementsByClassName('SetPageTerms-term')
        let starredItems = {}

        for (const item of items) {
            let star = item.getElementsByClassName('hja6hsw a1hp6gla')[0].children[0]
            if (star.className === selected) {
                const [term, definition] = item.getElementsByClassName('TermText notranslate lang-en')
                starredItems[term.textContent] = definition.textContent
            }
        }
        sendResponse(starredItems)
    } else if (message.type === 'load') {
        const items = document.getElementsByClassName('SetPageTerms-term')

        for (let item of items) {
            let star = item.getElementsByClassName('hja6hsw a1hp6gla')[0].children[0]
            if (star.className === selected) { star.click() }

            // Check for which items to be starred (also checks if you have switched between term and definition)
            const [term, definition] = item.getElementsByClassName('TermText notranslate lang-en')
            const groupTerm = message.data[definition.textContent]
            const groupDefinition = message.data[term.textContent]

            if (groupDefinition === definition.textContent || groupTerm === term.textContent) {
                star.className = selected
            }
        }
    }
}