import { Feather } from '@expo/vector-icons';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatRole = 'assistant' | 'teacher';
type QuickAction =
  | 'Generate Lesson Plan'
  | 'Create Worksheet'
  | 'Create Assessment'
  | 'Student Intervention Plan'
  | 'Classroom Activity';

type Message = {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
};

type DrawerItem = {
  title: string;
  date: string;
  icon: keyof typeof Feather.glyphMap;
};

type DrawerSection = {
  section: string;
  items: DrawerItem[];
};

const quickActions: QuickAction[] = [
  'Generate Lesson Plan',
  'Create Worksheet',
  'Create Assessment',
  'Student Intervention Plan',
  'Classroom Activity',
];

const quickPrompts: Record<QuickAction, string> = {
  'Generate Lesson Plan': 'Generate a 40-minute lesson plan with objective, activity, checks, and closure.',
  'Create Worksheet': 'Create a differentiated worksheet for Grade 3 number fluency.',
  'Create Assessment': 'Create a 20-minute assessment for Grade 4 Mathematics on fractions.',
  'Student Intervention Plan': 'Create a student intervention plan for learners struggling with reading fluency.',
  'Classroom Activity': 'Design a classroom activity that helps students practice place value in groups.',
};

const drawerSections: DrawerSection[] = [
  {
    section: 'Chat History',
    items: [
      { title: 'Geometry Revision', date: 'Today', icon: 'message-circle' },
      { title: 'Reading Fluency Checks', date: 'Sep 12', icon: 'message-circle' },
      { title: 'Intervention Planning', date: 'Sep 11', icon: 'message-circle' },
    ],
  },
  {
    section: 'Saved Lesson Plans',
    items: [
      { title: 'Fractions Lesson Plan', date: 'Sep 13', icon: 'book-open' },
      { title: 'Reading Fluency Block', date: 'Sep 12', icon: 'book-open' },
    ],
  },
  {
    section: 'Saved Worksheets',
    items: [
      { title: 'Number Fluency Worksheet', date: 'Sep 11', icon: 'file-text' },
      { title: 'Measurement Practice', date: 'Sep 10', icon: 'file-text' },
    ],
  },
  {
    section: 'Saved Assessments',
    items: [
      { title: 'Assessment Rubrics', date: 'Sep 13', icon: 'clipboard' },
      { title: 'Fractions Exit Check', date: 'Sep 10', icon: 'clipboard' },
    ],
  },
  {
    section: 'Saved Activities',
    items: [
      { title: 'Place Value Stations', date: 'Sep 10', icon: 'layers' },
      { title: 'Peer Reading Routine', date: 'Sep 9', icon: 'target' },
    ],
  },
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function buildReply(prompt: string) {
  return [
    `Here is a teacher-ready draft for: ${prompt}`,
    '',
    'I would structure it with a clear learning goal, a short diagnostic check, guided practice, and a quick exit ticket. For students who need support, I would add one scaffolded example and a paired retry activity.',
  ].join('\n');
}

const MessageBubble = memo(function MessageBubble({ message }: { message: Message }) {
  const isTeacher = message.role === 'teacher';

  return (
    <View style={[styles.messageRow, isTeacher ? styles.teacherRow : styles.assistantRow]}>
      {!isTeacher && (
        <View style={styles.bubbleAvatar}>
          <Feather name="cpu" size={15} color="#006A4E" />
        </View>
      )}
      <View style={[styles.messageBubble, isTeacher ? styles.teacherBubble : styles.assistantBubble]}>
        <Text style={[styles.messageText, isTeacher ? styles.teacherText : styles.assistantText]}>
          {message.text}
        </Text>
        <Text style={[styles.messageTime, isTeacher ? styles.teacherTime : styles.assistantTime]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
});

function DrawerTile({ item, onPress }: { item: DrawerItem; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.drawerTile} activeOpacity={0.86} onPress={onPress}>
      <View style={styles.drawerIcon}>
        <Feather name={item.icon} size={17} color="#006A4E" />
      </View>
      <View style={styles.drawerTextBlock}>
        <Text style={styles.drawerTileTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.drawerTileDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ChatDrawer({
  visible,
  onClose,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (title: string) => void;
}) {
  const slide = useRef(new Animated.Value(-340)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -340,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [slide, visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.drawerLayer}>
        <Pressable style={styles.drawerScrim} onPress={onClose} />
        <Animated.View style={[styles.drawerPanel, { transform: [{ translateX: slide }] }]}>
          <SafeAreaView style={styles.drawerSafe}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBrandIcon}>
                <Feather name="cpu" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.drawerBrandCopy}>
                <Text style={styles.drawerTitle}>AI Teacher Copilot</Text>
                <Text style={styles.drawerSubtitle}>Saved teacher work</Text>
              </View>
              <TouchableOpacity style={styles.drawerClose} onPress={onClose} activeOpacity={0.86}>
                <Feather name="x" size={20} color="#1A2B4C" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={drawerSections}
              keyExtractor={(section) => section.section}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.drawerList}
              renderItem={({ item }) => (
                <View style={styles.drawerSection}>
                  <Text style={styles.drawerSectionTitle}>{item.section}</Text>
                  {item.items.map((entry) => (
                    <DrawerTile
                      key={entry.title}
                      item={entry}
                      onPress={() => {
                        onPick(entry.title);
                        onClose();
                      }}
                    />
                  ))}
                </View>
              )}
            />
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messages]);

  const sendPrompt = () => {
    const text = prompt.trim();
    if (!text) return;

    const now = Date.now();
    const teacherMessage: Message = { id: `${now}`, role: 'teacher', text, time: getTime() };
    const assistantMessage: Message = { id: `${now + 1}`, role: 'assistant', text: buildReply(text), time: getTime() };

    setMessages((current) => [...current, teacherMessage, assistantMessage]);
    setPrompt('');
  };

  const pickQuickAction = (action: QuickAction) => {
    setPrompt(quickPrompts[action]);
  };

  const startNewChat = () => {
    setMessages([]);
    setPrompt('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.86} onPress={() => setDrawerVisible(true)}>
            <Feather name="menu" size={22} color="#1A2B4C" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.appTitle} numberOfLines={1}>AI Teacher Copilot</Text>
            <Text style={styles.appSubtitle} numberOfLines={1}>CalcMate classroom assistant</Text>
          </View>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.86} onPress={startNewChat}>
            <Feather name="edit-3" size={19} color="#1A2B4C" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={[styles.chatContent, messages.length === 0 && styles.emptyChatContent]}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListEmptyComponent={(
            <View style={styles.welcomePanel}>
              <View style={styles.welcomeIcon}>
                <Feather name="cpu" size={26} color="#006A4E" />
              </View>
              <Text style={styles.welcomeTitle}>How can I help your class today?</Text>
              <Text style={styles.welcomeText}>Ask for lessons, worksheets, assessments, interventions, or activity ideas.</Text>
              <View style={styles.emptyQuickGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity key={action} style={styles.emptyQuickChip} onPress={() => pickQuickAction(action)} activeOpacity={0.86}>
                    <Text style={styles.emptyQuickText}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />

        <View style={styles.composerDock}>
          <FlatList
            horizontal
            data={quickActions}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActions}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.quickChip} activeOpacity={0.86} onPress={() => pickQuickAction(item)}>
                <Text style={styles.quickChipText} numberOfLines={1}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.micButton} activeOpacity={0.86}>
              <Feather name="mic" size={20} color="#5C6B73" />
            </TouchableOpacity>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Message CalcMate AI"
              placeholderTextColor="#8B989F"
              style={styles.promptInput}
              multiline
              maxLength={1200}
              textAlignVertical="center"
            />
            <TouchableOpacity
              style={[styles.sendButton, !prompt.trim() && styles.sendButtonDisabled]}
              activeOpacity={0.86}
              onPress={sendPrompt}
              disabled={!prompt.trim()}>
              <Feather name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ChatDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onPick={(title) => setPrompt(`Open ${title} and continue helping me with the next step.`)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FAF9' },
  screen: { flex: 1, backgroundColor: '#F7FAF9' },
  header: {
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E3EAE8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F5F4',
  },
  headerCenter: { flex: 1, minWidth: 0, alignItems: 'center' },
  appTitle: { color: '#1A2B4C', fontSize: 17, fontWeight: '900', textAlign: 'center' },
  appSubtitle: { color: '#5C6B73', fontSize: 12, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  chatList: { flex: 1 },
  chatContent: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 14 },
  emptyChatContent: { flexGrow: 1, justifyContent: 'center' },
  messageRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end', gap: 8 },
  teacherRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  bubbleAvatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F3ED',
  },
  messageBubble: {
    maxWidth: '88%',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  teacherBubble: { backgroundColor: '#1A5C50', borderBottomRightRadius: 6 },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E9E7',
  },
  messageText: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  teacherText: { color: '#FFFFFF' },
  assistantText: { color: '#1A2B4C' },
  messageTime: { fontSize: 10, fontWeight: '700', marginTop: 7 },
  teacherTime: { color: '#CFE2DE' },
  assistantTime: { color: '#7A8A90' },
  welcomePanel: {
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  welcomeIcon: { width: 58, height: 58, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F3ED', marginBottom: 14 },
  welcomeTitle: { color: '#1A2B4C', fontSize: 24, lineHeight: 30, fontWeight: '900', textAlign: 'center' },
  welcomeText: { color: '#5C6B73', fontSize: 15, lineHeight: 21, fontWeight: '700', textAlign: 'center', marginTop: 7 },
  emptyQuickGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  emptyQuickChip: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE7E5',
  },
  emptyQuickText: { color: '#1A2B4C', fontSize: 12, lineHeight: 16, fontWeight: '800', textAlign: 'center' },
  composerDock: {
    backgroundColor: '#F7FAF9',
    borderTopWidth: 1,
    borderTopColor: '#E3EAE8',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 10 : 12,
  },
  quickActions: { paddingHorizontal: 12, paddingBottom: 8, gap: 8 },
  quickChip: {
    minHeight: 36,
    borderRadius: 8,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE7E5',
  },
  quickChipText: { color: '#1A2B4C', fontSize: 13, fontWeight: '800' },
  inputBar: {
    marginHorizontal: 10,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE7E5',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    shadowColor: '#1A2B4C',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  micButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F5F4',
  },
  promptInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 38,
    maxHeight: 118,
    paddingHorizontal: 4,
    paddingTop: Platform.OS === 'ios' ? 9 : 7,
    paddingBottom: Platform.OS === 'ios' ? 9 : 7,
    color: '#1A2B4C',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A5C50',
  },
  sendButtonDisabled: { backgroundColor: '#A9B8B4' },
  drawerLayer: { flex: 1, flexDirection: 'row' },
  drawerScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(12, 27, 31, 0.38)' },
  drawerPanel: {
    width: '86%',
    maxWidth: 340,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  drawerSafe: { flex: 1 },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3EAE8',
  },
  drawerBrandIcon: { width: 42, height: 42, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#006A4E' },
  drawerBrandCopy: { flex: 1, minWidth: 0 },
  drawerTitle: { color: '#1A2B4C', fontSize: 17, fontWeight: '900' },
  drawerSubtitle: { color: '#5C6B73', fontSize: 12, fontWeight: '700', marginTop: 2 },
  drawerClose: { width: 38, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F5F4' },
  drawerList: { padding: 16, paddingBottom: 28 },
  drawerSection: { marginBottom: 22 },
  drawerSectionTitle: { color: '#5C6B73', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 9 },
  drawerTile: {
    minHeight: 54,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7FAF9',
    borderWidth: 1,
    borderColor: '#E3EAE8',
  },
  drawerIcon: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F3ED' },
  drawerTextBlock: { flex: 1, minWidth: 0 },
  drawerTileTitle: { color: '#1A2B4C', fontSize: 14, fontWeight: '800' },
  drawerTileDate: { color: '#7A8A90', fontSize: 11, fontWeight: '700', marginTop: 2 },
});
