import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet,  View, Text, TextInput, Modal, Pressable, FlatList, TouchableOpacity} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import firebase from '../api/firebase'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
export default function ModalSelecionarTipoDeMarcador(props) {  
    
    function selecionarTipo(tipo){
        console.log(tipo)
        props.tipoSelecionado(tipo)
        props.esconder(false)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    return (
     
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"

                    transparent={false}
                    onRequestClose={() => {
                        props.esconder(false)
                    }}
                >     
                    
                        <View style={styles.modalView}>
                            <Text style={styles.titulo}>Escolha um tipo para o marcador</Text>
                            <TouchableOpacity onPress={() => selecionarTipo("REPETIDORA")}>
                                <View style={styles.botaoView}>
                                    <Text style={styles.textoDoBotao}>Estação Repetidora</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => selecionarTipo("SD")}>
                                <View style={styles.botaoView}>
                                    <Text style={styles.textoDoBotao}>SD(CTOs)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => selecionarTipo("CTO")}>
                                <View style={styles.botaoView}>
                                    <Text style={styles.textoDoBotao}>CTO(NAP)</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selecionarTipo("CEO")}>
                                <View style={styles.botaoView}>
                                    <Text style={styles.textoDoBotao}>CEO(Emenda)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => selecionarTipo("CLIENTE")}>
                                <View style={styles.botaoView}>
                                    <Text style={styles.textoDoBotao}>Cliente</Text>
                                </View>
                            </TouchableOpacity>

                            

                            <TouchableOpacity onPress={() => selecionarTipo("PENDENCIA")}>
                                <View style={styles.botaoView}>
                                    <Text style={styles.textoDoBotao}>Pendência</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => props.esconder(false)}>
                                <View style={[styles.botaoView , {backgroundColor: "#006494", width: 320}]}>
                                    <MaterialIcons name="reply" size={36} color="#fff"/>
                                </View>
                            </TouchableOpacity>
                        </View> 
                </Modal> 
            </View>
      
                
     
    );
}

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
      //  borderColor: "#555",
      //  borderWidth: 3,
        justifyContent: "center",
        alignItems: "center",
       // marginTop: 10
      },
    modalView: {   
        flex: 1,
        padding: 20,   
        alignSelf: 'center',      
        margin: 10,
       // height: 500,
        //width: '80%',
       // backgroundColor: "#fff",
      //  borderRadius: 15,
       // borderColor:"#999",
      //  borderWidth: 3,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
//shadowOffset: {
          //  width: 0,
          //  height: 2
     //   },
       // shadowOpacity: 0.5,
        //shadowRadius: 4,
      //  elevation: 5
    },
    titulo:{
        fontSize: 20,
        height: 60,
        width: 320,
        fontWeight: 'bold',
        marginBottom: 5,
        borderRadius: 5,
        color: '#FFF',
        textAlignVertical: 'center',
        textAlign: 'center',
        backgroundColor: "#006494",
        paddingLeft: 5,
        paddingRight: 5
    },
    botaoView:{
        width: 280,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#aaa",
        backgroundColor: '#ccc',
        margin: 10,
        padding: 5,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 10
    },
    textoDoBotao: {
        fontSize: 19,
        fontWeight: 'bold'
    }
});