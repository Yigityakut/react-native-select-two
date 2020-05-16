//import liraries
import React from 'react';
import { TouchableOpacity, Text, StyleSheet,Dimensions,PixelRatio } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const stylesResp = () => {
    var pr = PixelRatio.get();
    switch (true) {
        case pr * screenHeight >= 2100:
            return style5xP;
        case pr * screenHeight >= 1900:
            return style4xP;
        case pr * screenHeight >= 1400:
            return style3xP;
        case pr * screenHeight >= 1000:
            return style2xP;
        default:
            return style1xP;
    }
}
// create a component

const Button = ({ title, backgroundColor, textColor, style, textStyle, onPress, disabled, defaultFont }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled}
            onPress={onPress}
            style={[styles.button,stylesResp().button, defaultFont, {
                backgroundColor: disabled ? 'gray' : backgroundColor,
                alignSelf: 'center', 
            }, style]}>
            <Text style={[styles.buttonText,stylesResp().buttonText, defaultFont, { color: textColor || '#fff' }, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    button: {
        borderRadius: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    },
    buttonText: { fontWeight: 'bold' },
});


const style1xP = StyleSheet.create({
    button: {
        height: 30, 
        paddingHorizontal: 16,
        borderRadius: 25
    },
    buttonText: { fontSize: 12,},
});
const style2xP = StyleSheet.create({
    button: {
        height: 35, 
        paddingHorizontal: 16,
        borderRadius: 25
    },
    buttonText: { fontSize: 13,},
});
const style3xP = StyleSheet.create({
    button: {
        height: 40, 
        paddingHorizontal: 16,
        borderRadius: 25
    },
    buttonText: { fontSize: 14,},
});
const style4xP = StyleSheet.create({
    button: {
        height: 45, 
        paddingHorizontal: 16,
        borderRadius: 25
    },
    buttonText: { fontSize: 15,},
});
const style5xP = StyleSheet.create({
    button: {
        height: 45, 
        paddingHorizontal: 16,
        borderRadius: 25
    },
    buttonText: { fontSize: 15,},
});

//make this component available to the app
export default Button;
