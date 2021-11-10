"use strict";

let sets = [
    {
        name: "Base Game",
        cards: [
            {a: "Sacred Grove", b: "Alchemist's Tower"},
            {a: "Catacombs of the Dead", b: "Sacrificial Pit"},
            {a: "Cursed Forge", b: "Dwarven Mines"},
            {a: "Coral Castle", b: "Sunken Reef"},
            {a: "Dragon's Lair", b: "Sorcerer's Bestiary"},
        ],
        isActive: true,
    },
    {
        name: "Luxt",
        cards: [
            {a: "Dragon Aerie", b: "Crystal Keep"},
            {a: "Temple of the Abyss", b: "Gate of Hell"},
        ],
        isActive: false,
    },
    {
        name: "Perlae Imperii",
        cards: [
            {a: "Mystical Menagerie", b: "Alchemical Workshop"},
            {a: "Blood Isle", b: "Pearl Bed"},
        ],
        isActive: false,
    }
]

let setList = document.getElementById("set-list")

init()

function init() {
    let setListContainer = document.getElementById("set-list-container")
    let spinner = document.getElementById("spinner")

    for (let i = 0; i < sets.length; i++) {
        let setListNode = createSetListNode(sets[i])
        setList.appendChild(setListNode)
    }

    setListContainer.classList.remove("d-none")
    spinner.classList.add("d-none")
}

function generate() {
    generateMonuments()
    generateCardSets()
}

function generateMonuments() {
    let monumentNode = document.getElementById("monuments-amount")
    monumentNode.innerText = "Monuments: " + getAmountMonuments()
}

function generateCardSets() {
    let activeCards = getActiveCards()
    let baseGameScaling = getBaseGameScaling()
    let amountPlayers = getAmountPlayers()
    let amountCards = getAmountCards(amountPlayers, baseGameScaling)
    if (amountCards > activeCards.length) {
        amountCards = activeCards.length
    }

    let cards = getRandomCards(activeCards, amountCards)

    let chosenCardSides = cards.map(card => getCardSide(card))
    let cardNodes = chosenCardSides.map(cardSide => generateCardNode(cardSide))

    addCardNodesToDom(cardNodes)
}

function addCardNodesToDom(cardNodes) {
    let generatedSetNode = document.getElementById("generated-set")
    generatedSetNode.innerHTML = ""
    cardNodes.forEach(node => generatedSetNode.appendChild(node))
}

function generateCardNode(cardSide) {
    let nodeDiv = document.createElement("div")
    nodeDiv.classList.add("p-2")

    let nodeSpan = document.createElement("span")
    nodeSpan.innerHTML = cardSide.text
    nodeSpan.classList.add("game-card", "game-card-" + cardSide.side, "text-light")

    nodeDiv.appendChild(nodeSpan)

    return nodeDiv
}

function getCardSide(card) {
    let sides = [
        {side: "front", text: card.a},
        {side: "back", text: card.b}
    ]

    return sides[Math.floor(Math.random() * 2)]
}

function getRandomCards(cards, amount) {
    if (cards.length === amount) {
        return cards
    }

    let shadowCopyCards = cards.slice(0)

    let randomCards = []
    while (randomCards.length < amount) {
        let randomIndex = Math.floor(Math.random() * shadowCopyCards.length)
        randomCards.push(shadowCopyCards[randomIndex])
        shadowCopyCards.splice(randomIndex, 1)
    }

    return randomCards
}

function getBaseGameScaling() {
    return document.querySelector('#baseGameScaling').checked
}

function getAmountCards(amountPlayers, baseGameScaling) {
    let amountCards
    if (baseGameScaling) {
        amountCards = 5
    } else {
        amountCards = amountPlayers + 2
    }

    return amountCards
}

function getAmountPlayers() {
    let amountPlayers = document.getElementById("selectAmountPlayers")

    return Number(amountPlayers.value)
}

function getAmountMonuments(playerCount) {
    let monuments = 7
    if (playerCount > 2) {
        monuments = (playerCount * 2 + 4);
    }

    return monuments
}

function getActiveCards() {
    let activeCards = []
    for (var i = 0; i < setList.childNodes.length; i++) {
        let child = setList.childNodes[i]
        if (!child.classList.contains("active")) {
            continue
        }

        let array = JSON.parse(child.dataset.cards)
        array.forEach(it => activeCards.push(it))
    }

    return activeCards
}


function createSetListNode(setObject) {
    let button = document.createElement("button")

    button.id = "btn-set-" + setObject.name.toLowerCase().replaceAll(" ", "-")
    button.name = setObject.name
    button.type = "button"
    button.classList.add("list-group-item", "list-group-item-action", "text-center")

    let activeClass = "active"
    if (setObject.isActive) {
        button.classList.add(activeClass)
    }

    button.innerText = setObject.name
    button.addEventListener("click", () => button.classList.toggle(activeClass))
    button.dataset.cards = JSON.stringify(setObject.cards)

    return button
}