import firebase from 'firebase';



  export default firebase;

  export function _ApiPesquisarListaDeCidades(){
    return firebase.firestore().collection("cidades").get()
  }

  export function _ApiPesquisarGruposPorTipoECidade(tipo, cidade){
   return  firebase.firestore().collection("grupos").where("tipo", "==", tipo).where("cidadeDeOrigem", "==", cidade).get()
  }

  export function _ApiPesquisarGrupoPeloNome(nomeDoGrupo){
    return firebase.firestore().collection("grupos").where("nome", "==", nomeDoGrupo).limit(1).get()
  }

  export function _ApiPesquisarGruposPeloTipo(tipoDoGrupo){
    return firebase.firestore().collection("grupos").where("tipo", "==", tipoDoGrupo).get()
  }

  export function _ApiPesquisarSdsPeloIdDoGrupoPai(idDoGrupoPai){
    return firebase.firestore().collection("ceos").where("id_grupo_pai", "==", idDoGrupoPai).where("tipo","==","SD").get()
  }

  export function _ApiPesquisarSdPeloNome(nomeDoSD){
    return firebase.firestore().collection("ceos").where("nome", "==", query).limit(1).get()
  }

  export function _ApiAdicionarCto(marcador){
    return firebase.firestore().collection("ctos").add(marcador)
  }
  
  export function _ApiPesquisarCTOsPeloIdDoSdPai(idDoSD){
    return firebase.firestore().collection("ctos").where("id_sd_pai", "==", idDoSD).get()
  }

  export function _ApiPesquisarCtoEspecifica(idDoSD, nomeDaCto){
    return firebase.firestore().collection("ctos").where("id_sd_pai", "==", idDoSD).where("nome", "==", nomeDaCto).limit(1).get()
  }