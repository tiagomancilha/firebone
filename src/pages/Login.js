import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { Keyboard, StyleSheet, ActivityIndicator, Image, Animated, KeyboardAvoidingView, View, Text, TextInput, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Password from "../components/Password"
import firebase from '../api/firebase'

export default function Login(){

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [offset] = useState(new Animated.ValueXY({ x: 0 , y : 80}))
    const [opacity] = useState(new Animated.Value(0))
    const [logo] = useState(new Animated.ValueXY({x: 300, y: 200}))


    useEffect(() =>{

        keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',keyboardDidShow)
        keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',keyboardDidHide)

        Animated.parallel([
            Animated.spring(offset.y, {
                toValue: 0,
                speed: 4,
                bounciness: 30
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300
            })
        ]).start()
       
    },[])

    function validarFormulario(){
        if((email == '') || (senha == '')){
            Alert.alert("Preencha os campos Email e Senha")
            return
        }
        var resposta = firebase.firestore().collection("usuarios")
        resposta.where('email', '==', email)
        resposta.where('senha', '==' , senha) 
        resposta.get().then((result) =>{
            if(!result.empty){
                result.forEach((e) => console.log(e.data()))
            }
        }).catch((erro) =>{
            console.log(erro)
        })
    }

    function keyboardDidShow(){
        Animated.parallel([
            Animated.timing(logo.x,{
                toValue: 200,
                duration: 100
            }),
            Animated.timing(logo.y,{
                toValue: 100,
                duration: 100
            })
        ]).start()
    }

    function keyboardDidHide(){
        Animated.parallel([
            Animated.timing(logo.x,{
                toValue: 300,
                duration: 100
            }),
            Animated.timing(logo.y,{
                toValue: 200,
                duration: 100
            })
        ]).start()
    }
    
    return(
        <KeyboardAvoidingView style={styles.background}>
            <View style={styles.containerLogo}>
                <Animated.Image 
                    style={{
                        width: logo.x,
                        height: logo.y,
                        resizeMode: 'contain'
                    }}
                    source={require('../imagens/logo_conexao.png')}
                />
            </View>
            <Animated.View styles={[styles.container,
                {
                    transform:[
                        {  translateY: offset.y }
                    ]
                }]}>
                <TextInput 
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#777"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(txt) =>{ setEmail(txt)}}
                />

                <Password textChange={setSenha}/>

                <TouchableOpacity style={styles.buttonSubmit}
                    onPress={() =>{ validarFormulario()}}
                >
                    <Text style={styles.textSubmit}>Acessar</Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      //  backgroundColor: '#670304',
        backgroundColor: '#fff',
        width: '100%'
    },
    containerLogo:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        borderColor: "#ddd",
        borderWidth: 2
    },
    input:{
        backgroundColor: '#f1c300',
        
        height: 50,
        padding: 10,
        marginBottom: 15,
        marginTop: 15,
        color: '#222',
        fontSize: 18,
        borderRadius: 5
    },
    buttonSubmit:{
        marginTop: 15,
        marginBottom: 20,
        backgroundColor: "#d62e2e",
      
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    textSubmit:{
       // color: '#d62e2e',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})