let estado = { valor: 0 }
let contNode = 0
let nodeLink = false
let tapEdge = true
let tapNode = true
let floatDiv = true
let isNotDirected = true
let idModify = ''
let ant = ''
let antRemove = ''
let cy = cytoscape({
    container: document.getElementById('cy'),

    elements: [],
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#666',
                'label': 'data(id)'
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#666',
                'target-arrow-color': '#ccc',
                "curve-style": "bezier"
            }
        }
    ],

    layout: {
        name: 'grid',
        rows: 1
    }

})

cy.on('tap', function (event) {
    displayOptionsNodeOff(false)
    let evtTarget = event.target
    if (evtTarget === cy) {
        cy.add({
            group: 'nodes',
            data: {
                id: String(contNode),
                weight: 1
            },
            position: { x: event.position.x, y: event.position.y }
        })
        contNode++
        nodeLink = false
    }
})

cy.on('tap', 'node', function (evt) {
    displayOptionsNodeOff(false)
    let node = evt.target
    if (!tapNode && node.id() == antRemove) {
        cy.remove(String("#" + node.id()))
        tapNode = true
        nodeLink = false
    } else if (nodeLink) {
        cy.add({
            group: 'edges',
            data: { id: String(ant) + String(node.id()), source: String(ant), target: String(node.id()) }
        })
        nodeLink = false
        tapNode = true
    } else {
        ant = String(node.id())
        nodeLink = true
        antRemove = node.id()
        tapNode = false
    }
})

cy.on('tap', 'edge', function (evt) {
    displayOptionsNodeOff(false)
    let edge = evt.target
    if (tapEdge) {
        antRemove = edge.id()
        tapEdge = false
    } else if (!tapEdge && edge.id() == antRemove) {
        cy.remove(String("#" + edge.id()))
        tapEdge = true
    }
    console.log(edge.id())
})

function exportPng() {
    displayOptionsNodeOff(false)
    let png64 = cy.png('graph.png')
    document.location.href = png64.replace("image/png", "image/octet-stream")
}

function makeListaAdj() {
    let G = []

    cy.nodes().map(noDaTela => {
        G[parseInt(noDaTela.data('id'))] = []
    })


    cy.edges().map(arestaDaTela => {
        let source = parseInt(arestaDaTela.source().data('id'))
        let target = parseInt(arestaDaTela.target().data('id'))
        //let valorPeso =parseFloat( arestaDaTela.data('label'))

        if (G[source] == undefined)
            G[source] = []
        G[source].push(target)
        if (G[target] == undefined)
            G[target] = []
        G[target].push(source)
    })

    G.forEach(element => {
        element.sort()
    })

    return G
}

cy.on("cxttap", "node", function (evt) {
    let node = evt.target
    idModify = node.id()
    if (floatDiv) {
        document.getElementById("click").click()
        document.addEventListener('contextmenu', function onMouseUpdate(e) {
            floatDiv = false
            let x = e.pageX
            let y = e.pageY
            document.getElementById('optionsNode').style.top = String(y) + "px"
            document.getElementById('optionsNode').style.left = String(x) + "px"
            document.getElementById('optionsNode').style.display = 'block'
        })
    }
})

function displayOptionsNodeOff(optionAction) {
    if (optionAction) {
        let cor = document.getElementById('optionColor').value
        cy.style().selector("#" + String(idModify)).style('background-color', String(cor)).update()
    }
    document.getElementById('optionsNode').style.display = 'none'
    floatDiv = true
}

function resetColor() {
    cy.edges().map(ele => {
        ele.style({ "line-color": "#666" })
    })
}

function estadosDFS(op) {
    let estadoAnt = []
    if (op && estado.valor < matrizEstado.length) {
        estado.valor++
        if (estado.valor > 1)
            estadoAnt = matrizEstado[estado.valor - 1][4]
    } else if (estado.valor > 0) {
        estadoAnt = matrizEstado[estado.valor][4]
        estado.valor--
    }
    if (estado.valor < matrizEstado.length) {
        let table = document.getElementById('tableDFS');
        table.innerHTML = ""
        for (let i = 0; i < matrizEstado[estado.valor][0].length; i++) {
            let linhaEstado = "<tr><td>" + i + "</td><td>" + matrizEstado[estado.valor][0][i] + "</td><td>" + matrizEstado[estado.valor][1][i] + "</td><td>" + matrizEstado[estado.valor][2][i] + "</td><td>" + matrizEstado[estado.valor][3][i] + "</td></tr>"
            table.insertAdjacentHTML("beforeend", linhaEstado)
        }
        if (op)
            coloreGrafo(matrizEstado[estado.valor][4])
        else
            coloreGrafo(estadoAnt, "#666")
    }
}

function estadosBFS(op) {
    let estadoAnt = []
    if (op && estado.valor < matrizEstado.length) {
        estado.valor++
        if (estado.valor > 1)
            estadoAnt = matrizEstado[estado.valor - 1][4]
    } else if (estado.valor > 0) {
        estadoAnt = matrizEstado[estado.valor][4]
        estado.valor--
    }
    if (estado.valor < matrizEstado.length) {
        let filaHTML = document.getElementById('fila');
        filaHTML.innerHTML = ""
        filaHTML.insertAdjacentHTML("beforeend", matrizEstado[estado.valor][3])
        let table = document.getElementById('tableBFS');
        table.innerHTML = ""
        for (let i = 0; i < matrizEstado[estado.valor][0].length; i++) {
            let linhaEstado = "<tr><td>" + i + "</td><td>" + matrizEstado[estado.valor][0][i] + "</td><td>" + matrizEstado[estado.valor][1][i] + "</td><td>" + matrizEstado[estado.valor][2][i] + "</td></tr>"
            table.insertAdjacentHTML("beforeend", linhaEstado)
        }
        if (op)
            coloreGrafo(matrizEstado[estado.valor][4])
        else
            coloreGrafo(estadoAnt, "#666")
    }
}

function coloreGrafo(vetor, corEst) {
    if (corEst == undefined) {
        vetor.forEach(ele => {
            cy.$(ele[0]).style({ "line-color": ele[1] })
        })
    } else {
        vetor.forEach(ele => {
            cy.$(ele[0]).style({ "line-color": corEst })
        })
    }
}