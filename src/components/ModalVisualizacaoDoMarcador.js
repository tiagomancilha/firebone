import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet, ActivityIndicator,  View, Text, TextInput, Dimensions, PermissionsAndroid, SafeAreaView, FlatList, TouchableWithoutFeedback, Alert , Modal, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import  MapView,{Marker, Callout} from 'react-native-maps'
import * as Location from 'expo-location';
import firebase from '../api/firebase';


export default function modalVisualizacaoDoMarcador(props) {
    return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={props.visivel}
            onRequestClose={() => {
              
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={[styles.modalText,{fontWeight: "bold"}]}>Descrição do marcador</Text>
                <Text style={styles.modalText}>Informe uma descrição para o marcador</Text>
                <TextInput value={modalValue} style={styles.modalInput} onChangeText={(e) => {
                    
                }}/>
                <View style={{flexDirection: 'row'}}>
                    <Pressable
                    style={[styles.button, styles.buttonOpen, {marginLeft: 10, marginRight: 10}]}
                    onPress={() => {
                      
                        
                       
                    }}
                    >
                    <Text style={styles.textStyle}>Cancelar</Text>
                    </Pressable>
                    <Pressable
                    style={[styles.button, styles.buttonClose, {marginLeft: 10, marginRight: 10}]}
                    onPress={() => {}}
                    >
                    <Text style={styles.textStyle}>Cadastrar</Text>
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
    map: { 
        height,
        width
    },
    picker:{
        position: 'absolute',
        zIndex: 5,
        paddingLeft: 15,
        backgroundColor: '#dddddd',
        top: 10,
      
        marginTop: 60,
        height: 50,
        width: '90%',
        borderRadius: 20,
        textAlign: 'center'
    },
    pickerItem :{
        fontSize: 40,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        backgroundColor: '#f00'
    },
    callout: {
        height: 50,
        width: 100,
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
        marginBottom: 15,
        textAlign: "center"
      },
      modalInput:{         
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc",
        paddingLeft: 10,
        paddingRight: 10,       
        height: 50,
        marginBottom: 10
      }
});
