import React from 'react';
import { SafeAreaView, Button } from 'react-native';
import { useNoticeBoard } from '../E-NoticeBoard';
import NoticeBoard from '../E-NoticeBoard/NoticeBoard';

const AdminNoticeScreen = () => {
  const { addNotice, editNotice } = useNoticeBoard();

  const createNotice = () => {
    addNotice({ id: Date.now(), title: 'New Event', date: '2024-10-22', summary: 'Event details here' });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="Add Notice" onPress={createNotice} />
      <NoticeBoard />
    </SafeAreaView>
  );
};

export default AdminNoticeScreen;
