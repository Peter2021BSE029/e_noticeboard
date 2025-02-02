import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Notice from './Notice';
import { useNoticeBoard } from './NoticeBoardProvider';

const NoticeBoard = () => {
  const { notices } = useNoticeBoard();

  return (
    <ScrollView style={styles.boardContainer}>
      {notices.map((notice, index) => (
        <Notice key={index} notice={notice} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    padding: 10,
  },
});

export default NoticeBoard;
