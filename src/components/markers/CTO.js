import React,{useEffect, useState} from 'react';

import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity, Picker, ActivityIndicator, Alert } from 'react-native';
import {Marker, Callout} from 'react-native-maps'


export default function CTO(props){

    const identificadores = props.marcador.nome.split('-')
    return(
        <TouchableOpacity
        onPress={()=> {
            props.clicouNoMarcador(props.marcador)
        }}>
            <Marker
                coordinate={{latitude: props.marcador.latitude, longitude: props.marcador.longitude}}
                title={"CTO"}
                description={props.marcador.nome}
                anchor={{x: 0.5, y: 0.5}}
            >           
                <View style={styles.container}>
            
                            <Text style={styles.textoDoMarcador}>{identificadores[0]}</Text>
                            <Text style={styles.textoDoMarcador}>{identificadores[1]}</Text>
                            <Text style={styles.textoDoMarcador}>{identificadores[2]}</Text>
                
                </View>
            </Marker>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 60,
        height: 76,
        borderRadius: 5,
        backgroundColor: "#111",
        
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#222",
        borderWidth: 5
    },
    subContainer:{
        borderColor: "#333",
        borderRadius: 4,
        borderWidth: 1
    },
    textoDoMarcador:{
       
        textAlign:'center',
        textAlignVertical:'center',
        fontSize: 12,
        fontWeight: 'bold',
        color:"#000",
        width: 46,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',     
      //  borderRadius: 1,
       // borderColor: '#000',
       // borderWidth: 2  
       
    }
})