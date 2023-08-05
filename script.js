const input = document.getElementById('name')
const save = document.getElementById('save')
const load = document.getElementById('load')
const remove = document.getElementById('remove')
const selected = "AssemblyButtonBase AssemblyIconButton AssemblyIconButton--highlight AssemblyIconButton--circle AssemblyButtonBase--medium AssemblyButtonBase--circle"
const unselected = "AssemblyButtonBase AssemblyIconButton AssemblyIconButton--tertiary AssemblyIconButton--circle AssemblyButtonBase--medium AssemblyButtonBase--circle"
let url = ""
let set = ""
init()

function saveStarredItems() {
    if (input.value.length === 0) { return false }
    
    const items = document.getElementsByClassName('SetPageTerms-term')
    let groups = JSON.parse(localStorage.getItem('groups'))
    let starredItems = {}

    for (const item of items) {
        let star = item.getElementsByClassName('hja6hsw a1hp6gla')[0].children[0]
        if (star.className === selected) {
            const [term, definition] = item.getElementsByClassName('TermText notranslate lang-en')
            starredItems[term.textContent] = definition.textContent
        }
    }

    if (starredItems.length === 0) { return false }
    if (groups[set].hasOwnProperty(input.value)) {
        if (!confirm(`There already exists a group with the name ${input.value}. Do you want to override it?`)) {
            return false
        }
    }

    groups[set][input.value] = starredItems
    localStorage.setItem('groups', JSON.stringify(groups))
}

function removeGroup() {
    let groups = JSON.parse(localStorage.getItem('groups'))
    delete groups[set][input.value]
    localStorage.setItem('groups', JSON.stringify(groups))
}

function loadStarredItems() {
    const items = document.getElementsByClassName('SetPageTerms-term')
    let groups = JSON.parse(localStorage.getItem('groups'))

    for (let item of items) {
        let star = item.getElementsByClassName('hja6hsw a1hp6gla')[0].children[0]
        if (star.className === selected) { star.click() }
        
        // Check for which items to be starred (also checks if you have switched between term and definition)
        const [term, definition] = item.getElementsByClassName('TermText notranslate lang-en')
        const groupTerm = groups[set][input.value][definition.textContent]
        const groupDefinition = groups[set][input.value][term.textContent]

        if (groupDefinition === definition.textContent || groupTerm === term.textContent) {
            star.click()
        }
    }
}

function init() {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) { url = tabs[0].url })
    
    setTimeout(() => {
        const regex = /^https:\/\/quizlet\.com\/\d+\/.*$/
        if (!regex.test(url)) { window.close() }
        else {
            set = url.split('/')[3]
            let dict = localStorage.getItem('groups') || {}
            dict[set] = {}
            localStorage.setItem('groups', dict)
            console.log("Hi")
        }
    }, 1)
}



save.addEventListener('click', saveStarredItems)
load.addEventListener('click', loadStarredItems)
remove.addEventListener('click', removeGroup)