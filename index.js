//import liraries
import React, { Component } from 'react';
import { Text, StyleSheet, PixelRatio, TouchableOpacity, View, FlatList, TextInput, Dimensions, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Button from './lib/Button';
import TagItem from './lib/TagItem';
import utilities from './lib/utilities';
import PropTypes from 'prop-types';

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
const getMultiplier = () => {
    var pr = PixelRatio.get();
    switch (true) {
        case pr * screenHeight >= 2100:
            return 0.45;
        case pr * screenHeight >= 1900:
            return 0.5;
        case pr * screenHeight >= 1400:
            return 0.55;
        case pr * screenHeight >= 1000:
            return 0.6;
        default:
            return 0.65;
    }
}

const { height } = Dimensions.get('window');
const INIT_HEIGHT = height * getMultiplier();
// create a component
class Select2 extends Component {
    static defaultProps = {
        cancelButtonText: 'Cancel',
        selectButtonText: 'Select',
        searchPlaceHolderText: "Search",
        listEmptyTitle: 'No item was found.',
        colorTheme: '#16a45f',
        buttonTextStyle: {},
        buttonStyle: {},
        showSearchBox: true
    }
    state = {
        show: false,
        preSelectedItem: [],
        selectedItem: [],
        data: [],
        keyword: ''
    }
    animatedHeight = new Animated.Value(INIT_HEIGHT);

    componentDidMount() {
        this.init();
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        this.init(newProps);
    }

    init(newProps) {
        let preSelectedItem = [];
        let { data } = newProps || this.props;
        data.map(item => {
            if (item.checked) {
                preSelectedItem.push(item);
            }
        })
        this.setState({ data, preSelectedItem });
    }

    get dataRender() {
        let { data, keyword } = this.state;
        let listMappingKeyword = [];
        data.map(item => {
            if (utilities.changeAlias(item.name).includes(utilities.changeAlias(keyword))) {
                listMappingKeyword.push(item);
            }
        });
        return listMappingKeyword;
    }

    get defaultFont() {
        let { defaultFontName } = this.props;
        return defaultFontName ? { fontFamily: defaultFontName } : {};
    }

    cancelSelection() {
        let { data, preSelectedItem } = this.state;
        data.map(item => {
            item.checked = false;
            for (let _selectedItem of preSelectedItem) {
                if (item.id === _selectedItem.id) {
                    item.checked = true;
                    break;
                }
            }
        });
        this.setState({ data, show: false, keyword: '', selectedItem: preSelectedItem });
    }

    onItemSelected = (item, isSelectSingle) => {
        let selectedItem = [];
        let { data } = this.state;
        item.checked = !item.checked;
        for (let index in data) {
            if (data[index].id === item.id) {
                data[index] = item;
            } else if (isSelectSingle) {
                data[index].checked = false;
            }
        }
        data.map(item => {
            if (item.checked) selectedItem.push(item);
        })
        this.setState({ data, selectedItem });
    }
    keyExtractor = (item, idx) => idx.toString();
    renderItem = ({ item, idx }) => {
        let { colorTheme, isSelectSingle } = this.props;
        return (
            <TouchableOpacity
                key={idx}
                onPress={() => this.onItemSelected(item, isSelectSingle)}
                activeOpacity={0.7}
                style={[styles.itemWrapper, stylesResp().itemWrapper]}>
                <Text style={[styles.itemText, stylesResp().itemText, this.defaultFont]}>
                    {item.name}
                </Text>
                <Icon style={[styles.itemIcon, stylesResp().itemIcon]}
                    name={item.checked ? 'check-circle-outline' : 'radiobox-blank'}
                    color={item.checked ? colorTheme : '#777777'} size={20} />
            </TouchableOpacity>
        );
    }
    renderEmpty = () => {
        let { listEmptyTitle } = this.props;
        return (
            <Text style={[styles.empty, stylesResp().empty, this.defaultFont]}>
                {listEmptyTitle}
            </Text>
        );
    }
    closeModal = () => this.setState({ show: false });
    showModal = () => this.setState({ show: true });

    render() {
        let {
            style, modalStyle, title, onSelect, onRemoveItem, popupTitle, colorTheme,
            isSelectSingle, cancelButtonText, selectButtonText, searchPlaceHolderText,
            selectedTitleStyle, buttonTextStyle, buttonStyle, showSearchBox
        } = this.props;
        let { show, selectedItem, preSelectedItem } = this.state;
        return (
            <TouchableOpacity
                onPress={this.showModal}
                activeOpacity={0.7}
                style={[styles.container, stylesResp().container, style]}>
                <Modal
                    onBackdropPress={this.closeModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0
                    }}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={show}>
                    <Animated.View style={[styles.modalContainer, stylesResp().modalContainer, modalStyle, { height: this.animatedHeight }]}>
                        <View>
                            <Text style={[styles.title, stylesResp().title, this.defaultFont, { color: colorTheme }]}>
                                {popupTitle || title}
                            </Text>
                        </View>
                        <View style={styles.line} />
                        {
                            showSearchBox
                                ? <TextInput
                                    underlineColorAndroid='transparent'
                                    returnKeyType='done'
                                    style={[styles.inputKeyword, stylesResp().inputKeyword, this.defaultFont]}
                                    placeholder={searchPlaceHolderText}
                                    selectionColor={colorTheme}
                                    onChangeText={keyword => this.setState({ keyword })}
                                    onFocus={() => {
                                        Animated.spring(this.animatedHeight, {
                                            toValue: INIT_HEIGHT + (Platform.OS === 'ios' ? height * 0.2 : 0),
                                            friction: 7
                                        }).start();
                                    }}
                                    onBlur={() => {
                                        Animated.spring(this.animatedHeight, {
                                            toValue: INIT_HEIGHT,
                                            friction: 7
                                        }).start();
                                    }}
                                />
                                : null
                        }
                        <FlatList
                            style={stylesResp().listOption}
                            data={this.dataRender || []}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                            ListEmptyComponent={this.renderEmpty}
                        />

                        <View style={styles.buttonWrapper}>
                            <Button
                                defaultFont={this.defaultFont}
                                onPress={() => {
                                    this.cancelSelection();
                                }}
                                title={cancelButtonText}
                                textColor={colorTheme}
                                backgroundColor='#fff'
                                textStyle={buttonTextStyle}
                                style={[styles.button, stylesResp().button, buttonStyle, { marginRight: 5, marginLeft: 10, borderWidth: 1, borderColor: colorTheme }]} />
                            <Button
                                defaultFont={this.defaultFont}
                                onPress={() => {
                                    let selectedIds = [], selectedObjectItems = [];
                                    selectedItem.map(item => {
                                        selectedIds.push(item.id);
                                        selectedObjectItems.push(item);
                                    })
                                    onSelect && onSelect(selectedIds, selectedObjectItems);
                                    this.setState({ show: false, keyword: '', preSelectedItem: selectedItem });
                                }}
                                title={selectButtonText}
                                backgroundColor={colorTheme}
                                textStyle={buttonTextStyle}
                                style={[styles.button, stylesResp().button, buttonStyle, { marginLeft: 5, marginRight: 10 }]} />
                        </View>
                    </Animated.View>
                </Modal>
                {
                    preSelectedItem.length > 0
                        ? (
                            isSelectSingle
                                ? <Text style={[styles.selectedTitle, stylesResp().selectedTitle, this.defaultFont, selectedTitleStyle, { color: '#333' }]}>{preSelectedItem[0].name}</Text>
                                : <View style={[styles.tagWrapper, stylesResp().tagWrapper]}>
                                    {
                                        preSelectedItem.map((tag, index) => {
                                            return (
                                                <TagItem
                                                    key={index}
                                                    onRemoveTag={() => {
                                                        let preSelectedItem = [];
                                                        let selectedIds = [], selectedObjectItems = [];
                                                        let { data } = this.state;
                                                        data.map(item => {
                                                            if (item.id === tag.id) {
                                                                item.checked = false;
                                                            }
                                                            if (item.checked) {
                                                                preSelectedItem.push(item);
                                                                selectedIds.push(item.id);
                                                                selectedObjectItems.push(item);
                                                            };
                                                        })
                                                        this.setState({ data, preSelectedItem });
                                                        onRemoveItem && onRemoveItem(selectedIds, selectedObjectItems);
                                                    }}
                                                    tagName={tag.name} />
                                            );
                                        })
                                    }
                                </View>
                        )
                        : <Text style={[styles.selectedTitle,stylesResp().selectedTitle, this.defaultFont, selectedTitleStyle]}>{title}</Text>
                }
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row', alignItems: 'center',
        borderColor: '#cacaca',
    },
    modalContainer: {
        backgroundColor: '#fff',
    },
    title: {
        width: '100%', textAlign: 'center'
    },
    line: {
        height: 1, width: '100%', backgroundColor: '#cacaca'
    },
    inputKeyword: {
        borderRadius: 5, borderWidth: 1, borderColor: '#cacaca',
    },
    buttonWrapper: {
        marginVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    button: {
        flex: 1
    },
    selectedTitle: {
        color: 'gray', flex: 1
    },
    tagWrapper: {
        flexDirection: 'row', flexWrap: 'wrap'
    },

    itemWrapper: {
        borderBottomWidth: 1, borderBottomColor: '#eaeaea',
        flexDirection: 'row', alignItems: 'center'
    },
    itemText: {
        color: '#333', flex: 1
    },
    itemIcon: {
        textAlign: 'right'
    },
    empty: {
         color: 'gray', alignSelf: 'center', textAlign: 'center', 
    }
});

Select2.propTypes = {
    data: PropTypes.array.isRequired,
    style: PropTypes.object,
    defaultFontName: PropTypes.string,
    selectedTitleStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    title: PropTypes.string,
    onSelect: PropTypes.func,
    onRemoveItem: PropTypes.func,
    popupTitle: PropTypes.string,
    colorTheme: PropTypes.string,
    isSelectSingle: PropTypes.bool,
    showSearchBox: PropTypes.bool,
    cancelButtonText: PropTypes.string,
    selectButtonText: PropTypes.string
}


const style1xP = StyleSheet.create({
    container: {
        minHeight: 30,
        paddingHorizontal: 16,
        borderWidth: 1,
        paddingVertical: 4
    },
    modalContainer: {
        paddingTop: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    title: {
        fontSize: 13,
        marginBottom: 16,
    },
    inputKeyword: {
        height: 30,
        paddingLeft: 10,
        marginHorizontal: 16,
        marginTop: 16,
        fontSize: 11,
        paddingVertical: 0
    },
    button: {
        height: 30,
    },
    selectedTitle: {
        fontSize: 11,
    },
    listOption: {
        paddingHorizontal: 24,
        paddingTop: 1,
    },
    itemWrapper: {
        paddingVertical: 8,
    },
    itemText: {
        fontSize: 12
    },
    itemIcon: {
        width: 20,
    },
    empty:{
        fontSize: 11,paddingTop: 16
    }
});
const style2xP = StyleSheet.create({
    container: {
        minHeight: 35,
        paddingHorizontal: 16,
        borderWidth: 1,
        paddingVertical: 4
    },
    modalContainer: {
        paddingTop: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    title: {
        fontSize: 14,
        marginBottom: 16,
    },
    inputKeyword: {
        height: 35,
        paddingLeft: 10,
        marginHorizontal: 16,
        marginTop: 16,
        fontSize: 12,
        paddingVertical: 0
    },
    button: {
        height: 35,
    },
    selectedTitle: {
        fontSize: 12,
    },
    listOption: {
        paddingHorizontal: 24,
        paddingTop: 1,
    },
    itemWrapper: {
        paddingVertical: 8,
    },
    itemText: {
        fontSize: 13
    },
    itemIcon: {
        width: 22,
    },
    empty:{
        fontSize: 12,paddingTop: 16
    }
});
const style3xP = StyleSheet.create({
    container: {
        minHeight: 40,
        paddingHorizontal: 16,
        borderWidth: 1,
        paddingVertical: 4
    },
    modalContainer: {
        paddingTop: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    title: {
        fontSize: 15,
        marginBottom: 16,
    },
    inputKeyword: {
        height: 40,
        paddingLeft: 10,
        marginHorizontal: 16,
        marginTop: 16,
        fontSize: 13,
        paddingVertical: 0
    },
    button: {
        height: 40,
    },
    selectedTitle: {
        fontSize: 13,
    },
    listOption: {
        paddingHorizontal: 24,
        paddingTop: 1,
    },
    itemWrapper: {
        paddingVertical: 8,
    },
    itemText: {
        fontSize: 13
    },
    itemIcon: {
        width: 24,
    },
    empty:{
        fontSize: 13,paddingTop: 16
    }
});
const style4xP = StyleSheet.create({
    container: {
        minHeight: 45,
        paddingHorizontal: 16,
        borderWidth: 1,
        paddingVertical: 4
    },
    modalContainer: {
        paddingTop: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    title: {
        fontSize: 16,
        marginBottom: 16,
    },
    inputKeyword: {
        height: 45,
        paddingLeft: 10,
        marginHorizontal: 16,
        marginTop: 16,
        fontSize: 14,
        paddingVertical: 0
    },
    button: {
        height: 45,
    },
    selectedTitle: {
        fontSize: 14,
    },
    listOption: {
        paddingHorizontal: 24,
        paddingTop: 1,
    },
    itemWrapper: {
        paddingVertical: 8,
    },
    itemText: {
        fontSize: 14
    },
    itemIcon: {
        width: 26,
    },
    empty:{
        fontSize: 14,paddingTop: 16
    }
});
const style5xP = StyleSheet.create({
    container: {
        minHeight: 45,
        paddingHorizontal: 16,
        borderWidth: 1,
        paddingVertical: 4
    },
    modalContainer: {
        paddingTop: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    title: {
        fontSize: 17,
        marginBottom: 16,
    },
    inputKeyword: {
        height: 45,
        paddingLeft: 10,
        marginHorizontal: 16,
        marginTop: 16,
        fontSize: 15,
        paddingVertical: 0
    },
    button: {
        height: 45,
    },
    selectedTitle: {
        fontSize: 15,
    },
    listOption: {
        paddingHorizontal: 24,
        paddingTop: 1,
    },
    itemWrapper: {
        paddingVertical: 8,
    },
    itemText: {
        fontSize: 15
    },
    itemIcon: {
        width: 28,
    },
    empty:{
        fontSize: 15,paddingTop: 16
    }
});
//make this component available to the app
export default Select2;
