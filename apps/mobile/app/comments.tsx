import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { continueAsGuest, authErrorMessage } from '@/src/lib/auth';
import {
  COMMENT_MAX,
  CommentDoc,
  NICKNAME_MAX,
  postComment,
  subscribeComments,
  validateCommentInput,
} from '@/src/lib/comments';
import { useAuth } from '@/src/providers/AuthProvider';

export default function CommentsScreen() {
  const c = Colors[useColorScheme()];
  const { user, loading: authLoading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [text, setText] = useState('');
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [listError, setListError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    const unsub = subscribeComments(
      (rows) => {
        setComments(rows);
        setLoadingList(false);
        setListError('');
      },
      (msg) => {
        setListError(msg);
        setLoadingList(false);
      },
    );
    return unsub;
  }, []);

  useEffect(() => {
    if (user?.displayName && !nickname) {
      setNickname(user.displayName.slice(0, NICKNAME_MAX));
    }
  }, [user, nickname]);

  async function ensureAuth() {
    if (!user) {
      await continueAsGuest();
    }
  }

  async function onPost() {
    const validation = validateCommentInput(nickname, text);
    if (validation) {
      setStatus(validation);
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      await ensureAuth();
      await postComment(nickname, text);
      setText('');
      setStatus('Posted — your comment is live with your account uid.');
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.text }]}>Live feedback</Text>
      <Text style={[styles.sub, { color: c.textMuted }]}>
        Critique, advice, or ideas. Posts require auth (guest or email) and store
        your uid for ownership.
      </Text>

      {!authLoading && !user ? (
        <Text style={{ color: c.textMuted, marginBottom: 8 }}>
          Not signed in — posting will start a guest session.{' '}
          <Link href="/(auth)/welcome" style={{ color: c.accent, fontWeight: '700' }}>
            Or open auth
          </Link>
        </Text>
      ) : null}

      {user?.isAnonymous ? (
        <Link href="/(auth)/upgrade" style={{ marginBottom: 8 }}>
          <Text style={{ color: c.accent, fontWeight: '600' }}>
            Guest session — upgrade to email
          </Text>
        </Link>
      ) : null}

      <Text style={[styles.label, { color: c.textMuted }]}>Nickname</Text>
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        maxLength={NICKNAME_MAX}
        placeholder="1–30 characters"
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: c.line },
        ]}
      />
      <Text style={[styles.count, { color: c.textMuted }]}>
        {nickname.trim().length} / {NICKNAME_MAX}
      </Text>

      <Text style={[styles.label, { color: c.textMuted }]}>Comment</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        maxLength={COMMENT_MAX}
        multiline
        placeholder="What works? What would you change?"
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          styles.area,
          { color: c.text, backgroundColor: c.surface, borderColor: c.line },
        ]}
      />
      <Text style={[styles.count, { color: c.textMuted }]}>
        {text.trim().length} / {COMMENT_MAX}
      </Text>

      <Pressable
        style={[styles.primary, { backgroundColor: c.accent, opacity: busy ? 0.7 : 1 }]}
        onPress={onPost}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryLabel}>Post comment</Text>
        )}
      </Pressable>
      {status ? (
        <Text style={[styles.status, { color: c.textMuted }]}>{status}</Text>
      ) : null}

      <Text style={[styles.feedTitle, { color: c.text }]}>
        What visitors are saying
      </Text>
      {loadingList ? <ActivityIndicator color={c.accent} /> : null}
      {listError ? (
        <Text style={{ color: c.accentDeep }}>{listError}</Text>
      ) : null}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, marginTop: 8 }}
        ListEmptyComponent={
          loadingList ? undefined : (
            <Text style={{ color: c.textMuted }}>
              No comments yet. Be the first.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: c.surface, borderColor: c.line },
            ]}
          >
            <Text style={[styles.nick, { color: c.text }]}>
              {item.nickname}
              {user && item.uid === user.uid ? ' · You' : ''}
            </Text>
            <Text style={{ color: c.text, lineHeight: 20 }}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: '800' },
  sub: { fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 4,
  },
  area: { minHeight: 88, textAlignVertical: 'top' },
  count: { fontSize: 12, alignSelf: 'flex-end', marginTop: 4 },
  primary: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryLabel: { color: '#fff', fontWeight: '700', fontSize: 16 },
  status: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  feedTitle: { fontSize: 17, fontWeight: '700', marginTop: 20 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 4,
  },
  nick: { fontWeight: '700', fontSize: 13 },
});
