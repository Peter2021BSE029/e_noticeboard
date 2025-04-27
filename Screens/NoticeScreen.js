import '../gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ref, onValue, database } from '../Firebase/firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

function NoticeScreen() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [sortOption, setSortOption] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const { theme } = useTheme();
  const styles = getStyles(colors[theme]);

  useEffect(() => {
    const noticesRef = ref(database, 'notices');
    onValue(noticesRef, (snapshot) => {
      const data = snapshot.val();
      const array = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setNotices(array);
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

  const isOlderThanDays = (expiryDate, days) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const differenceInMs = now - expiry;
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    return differenceInDays > days;
  };

  const getFilteredSortedNotices = () => {
    let filtered = notices.filter(n => {
      const expired = isExpired(n.expiryDate);
      if (activeTab === 'ongoing') {
        return !expired;
      } else {
        return expired && !isOlderThanDays(n.expiryDate, 7);
      }
    });

    if (filterBy.trim()) {
      filtered = filtered.filter(n => {
        const tags = n.tags || [];
        const search = filterBy.toLowerCase();
        return (
          n.postedBy?.toLowerCase().includes(search) ||
          tags.some(tag => tag.toLowerCase().includes(search))
        );
      });
    }

    switch (sortOption) {
      case 'titleAsc': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'titleDesc': filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'dateAsc': filtered.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted)); break;
      case 'dateDesc': filtered.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)); break;
    }

    return filtered;
  };

  const handlePressNotice = (notice) => setSelectedNotice(notice);
  const handleGoBack = () => setSelectedNotice(null);

  if (selectedNotice) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.view}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color={colors[theme].text} />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Notice Details</Text>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.noticeDetailBox}>
              <Text style={styles.title}>{selectedNotice.title}</Text>
              <Text style={styles.date}>{selectedNotice.datePosted}</Text>
              <Text style={styles.description}>{selectedNotice.description}</Text>
              <Text style={styles.description}>Date: {selectedNotice.eventDate}</Text>
              <Text style={styles.description}>Time: {selectedNotice.eventTime}</Text>
              <Text style={styles.description}>Venue: {selectedNotice.venue}</Text>
              <Text style={styles.postedBy}>Posted by: {selectedNotice.postedBy}</Text>

              {/* Show tags if they exist */}
              {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {selectedNotice.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedNotice.image && (
                <Image source={{ uri: selectedNotice.image }} style={styles.detailImage} />
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <SafeAreaView style={styles.view}>
          {/* Tab Switcher */}
          <View style={styles.tabRow}>
            {['ongoing', 'expired'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && { backgroundColor: colors[theme].selected }
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={{ color: colors[theme].text, fontWeight: 'bold' }}>
                  {tab === 'ongoing' ? '📢 Ongoing' : '🕓 Expired'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Expired Warning */}
          {activeTab === 'expired' && (
            <View style={{ marginVertical: 10, backgroundColor: colors[theme].card, padding: 10, borderRadius: 8 }}>
              <Text style={{ color: colors[theme].text, fontSize: 14 }}>
                ⚠️ Notices expire and are automatically removed 7 days after their expiry date.
              </Text>
            </View>
          )}

          {/* Icon Controls */}
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Ionicons name="filter" size={24} color={colors[theme].text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSort(!showSort)}>
              <MaterialIcons name="sort" size={24} color={colors[theme].text} />
            </TouchableOpacity>
          </View>

          {/* Filter Input */}
          {showFilters && (
            <TextInput
              placeholder="Search by poster or tag..."
              placeholderTextColor={colors[theme].placeholder}
              style={styles.searchInput}
              value={filterBy}
              onChangeText={setFilterBy}
            />
          )}

          {/* Sort Options */}
          {showSort && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {[
                { icon: 'sort-by-alpha', value: 'titleAsc' },
                { icon: 'sort', value: 'titleDesc' },
                { icon: 'schedule', value: 'dateAsc' },
                { icon: 'update', value: 'dateDesc' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSortOption(opt.value)}
                  style={[
                    styles.noticeBox,
                    {
                      backgroundColor: sortOption === opt.value
                        ? colors[theme].sortbuttonsSelected
                        : colors[theme].sortbuttons,
                      marginRight: 10,
                      padding: 8,
                    }
                  ]}
                >
                  <MaterialIcons name={opt.icon} size={20} color={colors[theme].text} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Notices List */}
          {getFilteredSortedNotices().map((notice) => (
            <TouchableOpacity
              key={notice.id}
              onPress={() => handlePressNotice(notice)}
              style={styles.noticeBox}
            >
              <Text style={styles.title}>{notice.title}</Text>
              <Text style={styles.date}>Posted: {notice.datePosted}</Text>
              <Text style={styles.description}>{notice.description?.slice(0, 100)}...</Text>
              <Text style={styles.postedBy}>Posted by: {notice.postedBy}</Text>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

export default NoticeScreen;

const getStyles = (theme) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.primary,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    topBarTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 10,
    },
    tabRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      marginHorizontal: 5,
      borderRadius: 10,
      backgroundColor: theme.secondary,
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 10,
      gap: 15,
    },
    searchInput: {
      height: 40,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 10,
      backgroundColor: theme.inputBackground || '#f9f9f9',
      color: theme.text,
      marginBottom: 10,
    },
    noticeBox: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: theme.secondary,
      borderRadius: 8,
    },
    noticeDetailBox: {
      margin: 20,
      padding: 20,
      backgroundColor: theme.secondary,
      borderRadius: 10,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    date: {
      fontSize: 14,
      color: theme.text,
    },
    description: {
      fontSize: 16,
      color: theme.text,
    },
    postedBy: {
      fontSize: 12,
      fontStyle: 'italic',
      color: theme.accent,
      marginTop: 5,
    },
    detailImage: {
      width: '100%',
      height: 200,
      borderRadius: 5,
      marginTop: 10,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      gap: 8,
    },
    tag: {
      backgroundColor: theme.accent,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 5,
    },
    tagText: {
      fontSize: 12,
      color: theme.textOnAccent || '#fff',
    },
  });
