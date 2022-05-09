import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet,  View, Text, TextInput, Modal, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'

export default function ModalAdicaoDeMarcador(props) {

    const [descricao, setDescricao] = useState("")
    const [tipoDeMarcador, setTipoDeMarcador] = useState("Poste")
    const [tipoDePoste, setTipoDePoste] = useState("Concessionária")
    const [titulo, setTitulo] = useState('')
    const [visivel, setVisivel] = useState(false)

    const storeTipoDeMarcador = async (value) => {
      try {
        await AsyncStorage.setItem('TIPO_DE_MARCADOR', value)
      } catch (e) {
        // saving error
      }
    }

    const storeTipoDePoste = async (value) => {
      try {
        await AsyncStorage.setItem('TIPO_DE_POSTE', value)
      } catch (e) {
        // saving error
      }
    }

    useEffect(() =>{
      const getTipoDeMarcador = async () => {
        try {
          const value = await AsyncStorage.getItem('TIPO_DE_MARCADOR')
          if(value !== null) {
            setTipoDeMarcador(value)
          }
          else{
            setTipoDeMarcador('Poste')
          }
        } catch(e) {
          // error reading value
        }
      }

      const getTipoDePoste = async () => {
        try {
          const value = await AsyncStorage.getItem('TIPO_DE_POSTE')
          if(value !== null) {
            setTipoDePoste(value)
          }
          else{
            setTipoDeMarcador('Concessionária')
          }
        } catch(e) {
          // error reading value
        }
      }
      getTipoDeMarcador()
      getTipoDePoste()
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
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={[styles.modalText,{fontWeight: "bold", fontSize: 20}]}>Adicionando um marcador</Text>
                <Text style={styles.modalText}>Tipo de marcador</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        style={styles.pickerModalAddMarcador}
                        mode='dropdown'
                        selectedValue={tipoDeMarcador}
                        onValueChange={(itemValue, itemIndex) => {
                          setTipoDeMarcador(itemValue)
                          storeTipoDeMarcador(itemValue)
                        }}
                        itemStyle={styles.pickerItem}
                        >              
                            <Picker.Item label="Poste" value="Poste" color="red" />
                            <Picker.Item label="CEO" value="CEO" color="blue" />
                            <Picker.Item label="Sobra técnica" value="Sobra técnica" color="purple" />
                    </Picker>
                </View>
                {(tipoDeMarcador == "Poste") && 
                  <View style={styles.pickerContainer}>
                    <Picker
                        style={styles.pickerModalAddMarcador}
                        mode='dropdown'
                        selectedValue={tipoDePoste}
                        onValueChange={(itemValue, itemIndex) => {
                          setTipoDePoste(itemValue)
                          storeTipoDePoste(itemValue)
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
                    value={titulo} 
                    style={[styles.modalInput,{height: 50}]}
                    onChangeText={(e) => {
                    setTitulo(e) 
                }}/>
                <Text style={styles.modalText}>Descrição do marcador</Text>
                <TextInput
                    value={descricao} 
                    style={styles.modalInput}
                    multiline={true} 
                    onChangeText={(e) => {
                    setDescricao(e) 
                }}/>
                
                <View style={{flexDirection: 'row'}}>
                    <Pressable
                    style={[styles.button, styles.buttonOpen, {marginLeft: 10, marginRight: 10}]}
                    onPress={() => {
                      //  setModalValue("")
                        //setProcessing(false)
                        props.esconder(false)
                    }}
                    >
                   <MaterialIcons name="keyboard-return" size={36} color="#fff"/>
                    </Pressable>
                    <Pressable
                    style={[styles.button, styles.buttonClose, {marginLeft: 10, marginRight: 10}]}
                    onPress={() => {
                        const item = {}
                        item.tipo = tipoDeMarcador
                        if(tipoDeMarcador == 'Poste'){
                          item.tipoDePoste = tipoDePoste
                        }
                        item.titulo = titulo
                        item.descricao = descricao
                        props.cadastrarMarcador(item)
                    }}
                    >
                    <MaterialIcons name="save" size={36} color="#fff"/>
                    </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          
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
        marginTop: 5,
        marginBottom: 5,
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
        marginTop: 5,
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
      buttonOpen: {
        backgroundColor: "#ccc",
        color: "#f00"
      
      },
      buttonClose: {
        backgroundColor: "#2196F3",
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
      }
});