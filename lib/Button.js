//import liraries
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import DevicePixels from '../DevicePixel';
// create a component

const Button = ({ title, backgroundColor, textColor, style, textStyle, onPress, disabled, defaultFont }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled}
            onPress={onPress}
            style={[styles.button,  defaultFont, {
                backgroundColor: disabled ? 'gray' : backgroundColor,
                alignSelf: 'center',
            }, style]}>
            <Text style={[styles.buttonText,defaultFont, { color: textColor || '#fff' }, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    button: {
        borderRadius: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: dp(45),
        paddingHorizontal: dp(16),
        borderRadius: 55
    },
    buttonText: { fontSize: dp(15), fontWeight: 'bold' },
});



//make this component available to the app
export default Button;
