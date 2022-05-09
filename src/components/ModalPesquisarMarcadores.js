import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet,  View, Text, FlatList, TextInput, Modal, Keyboard,  Pressable, ActivityIndicator, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

import firebase ,
{
    _ApiPesquisarGrupoPeloNome,
    _ApiPesquisarSdsPeloIdDoGrupoPai,
    _ApiPesquisarSdPeloNome,
    _ApiPesquisarCTOsPeloIdDoSdPai,
    _ApiPesquisarCtoEspecifica
} from '../api/firebase';

import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default function ModalPesquisarMarcadores(props) {

    const [carregandoPesquisaSDs, setCarregandoPesquisaSDs] = useState(false)
    const [carregandoPesquisaCTOs, setCarregandoPesquisaCTOs] = useState(false)
    const [resultadoDaPesquisaDeSDs, setResultadoDaPesquisaDeSDs] = useState([])
    const [resultadoDaPesquisaDeCTOs, setResultadoDaPesquisaDeCTOs] = useState([])
    const [textoDaPesquisa, setTextoDaPesquisa] = useState('')
    const [grupoSelecionado, setGrupoSelecionado] = useState(null)
    const [sdSelecionado, setSdSelecionado] = useState({nome: ''})
    const [tituloCtosCadastradas, setTituloCtosCadastradas] = useState('')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function clicouEmPesquisar(){   

    Keyboard.dismiss()
    setSdSelecionado(null)
    setResultadoDaPesquisaDeSDs([])
    setResultadoDaPesquisaDeCTOs([])
    const query = textoDaPesquisa.trim()
    const identificadoresDaPesquisa = query.split('-')
    switch(identificadoresDaPesquisa.length){
        case 1:
            pesquisarGrupo(query)
        break;

        case 2:
            pesquisarSD(query)
        break;

        case 3:
            pesquisarCTO(query)
        break;
    }
    setCarregandoPesquisaSDs(false)
    setCarregandoPesquisaCTOs(false)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pesquisarGrupo(query){
    
    setCarregandoPesquisaSDs(true)
    setSdSelecionado(null)
    _ApiPesquisarGrupoPeloNome(query)
       .then((queryGrupo) =>{
           // var listaGrupo = []
            var grupo = {}
            queryGrupo.forEach((doc) => {               
                grupo = doc.data()
                grupo.id = doc.id                       
              //  listaGrupo.push(grupo)             
            })
            setGrupoSelecionado(grupo)
            //setResultadoDaPesquisaDeSDs(listaSD)
            _ApiPesquisarSdsPeloIdDoGrupoPai(grupo.id) 
                .then((queryCEOs) =>{
                var listaCEOs = []
                queryCEOs.forEach((doc) => {               
                    var ceo = doc.data()
                    ceo.id = doc.id                       
                    listaCEOs.push(ceo)
                })
                setSdSelecionado(listaCEOs[0])
                setResultadoDaPesquisaDeSDs(listaCEOs)
            })
            .catch((error) =>{ console.log(error)})
        })
        .catch((error) =>{ console.log(error)})
        setTituloCtosCadastradas('')
            (false)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pesquisarSD(query){
    //console.log("A query foi " + query)
    setCarregandoPesquisaSDs(true)
    setSdSelecionado(null)
    setResultadoDaPesquisaDeSDs([])
    setResultadoDaPesquisaDeCTOs([])
    _ApiPesquisarSdPeloNome(query)
        .then((querySD) =>{
            var listaSD = []
            var sd = {}
            querySD.forEach((doc) => {               
                sd = doc.data()
                sd.id = doc.id                       
               listaSD.push(sd)             
            })
            setSdSelecionado(sd)
            setResultadoDaPesquisaDeSDs(listaSD)
            _ApiPesquisarCTOsPeloIdDoSdPai(sd.id)
                .then((queryCTOs) =>{
                var listaCTOs = []
                queryCTOs.forEach((doc) => {               
                    var cto = doc.data()
                    cto.id = doc.id                       
                    listaCTOs.push(cto)
                })
                setResultadoDaPesquisaDeCTOs(listaCTOs)
                setTituloCtosCadastradas(montarTituloDeCTOsCadastradas)
            })
            .catch((error) =>{ console.log(error)})
        })
        .catch((error) =>{ console.log(error)})
        setCarregandoPesquisaSDs(false)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pesquisarCTO(query){
    setSdSelecionado(null)
    setResultadoDaPesquisaDeSDs([])
    setResultadoDaPesquisaDeCTOs([])
    const idents = query.split('-')
    _ApiPesquisarSdPeloNome(idents[0] + '-' + idents[1])
        .then((querySD) =>{
            var listaSD = []
            var sd = {}
            querySD.forEach((doc) => {               
                sd = doc.data()
                sd.id = doc.id                       
               listaSD.push(sd)
            })
            setSdSelecionado(sd)
            setResultadoDaPesquisaDeSDs(listaSD)
            _ApiPesquisarCtoEspecifica(sd.id, query)
            .then((queryCTO) =>{
                var listaCTO = []
                queryCTO.forEach((doc) => {               
                    var cto = doc.data()
                    cto.id = doc.id                       
                    listaCTO.push(cto)
                })
                setResultadoDaPesquisaDeCTOs(listaCTO)
                setTituloCtosCadastradas(montarTituloDeCTOsCadastradas)
            })
            .catch((error) =>{ console.log(error)})
        })
        .catch((error) =>{ console.log(error)})
    
       // setCarregandoPesquisa(false)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderItemDaPesquisa({item}){
    return(
        <TouchableOpacity
            onPress={()=> {
                setSdSelecionado(item)
                pesquisarCTOsDoSDPeloId(item)
            }}>
            <View style={[styles.itemDaListaDePesquisa, {backgroundColor: item.tipo == 'SD' ? "#fff" : "#ddd"}]}>
                
                <View style={{flexDirection: 'column'}}>
                    <Text style={{fontSize: 11, fontWeight: 'bold', color: "#777", marginLeft: 8}}>{item.tipo}</Text>
                    <Text style={{fontSize: 17, fontWeight: 'bold', color: "#555", marginLeft: 8}}>{item.nome}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity
                     onPress={()=> {}} style={{marginLeft: 10}}>
                        { item.tipo == 'CTO' && <View>
                            <MaterialIcons name="person" size={36} color="#006494"/>
                        </View>}
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginLeft: 10}}
                        onPress={()=>{
                            props.share(item)
                            props.esconder(false)
                        }}>
                            <View>
                                <MaterialIcons name="share" size={36} color="#006494"/>
                            </View>
                    </TouchableOpacity>
                           
                    <TouchableOpacity style={{marginLeft: 10}}
                        onPress={()=>{
                            props.marcadorSelecionado(item)
                            props.esconder(false)
                        }}>
                            <View>
                                <MaterialIcons name="place" size={36} color="#006494"/>
                            </View>
                    </TouchableOpacity>

                </View>

            </View> 
        </TouchableOpacity>
    )
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pesquisarCTOsDoSDPeloId(marcador_pai){
    setCarregandoPesquisaCTOs(true)
    _ApiPesquisarCTOsPeloIdDoSdPai(marcador_pai.id) 
        .then((querySnapshot) =>{
            var listaAux = []
            querySnapshot.forEach((doc) => {               
                var dados = doc.data()
                dados.id = doc.id                       
               listaAux.push(dados)
            })
            setResultadoDaPesquisaDeCTOs(listaAux)
            setTituloCtosCadastradas(montarTituloDeCTOsCadastradas(marcador_pai.nome, listaAux.length))
        })
        .catch((error) =>{ console.log(error)})
        setCarregandoPesquisaCTOs(false)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function montarTituloDeCTOsCadastradas(nome, quantCTOs){
    var ret = '';
    var s = quantCTOs > 1 ? 's' : ''
    if(quantCTOs > 0){
        ret = quantCTOs + ' CTO' + s + ' cadastrada' + s + ' em ' + nome
    }
    else{
        ret = 'Não há CTOs cadastradas para ' + nome
    }
    return ret
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={props.visivel}
                onRequestClose={() => {
                props.esconder(false)
            }}
            >        
                <View style={styles.modalView}>
                    <Text style={styles.titulo}>Informe a identificação do marcador</Text>
                    <TextInput
                        style={styles.textoDaPesquisa}
                        placeholder='Ex SAL01, POA03-02, PAS-SAL, ...'
                        value={textoDaPesquisa} 
                        autoCapitalize = {"characters"}
                        onChangeText={(v) =>{setTextoDaPesquisa(v)}}>
                    </TextInput>
                    
                   <View style={styles.containerBotaoPesquisar}>
                    <TouchableOpacity
                            onPress={clicouEmPesquisar}>
                                <Text style={styles.textoBotaoPesquisar}>Pesquisar</Text>
                        </TouchableOpacity>
                   </View>
                    
                    {carregandoPesquisaSDs && <ActivityIndicator animating={carregandoPesquisaSDs} size='large' color="#006494"/>}
                    {resultadoDaPesquisaDeSDs.length > 0 && <FlatList
                        style={[styles.listaDoResultadoDaPesquisa,{backgroundColor: "#ddd"}]}
                        showsVerticalScrollIndicator={false}
                        data={resultadoDaPesquisaDeSDs}
                        renderItem={renderItemDaPesquisa}
                        keyExtractor={item => item.id}>

                    </FlatList>}
                     {tituloCtosCadastradas != ''  &&   <Text style={styles.tituloCtosCadastradas}>{tituloCtosCadastradas} </Text>}

                    {carregandoPesquisaCTOs && <ActivityIndicator animating={carregandoPesquisaCTOs} size='large' color="#006494"/>}
                    {resultadoDaPesquisaDeCTOs.length > 0 && <FlatList
                        style={styles.listaDoResultadoDaPesquisa}
                        showsVerticalScrollIndicator={false}
                        data={resultadoDaPesquisaDeCTOs}
                        renderItem={renderItemDaPesquisa}
                        keyExtractor={item => item.id}>

                    </FlatList>}
                </View>                                   
            </Modal>   
        </View>
    )
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
}

const styles = StyleSheet.create({
   
    centeredView: {
        flex: 1,
        borderColor: "#555",
        borderWidth: 3,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
      },
      modalView: {
       flex: 1,
       // margin: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
       // borderRadius: 10,
        borderColor: "#888",
       // borderWidth: 5,
       // padding: 5,
        alignItems: "center",
        shadowColor: "#000",
        //shadowOffset: {
         // width: 0,
         // height: 2
        //},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      titulo:{
        fontSize: 20,
        marginTop:15,
        height: 50,
        textAlign: 'center',textAlignVertical:'center',
        
        padding: 5,
        backgroundColor: "#006494",
        width: '100%',
        fontWeight: 'bold',
        color: '#fff'
      },
      tituloCtosCadastradas:{
        fontSize: 14,
        marginTop:5,
        width: "100%",
        fontWeight: 'bold',
        color: '#555',
        backgroundColor: "#ddd",
        padding: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
       // borderRadius: 5,
        borderWidth: 1,
        borderColor: '#999'

      },
      containerBotaoPesquisar:{
        width: "90%"
      },
      textoDaPesquisa:{
        width: "90%",
        paddingLeft: 5,
          height: 50,
          borderColor: '#aaa',
          borderWidth: 1,
          borderRadius: 20,
          fontSize: 18,
          letterSpacing: 2,
          fontWeight:  'bold',
          textAlign: 'center',
          marginTop: 5,
          color: '#444'

      },
      textoBotaoPesquisar:{
          textAlign: 'center',
          textAlignVertical:'center',
          height: 50,
          fontWeight: 'bold',
          fontSize: 18,
          borderRadius: 20,
          borderColor: '#777',
          backgroundColor: '#006494', 
          color:'#fff',
          marginTop: 5,
          marginBottom: 5
      },
      listaDoResultadoDaPesquisa:{
          borderColor: '#999',
          flex: 1,
          borderWidth: 1,
          width: '90%',
          marginTop: 5,
          borderRadius: 5
      },
      itemDaListaDePesquisa:{
          justifyContent:'space-between',
          alignItems:'center',
          backgroundColor:'#ddd',
          flexDirection: 'row',
          height: 60,
          margin: 5,
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 5,
          marginTop: 5,
          marginBottom: 5
      }
      
});