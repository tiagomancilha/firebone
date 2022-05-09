import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet, Share, Vibration, ActivityIndicator,  View, Text, TextInput, Dimensions, PermissionsAndroid, SafeAreaView, FlatList, TouchableWithoutFeedback, Alert , Modal, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import { MaterialIcons } from '@expo/vector-icons'
import ModalSelecionarTipoDeMarcador from '../components/ModalSelecionarTipoDeMarcador';
import ModalPesquisarMarcadores from '../components/ModalPesquisarMarcadores';
import  MapView,{Marker, Callout, Polyline} from 'react-native-maps'
import * as Location from 'expo-location'
import firebase from '../api/firebase'
import { StatusBar } from 'expo-status-bar'

import SD from '../components/markers/SD'
import CTO from '../components/markers/CTO';

const height  = Dimensions.get('window').height
const width  = Dimensions.get('window').width
var medicaoTotal = 0

export default function MapaPrincipal({navigation}) {
    const [modo, setModo] = useState('INICIO')
    const [modalSelecionarTipoDeMarcador, setModalSelecionarTipoDeMarcador] = useState(false)
    const [showModalDePesquisa, setShowModalDePesquisa] = useState(false)
    const [pontoSelecionadoNoMapa, setPontoSelecionadoNoMapa] = useState(null);
    const [corFabMedicao, setCorFabMedicao] = useState("#fff")
    const [listaDePostesDaMedicao, setListaDePostesDaMedicao] = useState([])
    const [listaDeSDsSendoMostrados, setListaDeSDsSendoMostrados] = useState([])
    const [listaDeCTOsSendoMostradas, setListaDeCTOsSendoMostradas] = useState([])
    const [processing, setProcessing] = useState(false)
    const [userLocation, setUserLocation] = useState(null)
    const [marcadorSelecionadoDaPesquisa, setMarcadorSelecionadoDaPesquisa] = useState(null)
    const mapRef = useRef()
    const markerRef = useRef()

  
  //////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() =>{
    iniciarGPS();
  },[])
  /////////////////////////////////////////////////////////////////////////////////////////////////
    async function iniciarGPS(){
        let { status } =  await Location.requestPermissionsAsync();
        if (status !== 'granted') {
        console.warn('Permissão para acessar o GPS negada');
        return;
        }
        let location =  await Location.getCurrentPositionAsync({});
        let wid =  await Location.watchPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 2000,
            distanceInterval: 0  
        }, (loc) =>{
            setUserLocation(loc.coords)
           
        });
    }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
