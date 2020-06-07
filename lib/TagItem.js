import React from 'react';
import { TouchableOpacity, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DevicePixels from '../DevicePixel';

const TagItem = ({ tagName, onRemoveTag }) => {
    return (
        <TouchableOpacity
            onPress={onRemoveTag}
            style={styles.tagWrapper}>
            <Icon size={styles.iconSize} color='#333' name='close' />
            <Text style={styles.textStyle}>
                {tagName}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    tagWrapper: {
        paddingVertical: dp(4),
        paddingHorizontal: dp(6),
        marginRight: dp(6),
        marginBottom: dp(6),
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#f5f6f5',
        borderWidth: 1,
        borderColor: '#e9e9e9',
        borderRadius: dp(3),
    },
    iconSize: 15,
    textStyle: {
        fontSize: dp(14),
        paddingLeft: dp(7),
        color: '#333'
    }
});
export default TagItem;