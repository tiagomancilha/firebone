import firebase from '../api/firebase'
export default function criarCabo(id, nome, descricao, quantFibrasDoCabo, quantGrupos, gerarIdAutomativo){
    const fibrasPorGrupo = quantFibrasDoCabo / quantGrupos
    
    var fibras = []
    var grupos = []
    var contadorDeFibras = 0
    for(var c = 0; c < quantGrupos; c++){  
        var grupo = [] 
        for(var c2 = 0; c2 < fibrasPorGrupo; c2++){
            contadorDeFibras++
            var fibra = {
                nome: "Fibra " + (c2 + 1) + " (" + contadorDeFibras + ") - Livre",
                numero : c2 + 1,
                geral : contadorDeFibras,
                cor : cores[c2],
                fusao : false
            }
            if(gerarIdAutomativo){
             //   var id = firebase.firestore().collection("postes").doc().id
            //   console.log(id)
               // fibra.id = id
            }
            fibras.push(fibra)
            grupo.push(fibra)
        }
        grupos.push(grupo)
        
    }
    const  cabo = {
        
        quantGrupos: quantGrupos,
        quantFibras : quantFibrasDoCabo,
        nome: nome,
        descricao: descricao,
        fibras: fibras,
        grupos: grupos,

    }
    return cabo
}


const cores = [
    "#33FF33",
    "#FFFB00",
    "#FFFFFF",
    "#00B0F0",
    "#FF2500",
    "#6F30A0",
    "#996633",
    "#FF3399",
    "#000000",
    "#7F7F7F",
    "#FF9901",
    "#01FDFF",
]

export const Cabos = [
    criarCabo(1, "Cabo Backbone SAL-DOV", "",12, 6, false),
    criarCabo(2, "Cabo Backbone SAL-ITD", "",24, 4, false)
]

