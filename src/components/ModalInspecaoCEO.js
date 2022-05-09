import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet,  View, Text, FlatList, TextInput, Modal, Pressable, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'
import { Cabos } from '../api/Utils'
import firebase from '../api/firebase'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ModalAdicionarCaboNaCEO from './ModalAdicionarCaboNaCEO';
import ModalAdicionarFusao from './ModalAdicionarFusao';

export default function ModalInspecaoCEO(props) {

    const [listaDeCabos, setListaDeCabos] = useState([])
    const [subTitulo, setSubTitulo] = useState("carregando...")
    const [modalAdicionarCaboNaCEO,setModalAdicionarCaboNaCEO] = useState(false)
    const [modalAdicionarFusao, setModalAdicionarFusao] = useState(false)
    const [caboSelecionado, setCaboSelecionado] = useState(null)
    const [fibraSelecionada, setFibraSelecionada] = useState(null)
    const [marcador, setMarcador] = useState(props.ceo)
    const [processando, setProcessando] = useState(false)
    useEffect(()=>{

    },[])

    function converteEmGrupos(fibras,quantFibrasDoCabo , quantGrupos){
        var fibrasPorGrupo = quantFibrasDoCabo / quantGrupos
        var grupos = []
    
        var cont = 0
        for(var c = 0; c < quantGrupos; c++){
            var grupo = []
            
            for(var c2 = 0; c2 < fibrasPorGrupo; c2++){
                var fibra = fibras[cont]
               // console.log("Fibra")
               // console.log(fibra)
                grupo.push(fibra)
                cont++
            }
            console.log('Grupo ' + (c+1) + ": ")
           // console.log(grupo[0])
            grupos.push(grupo)
        }
       // console.log("Converteu em grupos")
       // console.log(grupos)
        return grupos 
    }
    function chamarModalAdicionarFusao(cabo, fibra){
        
        setCaboSelecionado(cabo)
        setFibraSelecionada(fibra)
        setModalAdicionarFusao(true)

    }
    const renderCabo = ({ cabo , index}) => {
       // console.log()
        const quantGrupos = cabo.quantGrupos
        const grupos = cabo.grupos//converteEmGrupos(item.fibras,totalDeFibras, quantGrupos)
        const nomeDoCabo = cabo.nome
        const descricao = cabo.descricao
        const totalDeFibras = cabo.quantFibras
        return(
            <View style={styles.cabo}>
                <Text style={styles.textoCabo}>{nomeDoCabo}</Text>
                <Text style={styles.textoCaboInferior}>{descricao}</Text>
                <Text style={styles.textoCaboInferior}>{"Cabo de " + quantGrupos + " grupo" + (quantGrupos > 1 ? "s" : "") + ". Total " + totalDeFibras + " fibras"}</Text>
                { grupos.map((grupo, igrupo) =>{
                    return(
                        <View style={styles.grupo} key={"" + igrupo}>
                            <Text style={styles.textoGrupo}>{"Grupo " + (igrupo + 1)}</Text>
                            {grupo.map((fibra, ifibra) =>{           
                                return(
                                    <Pressable
                                        key={"" + ifibra}
                                        onPress={()=>{
                                            
                                        }}>
                                            <View style={[styles.containerFibra,{backgroundColor: fibra.cor}]}>
                                                <View style={[styles.fibra]} >
                                                    <Text style={[styles.textoFibra,{backgroundColor: fibra.cor, color : fibra.cor == "#000000"? "#FFFFFF" : "#000000"}]}>{"Fibra " + fibra.numero + " (" + fibra.geral + ")"}</Text>
                                                    <Text style={[styles.textoFibraInferior,{color : fibra.cor == "#000000"? "#FFFFFF" : "#000000"}]}>{"Livre"}</Text>
                                                </View>
                                                <Pressable
                                                onPress={()=>{chamarModalAdicionarFusao(cabo,(fibra.geral < 1))}}>
                                                    <View style={styles.containerBotoesDaFibra}>
                                                        <MaterialIcons  name="bolt" size={24} color="#222" />
                                                    </View>
                                                </Pressable>
                                            </View>
                                       
                                    </Pressable>
                                )
                            })}
                        </View>
                    )
                })}
            </View>
        )
    }

    function atualizarListaDeCabos(){
        setProcessando(true)
        firebase.firestore().collection("postes").doc(marcador.id).collection("cabos").get()
       .then((snap) =>{       
            var lista = []          
           snap.forEach((item)=>{
                console.log("CABO: ")               
                var cabo = item.data()
                console.log(cabo)
                var quantGrupos = cabo.quantGrupos == undefined ? 2 : cabo.quantGrupos
                var quantFibras = cabo.quantFibras == undefined ? 12 : cabo.quantFibras
                var fibras = cabo.fibras
                cabo.grupos = converteEmGrupos(fibras, quantFibras, quantGrupos)
               // console.log("funcao Atualizar lista de cabos")
               // console.log("Cada cabo encontrado e listado")
               // console.log(cabo)
                lista.push(cabo)
           })
           var le = lista.length
           var s = ""
           if(le == 0) s = "Nenhum cabo inserido"
           else var s = "" + le + " cabo" + (le > 1 ? "s" : "") + " inserido" + (le > 1 ? "s" : "")
           setSubTitulo(s)
            setListaDeCabos(lista)   
            setProcessando(false)                
        })
        .catch((erro) =>{
            console.log("Erro:")
            console.log(erro)
        })
    }
    useEffect(()=>{
        atualizarListaDeCabos()
    },[])

    function addCabo( cabo ){

        var caboAux = cabo
        caboAux.quantFibras = parseInt(cabo.quantFibras)
        caboAux.quantGrupos = parseInt(cabo.quantGrupos)
        caboAux.grupos = ""
        if(caboAux.nome == ""){
            caboAux.nome = caboAux.id
        }
        
        firebase.firestore().collection("postes").doc(cabo.id).collection("cabos").add(caboAux)
       .then((valor) =>{                 
           console.log("funcao then de insercao de cabo no BD")
          // setListaDeCabos([...listaDeCabos, cabo])     
           atualizarListaDeCabos()                
        })
        .catch((erro) =>{
            console.log("Erro:")
            console.log(erro)
        })
        
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                props.esconder(false)
            }}
            >        
            {modalAdicionarCaboNaCEO && <ModalAdicionarCaboNaCEO marcador={marcador} add={addCabo}  esconder={setModalAdicionarCaboNaCEO}  /> }             
            {modalAdicionarFusao && <ModalAdicionarFusao cabo={caboSelecionado} fibra={fibraSelecionada} marcador={marcador} esconder={setModalAdicionarFusao}/>}        
                    <View style={styles.modalView}>
                        <Text style={styles.tituloCabecalho}>Inspecionando a CEO</Text>
                        <Text style={styles.totalDeCabos}>{subTitulo} </Text>
                        <View style={styles.cabecalho}>
                            <Pressable  style={styles.botao}
                                onPress={()=>{
                                    props.esconder(false)
                                }}>
                                <MaterialIcons  name="keyboard-return" size={48} color="#ccc" />
                            </Pressable> 
                            <Pressable style={styles.botao}
                                onPress={()=>{
                                    //setModalAdicionarCaboNaCEO(true)
                                }}>
                                <MaterialIcons  name="menu" size={48} color="#f39629" />
                            </Pressable>       
                            <Pressable style={styles.botao}
                                onPress={()=>{
                                    setModalAdicionarCaboNaCEO(true)
                                }}>
                                <MaterialIcons  name="plus-one" size={48} color="#2196F3" />
                            </Pressable>       
                        </View>
                        <View style={styles.activityIndicator}>
                            <ActivityIndicator style={styles.ai} animating={processando} size='large' color="2196F3"/>
                        </View>
                        <FlatList 
                            data={listaDeCabos}
                            renderItem={renderCabo}
                            keyExtractor={(item, index) => {
                                return  (item.id + index) + ""                               
                            }}
                            showsVerticalScrollIndicator={false}
                        /> 
                        
                    </View>
                    
                            
                                               
            </Modal>   
        </View>
    )
}

