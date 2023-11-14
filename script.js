const input = document.getElementById('name')
const save = document.getElementById('save'); save.onclick = () => saveStarredItems()
const setContainer = document.getElementById('set-container')
let currentTab = ""
let set = ""

function init() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        currentTab = tabs[0]
        const regex = /^https:\/\/quizlet\.com\/\d+\/.*$/
        
        if (!regex.test(currentTab.url)) { window.close(); return }
        
        set = currentTab.url.split('/')[3]
        let dict = JSON.parse(localStorage.getItem('groups')) || {}
        dict[set] = dict[set] || {}
        // Show all available sets
        for (let key of Object.keys(dict[set])) addOption(key)
        localStorage.setItem('groups', JSON.stringify(dict))
    })
}

function saveStarredItems() {
    if (input.value.length === 0) { return false }

    chrome.tabs.sendMessage(currentTab.id, { type: 'save' }, response => {
        let starredItems = response
        let groups = JSON.parse(localStorage.getItem('groups'))

        if (Object.keys(starredItems).length === 0) { return false }
        if (groups[set].hasOwnProperty(input.value)) {
            if (!confirm(`There already exists a group with the name ${input.value}. Do you want to override it?`)) return false
        } else addOption(input.value)

        groups[set][input.value] = starredItems
        localStorage.setItem('groups', JSON.stringify(groups))
        input.value = "";
    })
}

function addOption(name) {
    let c1 = document.createElement('div'); c1.className = 'group'
    let c2 = document.createElement('div'); c2.className = 'group-btns'
    let option = document.createElement('li'); option.textContent = name
    
    let load = document.createElement('button'); load.textContent = "Load"; load.onclick = () => {
        let groups = JSON.parse(localStorage.getItem('groups'))
        chrome.tabs.sendMessage(currentTab.id, { type: 'load', data: groups[set][name] })
    }
    
    let remove = document.createElement('button'); remove.textContent = "Remove"; remove.onclick = () => {
        setContainer.removeChild(load.parentNode.parentNode)
    
        let groups = JSON.parse(localStorage.getItem('groups'))
        delete groups[set][name]
        localStorage.setItem('groups', JSON.stringify(groups))
    }
    
    c2.appendChild(load)
    c2.appendChild(remove)
    c1.appendChild(option)
    c1.appendChild(c2)
    setContainer.appendChild(c1)
}

init()
