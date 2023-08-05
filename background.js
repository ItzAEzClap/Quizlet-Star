const input = document.getElementById('name')
const save = document.getElementById('save')
const load = document.getElementById('load')
const remove = document.getElementById('remove')
const unselected = "AssemblyButtonBase AssemblyIconButton AssemblyIconButton--tertiary AssemblyIconButton--circle AssemblyButtonBase--medium AssemblyButtonBase--circle"
let tab = ""
let set = ""
init()

function saveStarredItems() {
    if (input.value.length === 0) { return false }

    chrome.tabs.sendMessage(tab.id, { type: 'save' }, response => {
        let starredItems = response
        let groups = JSON.parse(localStorage.getItem('groups'))

        if (Object.keys(starredItems).length === 0) { return false }
        if (groups[set].hasOwnProperty(input.value)) {
            if (!confirm(`There already exists a group with the name ${input.value}. Do you want to override it?`)) {
                return false
            }
        }

        addOption(input.value)
        groups[set][input.value] = starredItems
        localStorage.setItem('groups', JSON.stringify(groups))
    })
}

function removeGroup() {
    let groups = JSON.parse(localStorage.getItem('groups'))
    delete groups[set][input.value]
    removeOption(input.value)
    localStorage.setItem('groups', JSON.stringify(groups))
}

function loadStarredItems() {
    if (input.value.length === 0) { return false }

    let groups = JSON.parse(localStorage.getItem('groups'))
    chrome.tabs.sendMessage(tab.id, { type: 'load', data: groups[set][input.value] })
}


function init() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        tab = tabs[0]
        const regex = /^https:\/\/quizlet\.com\/\d+\/.*$/
        
        if (!regex.test(tab.url)) { window.close() }
        else {
            set = tab.url.split('/')[3]
            let dict = JSON.parse(localStorage.getItem('groups')) || {}
            dict[set] = dict[set] || {}
            // Show all available sets
            for (let key of Object.keys(dict[set])) { addOption(key) }
            localStorage.setItem('groups', JSON.stringify(dict))
        }
    })
}

function addOption(name) {
    let option = document.createElement('option')
    option.textContent = name
    option.type = 'button'
    document.querySelector('section').appendChild(option)
}

function removeOption(name) {
    for (let child of document.querySelector('section').children) {
        if (child.value === name) { document.querySelector('section').removeChild(child) }
    }
}

save.addEventListener('click', saveStarredItems)
load.addEventListener('click', loadStarredItems)
remove.addEventListener('click', removeGroup)