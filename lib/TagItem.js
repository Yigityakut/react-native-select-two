import React from 'react';
import { TouchableOpacity, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const stylesResp = () => {
    switch (true) {
        case screenHeight >= 800:
            return style5xP;
        case screenHeight >= 700:
            return style4xP;
        case screenHeight >= 600:
            return style3xP;
        case screenHeight >= 555:
            return style2xP;
        default:
            return style1xP;
    }
}
const TagItem = ({ tagName, onRemoveTag }) => {
    return (
        <TouchableOpacity
            onPress={onRemoveTag}
            style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#f5f6f5', borderWidth: 1, borderColor: '#e9e9e9',
                borderRadius: 3,
                ...stylesResp().tagWrapper
            }}>
            <Icon size={stylesResp().iconSize} color='#333' name='close' />
            <Text style={{
                color: '#333', ...stylesResp().textStyle
            }}>
                {tagName}
            </Text>
        </TouchableOpacity>
    );
}

const style1xP = StyleSheet.create({
    tagWrapper: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginRight:4,
        marginBottom:4,
    },
    iconSize: 12,
    textStyle: {
        fontSize: 12,
        paddingLeft: 4
    }
});
const style2xP = StyleSheet.create({
    tagWrapper: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginRight:5,
        marginBottom:5,
    },
    iconSize: 13,
    textStyle: {
        fontSize: 12,
        paddingLeft: 5
    }
});
const style3xP = StyleSheet.create({
    tagWrapper: {
        paddingVertical: 3,
        paddingHorizontal: 5,
        marginRight:5,
        marginBottom:5,
    },
    iconSize: 14,
    textStyle: {
        fontSize: 13,
        paddingLeft: 5
    }
});
const style4xP = StyleSheet.create({
    tagWrapper: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        marginRight:6,
        marginBottom:6,
    },
    iconSize: 15,
    textStyle: {
        fontSize: 14,
        paddingLeft: 7
    }
});
const style5xP = StyleSheet.create({
    tagWrapper: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        marginRight:6,
        marginBottom:6,
    },
    iconSize: 15,
    textStyle: {
        fontSize: 14,
        paddingLeft: 7
    }
});
export default TagItem;