//const listaDeSDS = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50"]
import React,{useEffect, useState, useRef} from 'react';

import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity, ScrollView, Picker, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase, {
    _ApiPesquisarListaDeCidades,
     _ApiPesquisarGruposPeloTipo,
      _ApiAdicionarCto,
      _ApiPesquisarGruposPorTipoECidade,
      _ApiPesquisarSdsPeloIdDoGrupoPai
    } from '../api/firebase'

const NUMERO_MAXIMO_DE_SDS_POR_GRUPO = 60
//////////////////////////////////////////////////////////////////////////////////////////////////////
const storeNomeDaCidade = async (value) => {
    try {
      await AsyncStorage.setItem('NOME_DA_CIDADE_DA_TELA_ADICAO_DE_CTO', value)
      console.log('Gravou no Storage a cidade ' + value)
    } catch (e) {
      // saving error
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
const storeNomeDoGrupo = async (value) => {
    try {
      await AsyncStorage.setItem('NOME_DO_GRUPO_DA_TELA_ADICAO_DE_CTO', value)
    } catch (e) {
      // saving error
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////





export default function TelaAdicaoDeMarcadorCTO({route, navigation}) {

    const nomeDaCTORef = useRef()

    const [listaDeSDS, setListaDeSDS] = useState([])
    const [listaDeGrupos, setListaDeGrupos] = useState([])
    const [listaDeCidades, setListaDeCidades] = useState([])
    const [cidadeSelecionada, setCidadeSelecionada] = useState("")
    const [grupoSelecionado, setGrupoSelecionado] = useState(null)
    const [tipoDeGrupo, setTipoDeGrupo] = useState([])
    const [nomeDoGrupo, setNomeDoGrupo] = useState("")
    const [sdSelecionado, setSdSelecionado] = useState(null)
    const [numeroDoSD, setNumeroDoSD] = useState("")
    const [carregandoCidades, setCarregandoCidades] = useState(false)
    const [carregandoSDs, setCarregandoSDs] = useState(false)
    const [carregandoGrupos, setCarregandoGrupos] = useState(false)
    const [gravando, setGravando] = useState(false)
    const [nomeDaCTO, setNomeDaCTO] = useState('')
    const [referencia , setReferencia] = useState('')
    const [descricao , setDescricao] = useState('')
    const [informacoes , setInformacoes] = useState('')

//////////////////////////////////////////////////////////////////////////////////////////////////////
    const getListaDeCidadesDoBD = async () =>{
            _ApiPesquisarListaDeCidades()
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
            const value = await AsyncStorage.getItem('NOME_DA_CIDADE_DA_TELA_ADICAO_DE_CTO')
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
            const value = await AsyncStorage.getItem('NOME_DO_GRUPO_DA_TELA_ADICAO_DE_CTO')
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
function mudarNomeDaCTO(novoNome){
   // var novo = novoNome.toUpperCase()
    setNomeDaCTO(novoNome)
}
///////////////////////////////////////////////////////////////////////////////////////////////////
    const getGruposDeSDs = async () =>{
        
        _ApiPesquisarGruposPeloTipo("GRUPO(SDS)")
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
    const adicionarMarcadorNoBD = () =>{
        if(nomeDaCTO == ''){
            Alert.alert('Informe uma identificação para a CTO')
            return
        }
        setGravando(true)
        var nome = nomeDoGrupo + "-" + numeroDoSD + '-' + nomeDaCTO
        var marcador = {
            id_sd_pai: sdSelecionado.id,
            indice: 0,
            tipo : "CTO",
            nome: nome,
            nomeDaCTO: nomeDaCTO,
            referencia: referencia,
            descricao:descricao,
            informacoes: informacoes,
            pendencia: "",
            latitude: route.params.pontoSelecionado.latitude,
            longitude: route.params.pontoSelecionado.longitude,
        }
        Alert.alert("Confirmação","Confirmar gravação da CTO " + nome, [
            {
                text: 'Sim',
                onPress : () => {
                    _ApiAdicionarCto.then((docRef) =>{ 
                        setGravando(false)
                        Alert.alert("CTO " + nome +  " cadastrada com sucesso")
                        marcador.id = docRef.id
                        route.params.onGoBack(marcador)
                        navigation.goBack()
                    }).catch((erro) =>{
                    console.log(erro)
                    })
                }
            },
            {
                text: 'Não',
                onPress: () =>{
                }
            }
        ])
        setGravando(false)

    }
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
async function carregarPickers() {
    //setCarregandoCidades(true)
    setCarregandoGrupos(true)
    setCarregandoSDs(true)
    await _ApiPesquisarListaDeCidades()
        .then((queryCidades) =>{
            var listaCidades = []
            queryCidades.forEach((doc) => {               
                var cidade = doc.data()
                cidade.id = doc.id                       
                listaCidades.push(cidade)
            })
            setListaDeCidades(listaCidades) 
            setCarregandoCidades(false)
        try {
            const cidadeStored =  AsyncStorage.getItem('NOME_DA_CIDADE_DA_TELA_ADICAO_DE_CTO')
            console.log("Cidade gravada anteriormente:" + cidadeStored)
            var cidade = listaDeCidades[0].nome
            if(cidadeStored != null) {
                cidade = cidadeStored
            }
            setCidadeSelecionada(cidade)
            _ApiPesquisarGruposPorTipoECidade( "GRUPO(SDS)", cidade)
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
                   _ApiPesquisarSdsPeloIdDoGrupoPai(listaDeGrupos[itemIndex].id)
                    .then((query) =>{
                        query.forEach((doc) => {               
                            var dados = doc.data()
                            dados.id = doc.id 
                            dados.status = "ATIVO"                      
                            listaAux.push(dados)
                        })
               
                        listaAux.sort(function(a,b) {
                            return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
                        });
                        setListaDeSDS(listaAux)
                        setNumeroDoSD(listaAux[0].numeroDoSD)
                        setSdSelecionado(listaAux[0])
                        setCarregandoSDs(false)
                    })
                    .catch((error) =>{ console.log(error)})              
                })
                .catch((error) =>{ console.log(error)})

            
        } catch(e) {
            
        }             
    })
    .catch((error) =>{ console.log(error)})
    
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
const mudouOGrupo = (novoGrupo, itemIndex) => {
   // setCarregandoSDs(true)
    console.log("mudou para grupo:" + novoGrupo + 'na posicao ' + itemIndex )
    setNomeDoGrupo(novoGrupo)
    setGrupoSelecionado(listaDeGrupos[itemIndex])
    setNomeDoGrupo(listaDeGrupos[itemIndex].nome)
    storeNomeDoGrupo(novoGrupo)
    var listaAux = []

    firebase.firestore().collection("ceos").where("id_grupo_pai", "==", listaDeGrupos[itemIndex].id).where("tipo","==","SD").get()
    .then((query) =>{
        query.forEach((doc) => {               
            var dados = doc.data()
            dados.id = doc.id 
            dados.status = "ATIVO"                      
            listaAux.push(dados)
        })
        
        listaAux.sort(function(a,b) {
            return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
        });
        setListaDeSDS(listaAux)
        setNumeroDoSD(listaAux[0].numeroDoSD)
        setSdSelecionado(listaAux[0])
        setCarregandoCidades(false)
        setCarregandoGrupos(false)
        setCarregandoSDs(false)

    })
    .catch((error) =>{ console.log(error)}) 
 }
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
const mudouACidadeNoPicker = (novaCidade, itemIndex) => {
    //setCarregandoCidades(true)
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
           
            firebase.firestore().collection("ceos").where("id_grupo_pai", "==", listaGrupos[0].id).where("tipo","==","SD").get()
            .then((query) =>{
                query.forEach((doc) => {               
                    var sd = doc.data()
                    sd.id = doc.id
                    sd.status = "ATIVO"                       
                    listaSDs.push(sd)
                })
                
                listaSDs.sort(function(a,b) {
                    return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
                });
                setListaDeSDS(listaSDs)
                setNumeroDoSD(listaSDs[0].numeroDoSD)
                setSdSelecionado(listaSDs[0])
                setCarregandoSDs(false)
                setCarregandoCidades(false)
                storeNomeDaCidade(novaCidade)
            })
            .catch((error) =>{ console.log(error)})          
        })
    .catch((error) =>{ console.log(error)})

}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
const mudouOGrupoSD = (itemValue, itemIndex) => {
    setNumeroDoSD(itemValue)
    setSdSelecionado(listaDeSDS[itemIndex])
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() =>{
       // getListaDeCidadesDoBD()
       // getGruposDeSDs()
       // setNumeroDoSD(listaDeSDS[0])
        carregarPickers()
        nomeDaCTORef.current?.focus()
    },[])
/////////////////////////////////////////////////////////////////////////////////////////////////////  
  return (     
    <View>
            <Text style={styles.titulo}>Adicionando uma CTO(NAP)</Text>
        <ScrollView>
        <View
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

    <View style={[styles.miniContainer, {marginTop: 20}]}>
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
            onValueChange={mudouOGrupoSD}
            itemStyle={styles.pickerItem}
            >              
                { 
                    listaDeSDS.map((value, index) =>{
                    return  ( <Picker.Item key={index}
                         label={value.nome }
                          value={value.numeroDoSD} color={"#000"}/>)
                    })
                }
                
        </Picker>}
    </View>

    <View style={styles.miniContainer}>
        <Text style={styles.subTitulo}>Informe uma identificação para a CTO(NAP)</Text>
        <TextInput ref={nomeDaCTORef} autoCapitalize = {"characters"} placeholder='Ex: 02, AB3, 08, XY2' placeholderTextColor={"#aaa"} style={styles.campoNomeDaCTO} value={nomeDaCTO} onChangeText={mudarNomeDaCTO}/>
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
            {gravando && <ActivityIndicator animating={gravando} size='large' color="white"/>}
            {!gravando && <Text style={styles.botaoText}>Concluir</Text>}
        </TouchableOpacity>
    </View>
    
    
    
        
</View>
    </ScrollView>
    
    </View>
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
        textAlignVertical: 'center',
        textAlign: 'center',
        padding: 5,
        height: 50,
        fontSize: 20,
        marginBottom: 10,
       // marginTop: 15,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#006494'
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
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#aaa',
        backgroundColor: "#ddd"
    },
    campoNomeDaCTO:{
        width: '80%',
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        letterSpacing: 3
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
    },
    campoDescricao:{
        height: 150,
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
    },
    campoInformacoes:{
        height: 150,
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
    },
    containerBotao:{
        width: '90%',
        height: 50,
        padding: 5,
        marginTop:5,
        marginBottom: 70,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#aaa',
        backgroundColor: "#006494"
    },
    botaoText:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fff"
    }
})



