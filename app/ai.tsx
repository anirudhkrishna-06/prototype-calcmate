// File: app/ai.tsx
// Ultra-Minimalist Black & White AI Chat Engine with Simulated Response & Smooth Transitions
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

export default function AIScreen() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Reanimated shared values for sleek central wave motion
  const wave1 = useSharedValue(0.4);
  const wave2 = useSharedValue(0.2);

  useEffect(() => {
    wave1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    wave2.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const wave1Style = useAnimatedStyle(() => ({
    opacity: wave1.value,
    transform: [{ scaleX: wave1.value * 1.2 }],
  }));

  const wave2Style = useAnimatedStyle(() => ({
    opacity: wave2.value,
    transform: [{ scaleX: wave2.value * 1.4 }],
  }));

  const handleSend = () => {
    if (!draft.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: draft.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setIsTyping(true);

    // Simulated AI reply logic
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Welcome using Calcmate prototype, we are right now in development, Thank you!',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        {/* Main Content Area */}
        {messages.length === 0 ? (
          /* Initial Center Stage Display */
          <View style={styles.centerStage}>
            {/* Minimalist Liquid Wave Bars Motion */}
            <View style={styles.waveContainer}>
              <Animated.View style={[styles.waveLine, wave1Style]} />
              <Animated.View style={[styles.waveLineSecondary, wave2Style]} />
            </View>

            <Text style={styles.brandTitle}>CALCMATE</Text>
            <Text style={styles.tagline}>Intelligence Redefined for Educators</Text>
          </View>
        ) : (
          /* Smooth Chat Interface Stream */
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatStream}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Minimal Brand Header in Stream */}
            <View style={styles.streamHeader}>
              <Text style={styles.streamHeaderTitle}>CALCMATE</Text>
              <View style={styles.activePulseDot} />
            </View>

            {messages.map((msg) => (
              <Animated.View
                key={msg.id}
                entering={FadeInUp.duration(280).easing(Easing.out(Easing.quad))}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {msg.sender === 'ai' && (
                  <View style={styles.aiBadgeRow}>
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userText : styles.aiText,
                  ]}
                >
                  {msg.text}
                </Text>
              </Animated.View>
            ))}

            {/* Simulated Loader */}
            {isTyping && (
              <Animated.View
                entering={FadeInDown.duration(200)}
                style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}
              >
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </Animated.View>
            )}
          </ScrollView>
        )}

        {/* Floating Minimalist Input Composer */}
        <View style={styles.composerWrapper}>
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#555555"
              value={draft}
              onChangeText={setDraft}
              multiline
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSend}
              style={[styles.sendBtn, !draft.trim() && styles.sendBtnMuted]}
            >
              <Feather
                name="arrow-up"
                size={20}
                color={draft.trim() ? '#000000' : '#444444'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flex: {
    flex: 1,
  },
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  waveContainer: {
    width: 120,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  waveLine: {
    width: 80,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  waveLineSecondary: {
    width: 50,
    height: 2,
    backgroundColor: '#888888',
    borderRadius: 1,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 12,
    textTransform: 'uppercase',
  },
  tagline: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  chatStream: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  streamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
    marginBottom: 8,
  },
  streamHeaderTitle: {
    color: '#444444',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
  },
  activePulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
    borderBottomLeftRadius: 4,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiBadgeText: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#000000',
    fontWeight: '600',
  },
  aiText: {
    color: '#E5E5E5',
    fontWeight: '500',
  },
  loadingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666666',
  },
  composerWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 12 : 20,
    paddingTop: 10,
    backgroundColor: '#000000',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#222222',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    maxHeight: 110,
    paddingVertical: 10,
    paddingRight: 10,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnMuted: {
    backgroundColor: '#181818',
  },
});