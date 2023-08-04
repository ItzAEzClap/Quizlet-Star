const input = document.getElementById('name')
const save = document.getElementById('save')
const load = document.getElementById('load')
const remove = document.getElementById('remove')
const selected = "AssemblyButtonBase AssemblyIconButton AssemblyIconButton--highlight AssemblyIconButton--circle AssemblyButtonBase--medium AssemblyButtonBase--circle"
const unselected = "AssemblyButtonBase AssemblyIconButton AssemblyIconButton--tertiary AssemblyIconButton--circle AssemblyButtonBase--medium AssemblyButtonBase--circle"

function saveStarredItems() {
    const items = document.getElementsByClassName('SetPageTerms-term')
    let starredItems = {}

    for (const item of items) {
        let star = item.getElementsByClassName('hja6hsw a1hp6gla')[0].children[0]
        if (star.className === selected) {
            const [term, definition] = item.getElementsByClassName('TermText notranslate lang-en')
            starredItems[term.textContent] = definition.textContent
        }
    }

    if (starredItems.length === 0) { return false }
    if (groups.hasOwnProperty(input.value)) {
        if (!confirm(`There already exists a group with the name ${input.value}. Do you want to override it?`)) {
            return false
        }
    }

    let groups = JSON.parse(localStorage.getItem('groups')) || {}
    groups[input.value] = starredItems
    localStorage.setItem('groups', JSON.stringify(groups))
}

function removeGroup() {
    let groups = JSON.parse(localStorage.getItem('groups')) || {}
    delete groups[input.value]
    localStorage.setItem('groups', JSON.stringify(groups))
}

function loadStarredItems() {
    const items = document.getElementsByClassName('SetPageTerms-term')
    let groups = JSON.parse(localStorage.getItem('groups')) || {}

    for (let item of items) {
        let star = item.getElementsByClassName('hja6hsw a1hp6gla')[0].children[0]
        if (star.className === selected) { star.click() }
        
        // Check for which items to be starred (also checks if you have switched between term and definition)
        const [term, definition] = item.getElementsByClassName('TermText notranslate lang-en')
        const groupTerm = groups[input.value][definition.textContent]
        const groupDefinition = groups[input.value][term.textContent]

        if (groupDefinition === definition.textContent || groupTerm === term.textContent) {
            star.click()
        }
    }
}

/*
https://quizlet.com/787638194/berakningar-flash-cards/

LOCALSTORAGE:
{
    groupName: {
        term: definition
    }
}

*/