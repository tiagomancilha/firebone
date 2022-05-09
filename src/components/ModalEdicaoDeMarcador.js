import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet, ActivityIndicator,  View, Text, TextInput, PermissionsAndroid, FlatList, TouchableWithoutFeedback, Alert , Modal, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons'
import criarCabo from '../api/Utils'
import ModalInspecaoCEO from './ModalInspecaoCEO';

export default function ModalEdicaoDeMarcador(props) {

    const [ceoSelecionada, setCeoSelecionada] = useState(props.markerSelecionado)
    const[modalInspecao, setModalInspecao] = useState(false)
    const [editavel, setEditavel] = useState(false)
    const [tituloDoModal, setTituloDoModal] = useState("Informações do marcador")
    const [descricao, setDescricao] = useState("")
    const [tipoDeMarcador, setTipoDeMarcador] = useState("Poste")
    const [tipoDePoste, setTipoDePoste] = useState(null)
    const [titulo, setTitulo] = useState('')
    const [visivel, setVisivel] = useState(false)
    const [botaoAlterar, setBotaoAlterar] = useState(true)

    useEffect(()=>{
        //setBotaoAlterar(true)
       // console.log('alterou')
     },[tipoDeMarcador,titulo,descricao])

    useEffect(() =>{
        const marker = props.markerSelecionado
      // console.log(marker)
        setTipoDeMarcador(marker.tipo)
        setTitulo(marker.titulo)
        setDescricao(marker.descricao)
        setTipoDePoste(marker.tipoDePoste)
        //console.log(marker)
    },[])

    

    return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
           // visible={props.visivel}
            onRequestClose={() => {
              props.esconder(false)
            }}
            onDismiss={()=>{props.esconder(false)}}
          >
            <View style={styles.centeredView}>
              <View style={[styles.modalView, {backgroundColor: editavel ? "white" : "#e9e9e9"}]}>
                <Text style={[styles.modalText,{fontWeight: "bold", fontSize: 20}]}>{tituloDoModal}</Text>
                <Text style={styles.modalText}>Tipo de marcador</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        enabled={editavel}
                        style={styles.pickerModalAddMarcador}
                        mode='dropdown'
                        selectedValue={tipoDeMarcador}
                        onValueChange={(itemValue, itemIndex) => setTipoDeMarcador(itemValue)}
                        itemStyle={styles.pickerItem}
                        >              
                            <Picker.Item label="Poste" value="Poste" color="red" />
                            <Picker.Item label="CEO" value="CEO" color="blue" />
                            <Picker.Item label="Sobra técnica" value="Sobra técnica" color="purple" />
                    </Picker>
                </View>
                { tipoDeMarcador == "CEO" && 
                  <Pressable
                  onPress={()=>{setModalInspecao(true)}}>
                    <View style={styles.botaoInspecionar}>
                      <Text style={styles.textoBotaoInspecionar}>Inspecionar a CEO</Text>
                    </View>

                </Pressable>
                }
                {tipoDeMarcador == "Poste" && 
                  <View style={styles.pickerContainer}>
                    <Picker
                        enabled={editavel}
                        style={styles.pickerModalAddMarcador}
                        mode='dropdown'
                        selectedValue={tipoDePoste}
                        onValueChange={(itemValue, itemIndex) => {
                          setTipoDePoste(itemValue)
                          
                        }}
                        itemStyle={styles.pickerItem}
                        >              
                            <Picker.Item label="Concessionária" value="Concessionária"  />
                            <Picker.Item label="Starweb" value="Starweb"  />
                            <Picker.Item label="Raimax" value="Raimax"  />
                            <Picker.Item label="Oi" value="Oi"  />
                    </Picker>
                  </View>
                }
                <Text style={styles.modalText}>Título do marcador</Text>
                <TextInput
                
                    editable={editavel}
                    value={titulo} 
                    style={[styles.modalInput,{height: 50},{ color: editavel ? 'black' : '#666' }]}
                    onChangeText={(e) => {
                    setTitulo(e) 
                }}/>
                <Text style={styles.modalText}>Descrição do marcador</Text>
                <TextInput
                    editable={editavel}
                    selectTextOnFocus={false}
                    value={descricao} 
                    style={[styles.modalInput,{ color: editavel ? 'black' : '#666' }]}
                    multiline={true} 
                    onChangeText={(e) => {
                    setDescricao(e) 
                }}/>
                
                <View style={{flexDirection: 'row'}}>
                    <Pressable
                    style={[styles.button, styles.buttonCancelar, {marginLeft: 10, marginRight: 10}]}
                    onPress={() => {
                      props.esconder(false)
                      
                    }}
                    >
                     <MaterialIcons name="keyboard-return" size={36} color="#fff"/>
                    </Pressable>
                    
                    <Pressable
                    disabled={false}
                    style={[styles.button, styles.buttonAlterar, {marginLeft: 10, marginRight: 10, backgroundColor: botaoAlterar ? "#2196F3" : "#ccc"}]}
                    onPress={() => { 
                      setTituloDoModal("Editando o marcador")
                      if(editavel){
                        const item = {}
                        item.id = props.markerSelecionado.id
                        item.tipo = tipoDeMarcador
                        item.tipoDePoste = tipoDeMarcador == "Poste" ? tipoDePoste : null
                        item.titulo = titulo
                        item.descricao = descricao
                        item.latitude = props.markerSelecionado.latitude
                        item.longitude = props.markerSelecionado.longitude
                        console.log(item)
                        props.alterar(item)
                      }
                       setEditavel(!editavel) 
                    }}
                    >
                      {
                        editavel ?  <MaterialIcons name="update" size={36} color="#fff"/> : <MaterialIcons name="edit" size={36} color="#fff"/>
                      }
                      
                    
                    </Pressable>
                    
                    <Pressable
                    enabled={!editavel}
                    style={[styles.button, styles.buttonExcluir, { marginLeft: 10, marginRight: 10},{backgroundColor: editavel ? "#ffbbbb" : "#ff4444"}]}
                    onPress={() => {
                        if(editavel) return
                        props.excluir(props.markerSelecionado)
                        props.esconder(false)
                    }}
                    >
                    <MaterialIcons name="delete" size={36} color="#fff"/>
                    
                    </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          {modalInspecao && <ModalInspecaoCEO ceo={ceoSelecionada} esconder={setModalInspecao}/>}
          
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerContainer:{
      marginTop: 15,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    pickerModalAddMarcador:{
        height: 50,
        width: 250,
        borderRadius: 10,
        borderWidth: 1,
        textAlign: 'center'
    },
    pickerItem :{
        fontSize: 50,
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'center',
        backgroundColor: '#f00'
    },
    callout: {
      //  height: 50,
      //  width: 100,
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5
    },
    calloutTitulo:{
        fontSize: 10,
        fontWeight: 'bold'
    },
    calloutDescricao:{
        fontSize: 8,
        color: '#555',
        fontWeight: 'bold'
    },
    calloutApagar:{
        fontSize: 8,
        color: '#888',
        fontWeight: 'bold'
    },
    activityIndicator:{
       
        justifyContent: 'center',
        alignItems: 'center',
       
        zIndex: 10,
        position: 'absolute',
       
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
      button: {
        borderRadius: 15,
        padding: 10,
        elevation: 2
      },
      buttonCancelar: {
        backgroundColor: "#ccc",
        color: "#f00"
      
      },
      buttonAlterar: {
        
      },
      buttonExcluir: {
       
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
          marginTop: 10,
        marginBottom: 10,
        textAlign: "center"
      },
      modalInput:{
          
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#ccc",
          paddingLeft: 10,
          paddingRight: 10,
         
          height: 100,
          width: 250,
          marginBottom: 10
      },
      botaoInspecionar:{
        width: '100%',
       
        margin: 5,
       
      },
      textoBotaoInspecionar:{
        backgroundColor:"#2196F3",
       
         color: "#fff",
         borderRadius: 10,
          fontSize: 20, 
           padding: 10,
            margin: 10
      }
});