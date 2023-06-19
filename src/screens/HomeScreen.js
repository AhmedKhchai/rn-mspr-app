import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useProduct } from '../useProduct';
import { Card, Modal, Portal, Button, Provider } from 'react-native-paper';

const HomeScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products, isSuccess, isError, error, isLoading } = useProduct();

  const showModal = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const renderItem = ({ item }) => (
    <Card style={styles.item} onPress={() => showModal(item)}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Text style={styles.title}>Price: {item.product_detail.price}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Provider>
      <View style={styles.container}>
        {isSuccess && (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal}>
            {selectedProduct && (
              <Card style={styles.modal_container}>
                <Card.Title title={selectedProduct.name} />
                <Card.Content>
                  <Text>Price: {selectedProduct.product_detail.price}</Text>
                  <Text>Stock: {selectedProduct.stock}</Text>
                  <Text>
                    Description: {selectedProduct.product_detail.description}
                  </Text>
                  <Text>Color: {selectedProduct.product_detail.color}</Text>
                </Card.Content>
              </Card>
            )}
            <Button onPress={hideModal}>Close</Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  modal_container: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default HomeScreen;
