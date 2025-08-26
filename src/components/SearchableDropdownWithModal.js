import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchableDropdownWithModal = ({
  label,
  placeholder,
  value,
  error,
  loading,
  modalVisible,
  modalTitle,
  modalFields,
  onInputChange,
  onSelectItem,
  onPlusPress,
  onModalInputChange,
  onModalSubmit,
  filteredData,
  showDropdown,
}) => {
  console.log('filteredData', filteredData);
  return (
    <View style={styles.searchContainer}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.label}>{label}</Text>
        {loading && (
          <ActivityIndicator
            color="#000"
            size={15}
            style={{marginLeft: '2%'}}
          />
        )}
      </View>

      <View style={styles.inputDropDownContainer}>
        <TextInput
          style={styles.dropDowninput}
          value={value}
          onChangeText={value => onInputChange('dropdownInput', value)}
          placeholder={placeholder}
          placeholderTextColor={'#d3d3d3'}
        />
        <TouchableOpacity
          onPress={onPlusPress}
          style={styles.plusIconContainer}>
          <View style={{width: 50}}>
            <AntDesign name={'pluscircleo'} size={20} color={'#000'} />
          </View>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {showDropdown &&
        (filteredData.length === 0 ? (
          <Text style={styles.noDataText}>No Data Found</Text>
        ) : (
          <ScrollView
            style={styles.dropdownContainer}
            nestedScrollEnabled={true}>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => `${item.ID}-${index}`}
              style={styles.dropdownList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() =>
                    onSelectItem({
                      name: item.name,
                      id: item.id,
                      //   profit: item.Profit,
                    })
                  }>
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        ))}

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            {modalFields.map(field => (
              <TextInput
                key={field.key}
                placeholder={field.placeholder}
                style={styles.modalInput}
                value={field.value}
                onChangeText={text => onModalInputChange(field.key, text)}
                secureTextEntry={field.secureTextEntry || false}
              />
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => onPlusPress(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={onModalSubmit}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchableDropdownWithModal;

const styles = StyleSheet.create({
  inputDropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#fff',
  },

  plusIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: Color.lightPurple,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: Color.grey,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  dropDowninput: {
    flex: 1,
    color: '#000',
    padding: 12,
  },
  searchContainer: {
    marginBottom: '4%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
  },
  dropdownContainer: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    elevation: 3,
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    color: 'red',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#555',
  },
});
