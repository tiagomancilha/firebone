
import React,{useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';

import MapaPrincipal from   './src/pages/MapaPrincipal';
import Login from './src/pages/Login';
import  TelaAdicaoDeMarcadorSD from './src/pages/TelaAdicaoDeMarcadorSD'
import TelaAdicaoDeMarcadorCTO from './src/pages/TelaAdicaoDeMarcadorCTO'

console.disableYellowBox = true;

const Stack = createStackNavigator();


export default function App() {
  return (     
    <NavigationContainer>
      <Stack.Navigator>       
        <Stack.Screen options={{headerShown : false}} name="MapaPrincipal" component={MapaPrincipal}/>
        <Stack.Screen options={{headerShown : false}} name="TelaAdicaoDeMarcadorSD" component={TelaAdicaoDeMarcadorSD}/>
        <Stack.Screen options={{headerShown : false}} name="TelaAdicaoDeMarcadorCTO" component={TelaAdicaoDeMarcadorCTO}/>
        <Stack.Screen options={{headerShown : false}} name="Login" component={Login}/>
      </Stack.Navigator>
    </NavigationContainer>   
  );
}


