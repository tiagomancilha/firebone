import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet,  View, Text, TextInput, Modal, Pressable, TouchableWithoutFeedback, Animated} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'


export default function Cabecalho(props){

  const tamanhoTotal = new Animated.Value(-1000)
  

  useEffect(()=>{
      mostrarCabecalho(props.show)
      console.log(">>>>>>---------------->>>>>>>>" + props.show)
    },[props.show])

  //props.mostrarCabecalho()

  function mostrarCabecalho(sim){
    if(sim){
      Animated.timing(tamanhoTotal, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start(()=>tamanhoTotal.setValue(0));
     // 
    }
    else{
      Animated.timing(tamanhoTotal, {
        toValue: -1000,
        duration: 1000,
        useNativeDriver: false
      }).start();
     
    }
  }
    var backbone = null
   
    if(props.dados == null){
      backbone = {
        nome : "-",
        comprimento : "-",
        origem : "-",
        destino : "-",
        descricao : "-"
      }
      
    } 
    else{
      backbone = props.dados
    }
    return(
      <TouchableWithoutFeedback
        onPress={() =>{
         
        }}>
        <Animated.View  style={[styles.container,{transform: [{translateY: tamanhoTotal}]}]}>
            
                <View style={styles.linhaSuperior}>
                    <Text style={{fontSize: 18, fontWeight: "bold"}}>{backbone.nome}</Text>
                    <Text style={[styles.comprimento,{fontSize: 18}]}>{backbone.comprimento}m</Text>
                </View>
                <View style={styles.linhaInferior}>
                    <Text>{backbone.origem}</Text>
                    <Text>{backbone.destino}</Text>
                </View>
                <View style={styles.terceiraLinha}>
                  <Text style={styles.descricao}>{backbone.descricao}</Text>
                  <TouchableWithoutFeedback
                  onPress={() =>{
                    console.log("simm")
                    
                    }}>
                    <View style={styles.btnVisualizar}>
                      <MaterialIcons name="menu" size={36} color="#254048"/>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
            
           
        </Animated.View>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container:{
      
        position: 'absolute',
        top: 0,  
        justifyContent: 'center',
        alignItems: 'center',   
        borderColor: "#bbb",
        borderWidth: 4,
        padding: 5,
        marginBottom:8,
        backgroundColor: "#ddd",
        width: "100%",
    },
      linhaSuperior:{
        
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
       
        
       
      },
      comprimento:{
        backgroundColor: "#254048",
        color: "#fff",
        padding: 5,
        borderRadius: 5
      },
      linhaInferior:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
      },
      terceiraLinha:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between', 

      },
      descricao: {
         flex: 1,
         
         borderColor: "#000",
        
      },
      
      btnVisualizar:{
        
        padding: 5,
       
      }
})