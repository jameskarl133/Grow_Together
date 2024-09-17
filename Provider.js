//import liraries
import React, { Component, createContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ApiContext = createContext();

// create a component
class MyComponent extends Component {
    constructor(props){
        super(props);
        this.state = { firstName : ''}
        
    }
    componentDidMount(){
        this.setState({ firstName : 'Christian'})
    }
    render(){
        console.log(this.state.firstName)
        return(
            <ApiContext.Provider value={this.state}>
                {this.props.children}
            </ApiContext.Provider>
    );
    }
};



// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default MyComponent;