return deg * (Math.PI/180)
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function gravouOMarcadorDeSD(marcador){
    setListaDeSDsSendoMostrados([...listaDeSDsSendoMostrados, marcador])
    setPontoSelecionadoNoMapa(null)
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function gravouOMarcadorDeCTO(marcador){
    setListaDeCTOsSendoMostradas([...listaDeCTOsSendoMostradas, marcador])
    setPontoSelecionadoNoMapa(null)
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function getTipoDeMarcadorSelecionadoNaModal(tipo){
    if(tipo == "SD"){
        navigation.navigate("TelaAdicaoDeMarcadorSD", {pontoSelecionado : pontoSelecionadoNoMapa, onGoBack : gravouOMarcadorDeSD})
    }
    else if(tipo == "CTO"){
        navigation.navigate("TelaAdicaoDeMarcadorCTO", {pontoSelecionado : pontoSelecionadoNoMapa, onGoBack: gravouOMarcadorDeCTO})
    }
    else{
        navigation.navigate("Login")
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function clicouNoSdResultadoDaPesquisa(_marcador){
    if(_marcador.tipo == "SD"){
        firebase.firestore().collection("ctos").where("id_sd_pai", "==", _marcador.id).get()
            .then((queryCTOs) =>{
                var listaCTOs = []
                queryCTOs.forEach((doc) => {               
                    var cto = doc.data()
                    cto.id = doc.id                       
                    listaCTOs.push(cto)
                })
                setListaDeCTOsSendoMostradas(listaCTOs)
            })
            .catch((error) =>{ console.log(error)})
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function clicouNoMarcador(_marcador){
    if(modo == 'MEDICAO'){
      //  var m = _marcador 
       // if(m.jaExiste == false)  {
            setListaDePostesDaMedicao([...listaDePostesDaMedicao,_marcador])
      //  }                    
        
        return                   
    }
    if(_marcador.tipo == 'SD'){
        firebase.firestore().collection("ctos").where("id_sd_pai", "==", _marcador.id).get()
            .then((queryCTOs) =>{
                var listaCTOs = []
                queryCTOs.forEach((doc) => {               
                    var cto = doc.data()
                    cto.id = doc.id                       
                    listaCTOs.push(cto)
                })
                setListaDeCTOsSendoMostradas(listaCTOs)
            })
            .catch((error) =>{ console.log(error)})
    }
    
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function mostrarMarcadorSelecionadoDaPesquisa(marcador){
    
    //setMarcadorSelecionadoDaPesquisa(marcador)
    if(marcador.tipo == 'SD'){
        setListaDeSDsSendoMostrados([...listaDeSDsSendoMostrados, marcador])
    }
    else if(marcador.tipo == 'CTO'){
        setListaDeCTOsSendoMostradas([...listaDeCTOsSendoMostradas, marcador])
    }
    const center = {latitude:marcador.latitude, longitude: marcador.longitude}
    mapRef.current?.animateCamera({center: center,pitch: 2, heading: 20,altitude: 300, zoom: 20},2000)
  //  console.log('marcador da modal pesquisa')
 //   console.log(marcador)
}
/////////////////////////////////////////////////////////////////////////////////////////////////
async function compartilharMarcador(marcador){
    
        try {
          const result = await Share.share({
              title: marcador.nome,
            message: 'http://maps.google.com/maps?z=12&t=m&q=loc:' + marcador.latitude + '+' + marcador.longitude
          },{
            dialogTitle: marcador.nome
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      
}
/////////////////////////////////////////////////////////////////////////////////////////////////
 


useEffect(()=>{
 // carregarSDs()
},[ ])

////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={true} hidden={true}/>
            {modalSelecionarTipoDeMarcador && <ModalSelecionarTipoDeMarcador tipoSelecionado={getTipoDeMarcadorSelecionadoNaModal} esconder={setModalSelecionarTipoDeMarcador}/>}
            <ModalPesquisarMarcadores marcadorSelecionado={mostrarMarcadorSelecionadoDaPesquisa} esconder={setShowModalDePesquisa} visivel={showModalDePesquisa} share={compartilharMarcador}/>
            <View style={styles.activityIndicator}>
                <ActivityIndicator animating={processing} size='large' color="yellow"/>
            </View>
            
            <MapView 
                ref={mapRef}
                style={styles.map}
                mapType={"hybrid"}
                onPress={(e) => {
                    setPontoSelecionadoNoMapa(null)
                }}
                onUserLocationChange={(loc) =>{
                    setUserLocation(loc.nativeEvent.coordinate)
                }}
                onLongPress={(e) =>{               
                    if(modo == 'MEDICAO'){    
                        var mark = e.nativeEvent.coordinate
                      //  mark.novo = true         
                        setListaDePostesDaMedicao([...listaDePostesDaMedicao, mark])                   
                    }
                    else{
                        setPontoSelecionadoNoMapa(e.nativeEvent.coordinate)
                    }
                    Vibration.vibrate(50)
                }}           
                showsCompass={false}
                showsUserLocation={true}
                loadingEnabled   
                showsMyLocationButton={false}  
                zoomEnabled
                zoom={5}
                initialRegion={{ 
                    latitude: -22.133594, 
                    longitude: -45.060456,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121
                }}>

                {listaDeSDsSendoMostrados.length > 0 &&
                    listaDeSDsSendoMostrados.map((marcador, index) =>{
                        return <SD key={index} marcador={marcador} quantCTOs={listaDeCTOsSendoMostradas.length} clicouNoMarcador={clicouNoMarcador}/>
                    })
                }

                {listaDeCTOsSendoMostradas.length > 0 &&
                    listaDeCTOsSendoMostradas.map((marcador, index) =>{
                        return <CTO key={index} marcador={marcador} clicouNoMarcador={clicouNoMarcador}/>
                    })
                }

                {pontoSelecionadoNoMapa != null && 
                    <Marker pinColor = {"red"}  coordinate={pontoSelecionadoNoMapa}
                            title={ "ponto"}
                            description={ "" } 
                            onPress={()=>{
                        
                            }}                     
                    >
                    </Marker>
                }

                  
                { modo == "MEDICAO" &&                    
                    listaDePostesDaMedicao.map((item, i)=>{
                        var distancia = 0
                        var total = 0
                        if(i == 1){
                            const itemLista = listaDePostesDaMedicao[i -1]
                            distancia =  parseInt(1000 * getDistanceFromLatLonInKm(itemLista.latitude,itemLista.longitude, item.latitude, item.longitude))
                            total = distancia                         
                        } 
                        if(i > 1){
                            for(var c = 0; c < i ; c++){
                                const origem = listaDePostesDaMedicao[c]
                                const destino = listaDePostesDaMedicao[c + 1]
                                distancia =  parseInt(1000 * getDistanceFromLatLonInKm(origem.latitude,origem.longitude, destino.latitude, destino.longitude))                          
                                total += distancia
                            }
                        }                                 
                        return(
                            <Marker 
                                key={i} 
                                onPress={()=>{
                                    
                                }}
                                pinColor = {'red'}
                               // opacity = {item.novo == true ? 1.0 : 0.0}
                                coordinate={item}
                                title={i > 0 ?   distancia + "m" : "Início"}
                                description={ "Total: " + total + "m" }
                            >
                            </Marker>
                        )
                   })
                }
                { modo == 'MEDICAO' && <Polyline  coordinates={listaDePostesDaMedicao} lineCap={"round"} strokeColor="yellow"  strokeWidth={4}/>}
                
                                        
        </MapView>

        {pontoSelecionadoNoMapa != null  && 
            <TouchableWithoutFeedback
                onPress={()=>{  
                    setModalSelecionarTipoDeMarcador(true)
                      
            }}>
                <View style={styles.fabBotaoAdicionarMarcador}>
                    <MaterialIcons name="add" size={36} color="#fff"/>
                </View>
            </TouchableWithoutFeedback>
        }

        {listaDePostesDaMedicao.length > 0 && 
            <TouchableWithoutFeedback
                onPress={()=>{    
                    if(listaDePostesDaMedicao == []) return          
                    var listaTemp = listaDePostesDaMedicao
                    var lista = []
                    for(var i = 0; i < listaTemp.length - 1; i++){
                        lista[i] = listaTemp[i]
                    }
                    setListaDePostesDaMedicao(lista)       
            }}>
                <View style={styles.fabVoltarLanceDaMedicao}>
                    <MaterialIcons name="undo" size={36} color="#aaa"/>
                </View>
            </TouchableWithoutFeedback>
        }

        <TouchableWithoutFeedback
            onPress={()=>{
                
                if(modo != 'MEDICAO'){
                    setCorFabMedicao('#006494')
                    setModo('MEDICAO')
                }
                else{
                    setCorFabMedicao('#fff')
                    setModo('INICIO')
                    setListaDePostesDaMedicao([])
                    medicaoTotal = 0
                }
                setPontoSelecionadoNoMapa(null)
            }}>
            <View style={[styles.fabMedicao, {backgroundColor: corFabMedicao}]}>
                <MaterialIcons name="linear-scale" size={36} color="#aaa"/>
            </View>
        </TouchableWithoutFeedback>

       { modo != 'MEDICAO' && pontoSelecionadoNoMapa == null && <TouchableWithoutFeedback
            onPress={()=>{              
                    setShowModalDePesquisa(true)         
        }}>
            <View style={styles.fabPesquisa}>
                <MaterialIcons name="search" size={36} color="#aaa"/>
            </View>
        </TouchableWithoutFeedback>}

        <TouchableWithoutFeedback
            onPress={()=>{              
                if(userLocation == null) return
                const center = {latitude:userLocation.latitude, longitude: userLocation.longitude}
                mapRef.current?.animateCamera({center: center,pitch: 2, heading: 20,altitude: 300, zoom: 20},2000)                
        }}>
            <View style={styles.fabGPS}>
                <MaterialIcons name="gps-fixed" size={36} color="#aaa"/>
            </View>
        </TouchableWithoutFeedback>

        </SafeAreaView>
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
    fabBotaoAdicionarMarcador:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#006494",
        bottom: 200,
        right: 15
    },
    fabMedicao:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#254048",
        bottom: 130,
        right: 15
    },
    fabVoltarLanceDaMedicao: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#254048",
        bottom: 200,
        right: 15
    },
    fabPesquisa:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
        bottom: 200,
        right: 15
    },
    fabGPS:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        bottom: 60,
        right: 15
    },

    pickerModalAddMarcador:{
        height: 50,
        width: '90%'
      //  borderRadius: 20,
      //  textAlign: 'center'
    },
    backbonePicker:{
        position: 'absolute',
        zIndex: 5,
        paddingLeft: 15,
        backgroundColor: '#dddddd',
        top: 10,
        marginTop: 25,
        height: 50,
        width: '90%',
        borderRadius: 10,
        borderColor: '#aaa',
        borderWidth: 2,
        justifyContent: 'center',
       
    },
    picker:{
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center'
    },
    callout: {
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
        fontSize: 11,
        fontWeight: 'bold'
    },
    calloutDescricao:{
        fontSize: 9,
        color: '#444',
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
