import React,{useEffect, useState} from 'react';

import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Picker, ActivityIndicator, Alert } from 'react-native';
import {Marker, Callout} from 'react-native-maps'


export default function SD(props){

    const identificadores = props.marcador.nome.split('-')
    return(
       
            <Marker
            coordinate={{latitude: props.marcador.latitude, longitude: props.marcador.longitude}}
            title={'SD ' + props.marcador.nome}
            description={props.quantCTOs + " -"}
            anchor={{x: 0.5, y: 0.5}}
            onPress={()=>{
                console.log('Realmente clicou no marcador')
                props.clicouNoMarcador(props.marcador)
            }}
        >
            <TouchableWithoutFeedback
                onPress={()=>{
                    console.log('Realmente clicou no marcador')
                    props.clicouNoMarcador(props.marcador)
                }}>
                    <View style={styles.container}>
                
                            <Text style={styles.textoDoMarcador}>{identificadores[0]}</Text>
                            <Text style={styles.textoDoMarcador}>{identificadores[1]}</Text>
                    
                    </View>
            </TouchableWithoutFeedback>
            </Marker>
       
    )
}

const styles = StyleSheet.create({
    container:{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#aaa",
        
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#666",
        borderWidth: 3
    },
    textoDoMarcador:{
       
        textAlign:'center',
        textAlignVertical:'center',
        fontSize: 12,
        fontWeight: 'bold',
        color:"#333",
        width: 48,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',     
        borderRadius: 2,
        borderColor: '#000',
        borderWidth: 2  
       
    }
})