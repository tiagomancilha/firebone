//const listaDeSDS = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50"]
import React,{useEffect, useState} from 'react';

import { Text, View, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity, Picker, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../api/firebase'
import { LinearGradient } from 'expo-linear-gradient';

const NUMERO_MAXIMO_DE_SDS_POR_GRUPO = 60
//////////////////////////////////////////////////////////////////////////////////////////////////////
const storeNomeDaCidade = async (value) => {
    try {
      await AsyncStorage.setItem('NOME_DA_CIDADE_DA_TELA_ADICAO_DE_SD', value)
      console.log('Gravou no Storage a cidade ' + value)
    } catch (e) {
      // saving error
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
const storeNomeDoGrupo = async (value) => {
    try {
      await AsyncStorage.setItem('NOME_DO_GRUPO_DA_TELA_ADICAO_DE_SD', value)
    } catch (e) {
      // saving error
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////





export default function TelaAdicaoDeMarcadorSD({route, navigation}) {


    const [listaDeSDS, setListaDeSDS] = useState([])
    const [listaDeGrupos, setListaDeGrupos] = useState([])
    const [listaDeCidades, setListaDeCidades] = useState([])
    const [cidadeSelecionada, setCidadeSelecionada] = useState("")
    const [grupoSelecionado, setGrupoSelecionado] = useState(null)
    const [tipoDeGrupo, setTipoDeGrupo] = useState([])
    const [nomeDoGrupo, setNomeDoGrupo] = useState("")
    const [sdSelecionado, setSdSelecionado] = useState(null)
    const [referencia, setReferencia] = useState("")
    const [descricao, setDescricao] = useState("")
    const [informacoes, setInformacoes] = useState("")
    const [numeroDoSD, setNumeroDoSD] = useState("")
    const [carregandoCidades, setCarregandoCidades] = useState(false)
    const [carregandoSDs, setCarregandoSDs] = useState(false)
    const [carregandoGrupos, setCarregandoGrupos] = useState(false)
    const [gravando, setGravando] = useState(false)

//////////////////////////////////////////////////////////////////////////////////////////////////////
    const getListaDeCidadesDoBD = async () =>{
            firebase.firestore().collection("cidades").get()
            .then((querySnapshot) =>{
                var listaAux = []
                querySnapshot.forEach((doc) => {               
                    var dados = doc.data()
                    dados.id = doc.id                       
                    listaAux.push(dados)
                })
                setListaDeCidades(listaAux)              
            })
            .catch((error) =>{ console.log(error)})
    }
//////////////////////////////////////////////////////////////////////////////////////////////////
    const getStoredNomeDaCidade = async () =>{
        try {
            const value = await AsyncStorage.getItem('NOME_DA_CIDADE_DA_TELA_ADICAO_DE_SD')
            if(value !== null) {
                setCidadeSelecionada(value)
            }
            else{
                
            }
          } catch(e) {
            // error reading value
          }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////
    const getStoredNomeDoGrupo = async () =>{
        try {
            const value = await AsyncStorage.getItem('NOME_DO_GRUPO_DA_TELA_ADICAO_DE_SD')
            if(value !== null) {
                setNomeDoGrupo(value)
            }
            else{
                setNomeDoGrupo('')
            }
          } catch(e) {
            // error reading value
          }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////
    const getGruposDeSDs = async () =>{
        
        firebase.firestore().collection("grupos").where("tipo", "==", "GRUPO(SDS)").get()
            .then((querySnapshot) =>{
                var listaAux = []
                querySnapshot.forEach((doc) => {               
                    var dados = doc.data()
                    dados.id = doc.id                       
                    listaAux.push(dados)
                })
                setListaDeGrupos(listaAux)
                
            })
            .catch((error) =>{ console.log(error)})
            getStoredNomeDoGrupo()
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function teste(){
    setCarregandoSDs(true)
    var listaSDs = []
    var listaDeNomesDeSDS = []
    var listaFinal = []
    firebase.firestore().collection("ceos").where("id_grupo_pai", "==", grupoSelecionado.id).where("tipo","==","SD").get()
    .then((query) =>{
        query.forEach((doc) => {               
            var sd = doc.data()
            sd.id = doc.id
            sd.status = "ATIVO"                       
            listaSDs.push(sd)
            listaDeNomesDeSDS.push(sd.numeroDoSD)
        })
        for(var c = 0; c < NUMERO_MAXIMO_DE_SDS_POR_GRUPO; c++){
            var titulo = c > 8 ? "" + (c + 1) : "0" + (c + 1)
            
            if(!listaDeNomesDeSDS.includes(titulo)){
                listaFinal.push({
                    status:"LIVRE",
                    nome: grupoSelecionado.nome + "-" + titulo,
                    numeroDoSD: titulo
                })
            }           
        }
        const list = listaSDs.concat(listaFinal)
        list.sort(function(a,b) {
            return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
        });
        setListaDeSDS(list)
        setNumeroDoSD(list[0].numeroDoSD)
        setCarregandoSDs(false)
    })
    .catch((error) =>{ console.log(error)}) 
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
    const adicionarMarcadorNoBD = () =>{
        console.log('clicou em gravar o SD ' + sdSelecionado.status)
        if(sdSelecionado.status == 'ATIVO'){
            Alert.alert("O SD " + nomeDoGrupo + "-" + numeroDoSD + ' já está cadastrado')
            return
        }
        setGravando(true)
        var marcador = {
            id_grupo_pai: grupoSelecionado.id,
            indice: 0,
            tipo : "SD",
            nome: nomeDoGrupo + "-" + numeroDoSD,
            numeroDoSD: numeroDoSD,
            referencia: referencia,
            descricao: descricao,
            informacoes: informacoes,
            pendencia: "",
            latitude: route.params.pontoSelecionado.latitude,
            longitude: route.params.pontoSelecionado.longitude,
        }
        firebase.firestore().collection("ceos").add(marcador).then((docRef) =>{ 
             var marc = marcador
             marc.id =  docRef.id
            route.params.onGoBack(marc)
            navigation.goBack()
              
             
        }).catch((erro) =>{
        console.log(erro)
        })
        setGravando(false)
    }
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
async function carregarPickers() {
    setCarregandoCidades(true)
    setCarregandoGrupos(true)
    setCarregandoSDs(true)
    await firebase.firestore().collection("cidades").get()
    .then((queryCidades) =>{
        var listaCidades = []
        queryCidades.forEach((doc) => {               
            var cidade = doc.data()
            cidade.id = doc.id                       
            listaCidades.push(cidade)
        })
        setListaDeCidades(listaCidades) 
        try {
            const cidadeStored =  AsyncStorage.getItem('NOME_DA_CIDADE_DA_TELA_ADICAO_DE_SD')
            console.log("Cidade gravada anteriormente:" + cidadeStored)
            var cidade = listaDeCidades[0].nome
            if(cidadeStored != null) {
                cidade = cidadeStored
            }
            setCidadeSelecionada(cidade)
                firebase.firestore().collection("grupos").where("tipo", "==", "GRUPO(SDS)").where("cidadeDeOrigem", "==", cidade).get()
                .then((queryGrupos) =>{
                    var listaGrupos = []
                    queryGrupos.forEach((doc) => {               
                        var grupo = doc.data()
                        grupo.id = doc.id                       
                        listaGrupos.push(grupo)
                    })
                    setListaDeGrupos(listaGrupos)   
                    setNomeDoGrupo(listaDeGrupos[0].nome)
                    setGrupoSelecionado(listaDeGrupos[0]) 
                    setCarregandoGrupos(false)
                    var listaAux = []
                    var listaDeNomesDeSDS = []
                    var listaFinal = []
                    firebase.firestore().collection("ceos").where("id_grupo_pai", "==", listaDeGrupos[itemIndex].id).where("tipo","==","SD").get()
                    .then((query) =>{
                        query.forEach((doc) => {               
                            var dados = doc.data()
                            dados.id = doc.id 
                            dados.status = "ATIVO"                      
                            listaAux.push(dados)
                            listaDeNomesDeSDS.push(dados.numeroDoSD)
                        })
               
                        for(var c = 0; c < NUMERO_MAXIMO_DE_SDS_POR_GRUPO; c++){
                            var titulo = c > 8 ? "" + (c + 1) : "0" + (c + 1)
                            
                            if(!listaDeNomesDeSDS.includes(titulo)){
                                listaFinal.push({
                                    status:"LIVRE",
                                    nome: listaDeGrupos[itemIndex].nome + "-" + titulo,
                                    numeroDoSD: titulo
                                })
                            }           
                        }
                        const list = listaAux.concat(listaFinal)
                        list.sort(function(a,b) {
                            return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
                        });
                        setListaDeSDS(list)
                        setSdSelecionado[list[0]]
                        setCarregandoSDs(false)
                    })
                    .catch((error) =>{ console.log(error)})              
                })
                .catch((error) =>{ console.log(error)})

            
        } catch(e) {
            
        }             
    })
    .catch((error) =>{ console.log(error)})
    setCarregandoCidades(false)
    
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
const mudouOGrupo = (novoGrupo, itemIndex) => {
    setCarregandoSDs(true)
    console.log("mudou para grupo:" + novoGrupo + 'na posicao ' + itemIndex )
    setNomeDoGrupo(novoGrupo)
    setGrupoSelecionado(listaDeGrupos[itemIndex])
    setNomeDoGrupo(listaDeGrupos[itemIndex].nome)
    storeNomeDoGrupo(novoGrupo)
    var listaAux = []
    var listaDeNomesDeSDS = []
    var listaFinal = []
    console.log("ID do grupo > " + listaDeGrupos[itemIndex].id + "------->")
    firebase.firestore().collection("ceos").where("id_grupo_pai", "==", listaDeGrupos[itemIndex].id).where("tipo","==","SD").get()
    .then((query) =>{
        query.forEach((doc) => {               
            var dados = doc.data()
            dados.id = doc.id 
            dados.status = "ATIVO"                      
            listaAux.push(dados)
            listaDeNomesDeSDS.push(dados.numeroDoSD)
        })
        //var contador = listaDeNomesDeSDS.length
        //console.log("NUMERO:" + contador)
        for(var c = 0; c < NUMERO_MAXIMO_DE_SDS_POR_GRUPO; c++){
            var titulo = c > 8 ? "" + (c + 1) : "0" + (c + 1)
            
            if(!listaDeNomesDeSDS.includes(titulo)){
                listaFinal.push({
                    status:"LIVRE",
                    nome: listaDeGrupos[itemIndex].nome + "-" + titulo,
                    numeroDoSD: titulo
                })
            }           
        }
        const list = listaAux.concat(listaFinal)
        list.sort(function(a,b) {
            return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
        });
        setListaDeSDS(list)
        setSdSelecionado(list[0])
        setCarregandoSDs(false)
    })
    .catch((error) =>{ console.log(error)}) 
 }


//////////////////////////////////////////////////////////////////////////////////////////////////////
const mudouACidadeNoPicker = (novaCidade, itemIndex) => {
 
    setCarregandoGrupos(true)
    setCarregandoSDs(true)
    setCidadeSelecionada(novaCidade)
    firebase.firestore().collection("grupos").where("tipo", "==", "GRUPO(SDS)").where("cidadeDeOrigem", "==", novaCidade).get()
        .then((queryGrupos) =>{
            var listaGrupos = []
            queryGrupos.forEach((doc) => {               
                var grupo = doc.data()
                grupo.id = doc.id                       
                listaGrupos.push(grupo)
            })
            listaGrupos.sort(function(a,b) {
                return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
            });
            setListaDeGrupos(listaGrupos)
            setGrupoSelecionado(listaGrupos[0])
            setNomeDoGrupo(listaGrupos[0].nome)
            setCarregandoGrupos(false)
            //storeNomeDoGrupo(listaDeGrupos[0].nome)
            
            var listaSDs = []
            var listaDeNomesDeSDS = []
            var listaFinal = []
            //console.log("ID> " + listaDeGrupos[0].id)
            firebase.firestore().collection("ceos").where("id_grupo_pai", "==", listaGrupos[0].id).where("tipo","==","SD").get()
            .then((query) =>{
                query.forEach((doc) => {               
                    var sd = doc.data()
                    sd.id = doc.id
                    sd.status = "ATIVO"                       
                    listaSDs.push(sd)
                    listaDeNomesDeSDS.push(sd.numeroDoSD)
                })
                for(var c = 0; c < NUMERO_MAXIMO_DE_SDS_POR_GRUPO; c++){
                    var titulo = c > 8 ? "" + (c + 1) : "0" + (c + 1)
                    
                    if(!listaDeNomesDeSDS.includes(titulo)){
                        listaFinal.push({
                            status:"LIVRE",
                            nome: listaGrupos[0].nome + "-" + titulo,
                            numeroDoSD: titulo
                        })
                    }           
                }
                const list = listaSDs.concat(listaFinal)
                list.sort(function(a,b) {
                    return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
                });
                setListaDeSDS(list)
                setNumeroDoSD(list[0].numeroDoSD)
                setSdSelecionado(list[0])
                setCarregandoSDs(false)
                storeNomeDaCidade(novaCidade)
            })
            .catch((error) =>{ console.log(error)})          
        })
    .catch((error) =>{ console.log(error)})

}
//////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() =>{
       // getListaDeCidadesDoBD()
       // getGruposDeSDs()
       // setNumeroDoSD(listaDeSDS[0])
        carregarPickers()
    },[])
/////////////////////////////////////////////////////////////////////////////////////////////////////  
    return (
        <ScrollView>
                <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.titulo}>Adicionando um grupo(SD)</Text>

        <View style={styles.miniContainer}>
            <Text style={styles.subTitulo}>Selecione a Cidade para o marcador</Text>
            {carregandoCidades && <ActivityIndicator animating={carregandoCidades} size='large' color="black"/>}
            {!carregandoCidades && <Picker
                style={styles.picker}
                mode='dropdown'
                selectedValue={cidadeSelecionada}
                onValueChange={mudouACidadeNoPicker}
                itemStyle={styles.pickerItem}
                >     
                    { listaDeCidades.map((item, i) => {
                        return (<Picker.Item key={i}  label={item.nome} value={item.nome} color="black" />)
                    })}
                    
            </Picker>}
        </View>
        <View style={styles.miniContainer}>
            <Text style={styles.subTitulo}>Selecione um grupo para o marcador</Text>
            {carregandoGrupos && <ActivityIndicator animating={carregandoGrupos} size='large' color="black"/>}
            {!carregandoGrupos && <Picker
                style={styles.picker}
                mode='dropdown'
                selectedValue={nomeDoGrupo}
                onValueChange={mudouOGrupo}
                itemStyle={styles.pickerItem}
                >     
                    { listaDeGrupos.map((item, i) => {
                        return (<Picker.Item key={item.id}  label={item.nome} value={item.nome} color="black" />)
                    })}
                    
            </Picker>}
        </View>

        <View style={styles.miniContainer}>
            <Text style={styles.subTitulo}>Informe uma identificação para o Grupo(SD)</Text>
            {carregandoSDs && <ActivityIndicator animating={carregandoSDs} size='large' color="black"/>}
            {!carregandoSDs && <Picker
                style={styles.picker}
                mode='dropdown'
                selectedValue={numeroDoSD}
                onValueChange={(itemValue, itemIndex) => {
                    setNumeroDoSD(itemValue)
                    setSdSelecionado(listaDeSDS[itemIndex])
                }}
                itemStyle={styles.pickerItem}
                >              
                    { 
                        listaDeSDS.map((value, index) =>{
                        return  ( <Picker.Item key={index}
                            label={value.status == 'ATIVO' ?  value.nome + " - " + "<< " + value.status + " >>" : value.nome + " - " + " (" + value.status + ") "}
                            value={value.numeroDoSD} color={value.status == 'ATIVO' ? "#4a4" : "#000"}/>)
                        })
                    }
                    
            </Picker>}
        </View>
        <View style={styles.miniContainer}>
            <Text style={styles.subTitulo}>Referência</Text>
            <TextInput   placeholder='' placeholderTextColor={"#aaa"} style={styles.campoReferencia} value={referencia} onChangeText={setReferencia}/>
        </View>
        <View style={styles.miniContainer}>
            <Text style={styles.subTitulo}>Descrição</Text>
            <TextInput multiline   placeholder='' placeholderTextColor={"#aaa"} style={styles.campoDescricao} value={descricao} onChangeText={setDescricao}/>
        </View>
        <View style={styles.miniContainer}>
            <Text style={styles.subTitulo}>Informações adicionais</Text>
            <TextInput multiline   placeholder='' placeholderTextColor={"#aaa"} style={styles.campoInformacoes} value={informacoes} onChangeText={setInformacoes}/>
        </View>
        
        <View style={styles.containerBotao}>
            <TouchableOpacity onPress={adicionarMarcadorNoBD}>
                <Text style={styles.botaoText}>Concluir</Text>
            </TouchableOpacity>
        </View>
        
        
            
    </View>
        </ScrollView>
         
    
  );
}

const styles = StyleSheet.create({

    picker:{
        height: 50,
        width: 250,
        borderRadius: 10,
        borderWidth: 1,
        textAlign: 'center',
    },
    titulo:{
        width: '100%',
        height: 50,
        fontSize: 20,
        fontWeight:'bold',
        padding: 5,
        color: '#fff',
        marginTop: 10,
        marginBottom: 5,
        backgroundColor:"#006494",
        textAlignVertical:'center',
        textAlign: 'center',
       // borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    subTitulo:{
        fontSize: 14,
        fontWeight: 'bold'
    },

    miniContainer: {
       
        width: '90%',
        padding: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#aaa',
        backgroundColor: "#ddd"
    },
    containerBotao:{
        width: '90%',
        height: 50,
        padding: 5,
        marginTop:5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#aaa',
        backgroundColor: "#006494"
    },
    botaoText:{
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fff"
    },
    pickerItem:{
        fontSize: 60,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        backgroundColor: '#f00'
    },
    campoReferencia:{
        height: 60,
        width: '100%',
        borderColor: "#bbb",
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingLeft: 5,
        borderWidth: 1,
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        //letterSpacing: 1
    },
    campoDescricao:{
        height: 120,
        width: '100%',
        borderColor: "#bbb",
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingLeft: 5,
        borderWidth: 1,
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
       // letterSpacing: 1
    },
    campoInformacoes:{
        height: 120,
        width: '100%',
        borderColor: "#bbb",
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingLeft: 5,
        borderWidth: 1,
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
       // letterSpacing: 1
    }
})



