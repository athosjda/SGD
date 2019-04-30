let matrizEstado = []
function DFSChamada(v, u) {
    estado.valor = 0
    let posEstado = { valor: 0 }
    matrizEstado = []
    let cor = []
    let pi = []
    let d = [], f = []
    let tempo = { valor: 0 }
    let G = makeListaAdj()
    let i = 0
    for (i = 0; i < G.length; i++) {
        cor[i] = "Branco"
        pi[i] = null
        d[i] = 0
        f[i] = 0
    }
    let estadoCor = []
    matrizEstado.push([cor.slice(), pi.slice(), d.slice(), f.slice(), estadoCor.slice()])
    DFS(v, u, G, cor, tempo, d, f, pi, matrizEstado, posEstado)
    for (i = 0; i < G.length; i++) {
        if (cor[i] == 0) {
            DFS(i, u, G, cor, tempo, d, f, pi, posEstado)
        }
    }
    document.getElementById('table2').style.display = 'none'
    document.getElementById('table1').style.display = 'block'
    estadosDFS(false)
}
function DFS(v, u, G, cor, tempo, d, f, pi, posEstado) {
    tempo.valor += 1
    let estadoCor = []
    d[v] = tempo.valor
    cor[v] = "Cinza"
    G[v].forEach(w => {
        if (cor[w] == "Branco") {
            if (cy.$("#" + String(v) + String(w)).length == 1) {
                estadoCor.push(["#" + String(v) + String(w), "#388e3c"])
            } else {
                estadoCor.push(["#" + String(w) + String(v), "#388e3c"])
            }
            pi[w] = parseInt(v)
            matrizEstado.push([cor.slice(), pi.slice(), d.slice(), f.slice(), estadoCor.slice()])
            DFS(w, v, G, cor, tempo, d, f, pi, posEstado)
        } else {
            if (w != u) {
                if (cy.$("#" + String(v) + String(w)).length == 1) {
                    estadoCor.push(["#" + String(v) + String(w), "#fbc02d"])
                } else {
                    estadoCor.push(["#" + String(w) + String(v), "#fbc02d"])
                }
                matrizEstado.push([cor.slice(), pi.slice(), d.slice(), f.slice(), estadoCor.slice()])
            }
        }
    })
    cor[v] = "Preto"
    tempo.valor += 1
    f[v] = tempo.valor
    matrizEstado.push([cor.slice(), pi.slice(), d.slice(), f.slice(), estadoCor.slice()])
    posEstado.valor += 1
}

function BFSChamada(v) {
    estado.valor = 0
    matrizEstado = []
    let cor = []
    let fila = []
    let d = []
    let pi = []
    let G = makeListaAdj()
    let estadoCor = []
    for (i = 0; i < G.length; i++) {
        cor[i] = "Branco"
        pi[i] = null
        d[i] = 0
    }
    fila.push(parseInt(v))
    matrizEstado.push([cor.slice(), pi.slice(), d.slice(), fila.slice(), estadoCor.slice()])
    BFS(v, G, cor, fila, pi, d, estadoCor)
    document.getElementById('table1').style.display = 'none'
    document.getElementById('table2').style.display = 'block'
    console.log(matrizEstado)
    estadosBFS(false)
}
function BFS(s, G, cor, fila, pi, d, estadoCor) {
    cor[s] = "Cinza"
    matrizEstado.push([cor.slice(), pi.slice(), d.slice(), fila.slice(), estadoCor.slice()])
    while (fila.length != 0) {
        v = fila[0]
        G[v].forEach(w => {
            if (cor[w] == "Branco") {
                if (cy.$("#" + String(v) + String(w)).length == 1) {
                    estadoCor.push(["#" + String(v) + String(w), "#388e3c"])
                } else {
                    estadoCor.push(["#" + String(w) + String(v), "#388e3c"])
                }
                cor[w] = "Cinza"
                pi[w] = v
                d[w] = d[v]+1
                fila.push(w)
                matrizEstado.push([cor.slice(), pi.slice(), d.slice(), fila.slice(), estadoCor.slice()])
            } else {
                if (fila.indexOf(w) != -1) {
                    if (cy.$("#" + String(v) + String(w)).length == 1) {
                        estadoCor.push(["#" + String(v) + String(w), "#fbc02d"])
                    } else {
                        estadoCor.push(["#" + String(w) + String(v), "#fbc02d"])
                    }
                    matrizEstado.push([cor.slice(), pi.slice(), d.slice(), fila.slice(), estadoCor.slice()])
                }
            }
        })
        cor[v] = "Preto"
        fila.shift()
        matrizEstado.push([cor.slice(), pi.slice(), d.slice(), fila.slice(), estadoCor.slice()])
    }
}