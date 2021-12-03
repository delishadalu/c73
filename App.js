import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Search from './screens/Search';
import Transaction from './screens/Transaction';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Transaction') {
              iconName = focused
                ? 'book'
                : 'book-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-circle';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          }})}
          tabBarOptions={{
        activeTintColor:'blue',
        inactiveTintColor:'gray',
        style:{backgroundColor:'beige',borderRadius:20},
        labelStyle:{fontSize:12}
      }}>
          <Tab.Screen name="Transaction" component={Transaction} />
          <Tab.Screen name="Search" component={Search} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
