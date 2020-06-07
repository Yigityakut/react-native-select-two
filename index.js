//import liraries
import React, { Component } from 'react';
import { Text, StyleSheet, PixelRatio, TouchableOpacity, View, FlatList, TextInput, Dimensions, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Button from './lib/Button';
import TagItem from './lib/TagItem';
import utilities from './lib/utilities';
import PropTypes from 'prop-types';
import {dp} from '../lib/DevicePixel';

const { height } = Dimensions.get('window');
const INIT_HEIGHT = height * 0.5;
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
                style={[styles.itemWrapper]}>
                <Text style={[styles.itemText, this.defaultFont]}>
                    {item.name}
                </Text>
                <Icon style={[styles.itemIcon, ]}
                    name={item.checked ? 'check-circle-outline' : 'radiobox-blank'}
                    color={item.checked ? colorTheme : '#777777'} size={20} />
            </TouchableOpacity>
        );
    }
    renderEmpty = () => {
        let { listEmptyTitle } = this.props;
        return (
            <Text style={[styles.empty, this.defaultFont]}>
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
                style={[styles.container, style]}>
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
                    <Animated.View style={[styles.modalContainer,  modalStyle, { height: this.animatedHeight }]}>
                        <View>
                            <Text style={[styles.title, this.defaultFont, { color: colorTheme }]}>
                                {popupTitle || title}
                            </Text>
                        </View>
                        <View style={styles.line} />
                        {
                            showSearchBox
                                ? <TextInput
                                    underlineColorAndroid='transparent'
                                    returnKeyType='done'
                                    style={[styles.inputKeyword,  this.defaultFont]}
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
                            style={styles.listOption}
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
                                style={[styles.button, buttonStyle, { marginRight:  dp(5), marginLeft: dp(10), borderWidth: 1, borderColor: colorTheme }]} />
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
                                style={[styles.button,  buttonStyle, { marginLeft: 5, marginRight: 10 }]} />
                        </View>
                    </Animated.View>
                </Modal>
                {
                    preSelectedItem.length > 0
                        ? (
                            isSelectSingle
                                ? <Text style={[styles.selectedTitle,  this.defaultFont, selectedTitleStyle, { color: '#333' }]}>{preSelectedItem[0].name}</Text>
                                : <View style={[styles.tagWrapper,]}>
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
                        : <Text style={[styles.selectedTitle,this.defaultFont, selectedTitleStyle]}>{title}</Text>
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
        minHeight: dp(45),
        paddingHorizontal:  dp(16),
        borderWidth: 1,
        paddingVertical:  dp(4)
    },
    modalContainer: {
        backgroundColor: '#fff',
        paddingTop:  dp(16),
        borderTopLeftRadius:  dp(8),
        borderTopRightRadius:  dp(8)
    },
    title: {
        width: '100%',
        textAlign: 'center',
        fontSize:  dp(15),
        marginBottom:  dp(16),
    },
    line: {
        height: 1, width: '100%', backgroundColor: '#cacaca'
    },
    inputKeyword: {
        borderRadius:  dp(5), borderWidth: 1, borderColor: '#cacaca',
        height:  dp(45),
        paddingLeft:  dp(10),
        marginHorizontal:  dp(16),
        marginTop:  dp(16),
        fontSize:  dp(14),
        paddingVertical: 0
    },
    buttonWrapper: {
        marginVertical:  dp(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    button: {
        flex: 1,
        height:  dp(45),

    },
    selectedTitle: {
        color: 'gray', flex: 1,
        fontSize:  dp(14),

    },
    tagWrapper: {
        flexDirection: 'row', flexWrap: 'wrap'
    },

    itemWrapper: {
        borderBottomWidth: 1, borderBottomColor: '#eaeaea',
        flexDirection: 'row', alignItems: 'center',
        paddingVertical:  dp(8),

    },
    itemText: {
        color: '#333',
        flex: 1,
        fontSize:  dp(14),

    },
    itemIcon: {
        textAlign: 'right',
        width:  dp(26),

    },
    empty: {
        color: 'gray',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize:  dp(14),
        paddingTop:  dp(16)

    },
    listOption: {
        paddingHorizontal:  dp(24),
        paddingTop:  dp(1),
    },
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

//make this component available to the app
export default Select2;
