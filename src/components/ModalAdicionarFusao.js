import React,{  useEffect, useState }  from 'react'
import { StyleSheet,  View, Text, TextInput, Modal, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import criarFusao from '../api/Variaveis';

import { MaterialIcons } from '@expo/vector-icons'

import firebase from '../api/firebase';
export default function ModalAdicionarFusao(props) {

    const[descricao, setDescricao] = useState("Fusão")
    const[nomeDoCabo, setNomeDoCabo] = useState("-")
    const[fibraSelecionada, setFibraSelecionada] = useState(props.fibra)
    const[fibraSelecionadaDoPicker, setFibraSelecionadaDoPicker] = useState({nome: "Processando...", id:14})
    const[listaDeCabos, setListaDeCabos] = useState([{nome: "Processando...", id:11}])
    const[listaDeFibrasDoCaboSelecionado, setListaDeFibrasDoCaboSelecionado] = useState([])
    const[caboSelecionado, setCaboSelecionado] = useState(props.cabo)
    const[titulo, setTitulo] = useState('')


    
    useEffect(() =>{
        var v = "Fibra " + (props.fibra.numero) + " (" + props.fibra.geral + ")"
        setTitulo(v)
        firebase.firestore().collection("postes").doc(props.marcador.id).collection("cabos").get()
        .then((snap) =>{
            var lista = []
            snap.forEach((c)=>{
                var cabo = c.data()
                if(cabo.nome != caboSelecionado){
                    lista.push(cabo)
                }
            })
            setListaDeCabos(lista)
        }).catch((erro) =>{})
    },[])

    
    
    function carregarFibrasDoCaboSelecionado(itemValue, itemIndex){
       
        setNomeDoCabo(itemValue)
       // console.log("Mudou o cabo para " + itemValue)
        firebase.firestore().collection("postes").doc(props.marcador.id)
            .collection("cabos").get()
            .then((snap) =>{
                var fibras = []
                snap.forEach((c)=>{
                    var cabo = c.data()
                  //  console.log("Cabo")
                 //   console.log(cabo.data())
                    if(cabo.nome == itemValue){
                      // console.log("teste 1")
                       console.log(cabo)
                      // fibras = cabo.fibras
                       console.log("encontrou ")
                       setListaDeFibrasDoCaboSelecionado(cabo.fibras) 
                    }    
                 //console.log("Fibra:  >> ")   
                 
                })
               
               // console.log(fibras)   
             //   
               
            }).catch((erro) =>{})
    }

    function realizarFusao(){
        var objeto = {
            caboA: caboSelecionado,
            fibraA: fibraSelecionada,
            caboB: nomeDoCabo,
            fibraB: fibraSelecionadaDoPicker,

        }
        firebase.firestore().collection("postes").doc(props.marcador.id)
        .collection("fusoes").add(objeto)
            .then((obj)=>{
                console.log("Gravou na colecao fusoes")
                console.log(obj)
                props.esconder(false)
            }).catch((erro) =>{
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
               
              <View style={styles.modalView}>
                  <Text style={styles.titulo}>Realizando a fusão no cabo</Text>
                  <Text style={styles.titulo}>{caboSelecionado}</Text>
                  <Text style={[styles.titulo,{backgroundColor: props.fibra.cor, color: props.fibra.cor == "#000000" ? "#FFFFFF" : "#000000"}]}>{titulo}</Text>
                  <TextInput style={styles.campoFusao} placeholder='Informações sobre a fusão' />
                  <Text style={styles.titulo}>Selecione o cabo</Text>
                  <View style={styles.pickerContainer}>
                    <Picker                                                      
                        mode='dropdown'
                        selectedValue={nomeDoCabo}
                        onValueChange={carregarFibrasDoCaboSelecionado}
                        itemStyle={styles.pickerItem}
                        > 
                        
                        {listaDeCabos.map( (m, i) => {
                            return <Picker.Item key={m.id} value={m.nome} label={m.nome} />
                        })}                                                                    
                    </Picker>
                  </View>
                  <Text style={styles.titulo}>Selecione a fibra para  a fusão</Text>
                  <View style={styles.pickerContainer}>
                    <Picker                                                      
                        mode='dropdown'
                        selectedValue={fibraSelecionadaDoPicker}
                        onValueChange={(itemValue, itemIndex) => setFibraSelecionadaDoPicker(itemValue)}
                        
                        > 
                            {listaDeFibrasDoCaboSelecionado.map((fibra, index) =>{
                                return <Picker.Item key={index} label={fibra.nome} value={fibra.nome} style={{ backgroundColor: fibra.cor, color:  "#000" }} />
                            })}                                                                            
                    </Picker>
                  </View>
                  <View style={styles.containerBotoes}>
                      <Pressable style={[styles.botao,{backgroundColor: "#ccc"}]}
                      onPress={()=>{
                        props.esconder(false)
                      }}>
                          <MaterialIcons name="keyboard-return" size={48} color="#fff" />
                      </Pressable>
                      <Pressable
                      onPress={()=>{
                        realizarFusao()
                        props.esconder(false)
                      }} style={[styles.botao,{backgroundColor: "#2196F3"}]}>
                          <MaterialIcons name="bolt" size={48} color="#fff" />
                      </Pressable>
                  </View>
              </View>
                    
                            
                                               
            </Modal>   
        </View>
    )
}

const styles = StyleSheet.create({
   
    centeredView: {
        flex: 1,
        
        justifyContent: "center",
        alignItems: "center",
        marginTop: 35
      },
      modalView: {     
        margin: 10,    
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
      titulo:{
          marginTop: 5,
          width: '90%',
          padding: 5,
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 10
      },
      campoFusao:{
          margin: 20,
          width: '90%',
          borderWidth: 1,
          borderColor: "#888",
          fontSize: 16,
          borderRadius: 5,
          padding: 10
          
      },
      containerBotoes:{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
      },
      botao:{
          height: 60,
          width: 100,
          margin: 10,
          borderRadius: 10,
          borderColor: "#ddd",
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center'
      },
      pickerContainer:{
          width: '100%',
        marginTop: 15,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
      },
      pickerItem:{
        fontSize: 50,
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'center',
        backgroundColor: '#f00'
      }
});