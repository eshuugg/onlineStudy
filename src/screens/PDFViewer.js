// PdfViewer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PdfViewer({ route }) {
  const { pdfUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: `https://docs.google.com/gview?embedded=true&url=${pdfUrl}` }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