const styles = StyleSheet.create({
   
    centeredView: {
        flex: 1,
        borderColor: "#555",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 35
      },
      modalView: {
       
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      cabo:{
       
        borderRadius: 10,
         
          marginTop: 30,
          marginBottom: 40,
          padding: 10,
          backgroundColor: "#111",
          shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      grupo:{
          backgroundColor: "#ddd",
         
         borderRadius: 10,
        marginTop: 10,
        marginBottom: 10
        

      },
      
      containerFibra:{
          flexDirection: 'row',
          borderColor: "#888",
          justifyContent: 'space-between',
       borderWidth: 1,
       borderRadius: 5,
        width: 280,
        height: 60,
        margin: 5
      },
      fibra:{
        flexDirection: 'column',
       
      },
      containerBotoesDaFibra:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: 50,
        borderRadius: 25,
        borderColor: "#888",
        borderWidth: 1,
        margin: 5,
        backgroundColor: "#fff"
        
        },
      textoFibra:{
        flex: 1,
       
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: 5,
        textAlignVertical:'center',
      },
      textoFibraInferior:{
          flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        paddingLeft: 5,
        textAlignVertical:'center',
      },

      textoCabo:{
         padding: 5,
         backgroundColor:"#111",
          textAlign: 'center',
          fontSize: 22,
          color: "#fff",
          fontWeight: 'bold',
          borderRadius: 10
      },
      textoCaboInferior:{
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        color: "#fff",
        fontWeight: 'bold',
      },
      textoGrupo:{
          fontSize: 16,
          color: '#000',
          fontWeight: 'bold',
          textAlign: 'center'
      },
      cabecalho:{
         padding: 5,
         flexDirection: 'row',
          backgroundColor: "#fff",
         
          borderBottomColor: "#ccc",
          justifyContent: 'space-between',
          width: '100%'
      },
      botao:{
          width: 100,
         
          
          borderRadius: 10,
          height: 50,
          alignItems: "center",
          justifyContent: 'center',
         
      },
      tituloCabecalho:{
          width: '100%',
           textAlign: 'center',
            fontSize: 18,
            padding: 5,
             fontWeight: 'bold',
             borderTopLeftRadius: 10,
             borderTopRightRadius: 10,
              backgroundColor: "#fff",
              color:"#333",
              marginTop: 20

        },
        totalDeCabos:{
            fontSize: 16,
            color: "#aaa"
        },
        activityIndicator:{
       
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            zIndex: 10,
           
           
        },
});