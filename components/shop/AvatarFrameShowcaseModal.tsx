import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { XIcon, SparklesIcon, CheckIcon, LayersIcon, EyeIcon } from 'lucide-react-native';
import { AvatarFrame, AVATAR_FRAME_LIST, AvatarFrameDefinition } from '@/components/snapvocab';
import { cn } from '@/lib/utils';

interface AvatarFrameShowcaseModalProps {
  visible: boolean;
  onClose: () => void;
  onEquip?: (frameId: string) => void;
  equippedFrameId?: string | null;
}

const AVATAR_OPTIONS = [
  { id: 'snapy_happy', label: 'Snapy Vui Vẻ', source: require('../../assets/images/snapy-happy.png') },
  { id: 'snapy_curious', label: 'Snapy Tò Mò', source: require('../../assets/images/snapy-curious.png') },
  { id: 'snapy_snap', label: 'Snapy Chụp Ảnh', source: require('../../assets/images/snapy-snap.png') },
  { id: 'initials', label: 'Ký tự (SV)', initials: 'SV' },
  { id: 'photo', label: 'Ảnh đại diện', uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
];

const PREVIEW_SIZES = [
  { id: 'sm', label: 'Nhỏ (48px)', size: 'sm' as const },
  { id: 'md', label: 'Vừa (72px)', size: 'md' as const },
  { id: 'lg', label: 'Lớn (96px)', size: 'lg' as const },
  { id: 'hero', label: 'Tiêu biểu (160px)', size: 'hero' as const },
];

export function AvatarFrameShowcaseModal({
  visible,
  onClose,
  onEquip,
  equippedFrameId,
}: AvatarFrameShowcaseModalProps) {
  const [selectedFrameId, setSelectedFrameId] = useState<string>(
    equippedFrameId || AVATAR_FRAME_LIST[0].id
  );
  const [isAnimated, setIsAnimated] = useState<boolean>(true);
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const [sizeIndex, setSizeIndex] = useState<number>(3); // Default hero

  const selectedFrame = AVATAR_FRAME_LIST.find((f) => f.id === selectedFrameId) || AVATAR_FRAME_LIST[0];
  const activeAvatar = AVATAR_OPTIONS[avatarIndex];
  const activeSize = PREVIEW_SIZES[sizeIndex];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.badgeIcon, { backgroundColor: selectedFrame.accentColor + '20' }]}>
                <SparklesIcon size={18} color={selectedFrame.accentColor} />
              </View>
              <View>
                <Text style={styles.title}>Phòng Thử Khung Avatar</Text>
                <Text style={styles.subtitle}>Bộ sưu tập 10 Khung Hoạt Ảnh Chính Thức</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <XIcon size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* HERO STAGE */}
            <View style={styles.heroStage}>
              {/* Radial ambient background */}
              <View style={[styles.ambientBackdrop, { backgroundColor: selectedFrame.accentColor + '15' }]} />

              <AvatarFrame
                frameId={selectedFrame.id}
                size={activeSize.size}
                animated={isAnimated}
                showGlow={true}
                avatarSource={activeAvatar.source}
                avatarUri={activeAvatar.uri}
                initials={activeAvatar.initials}
              />

              {/* Frame Info Meta */}
              <View style={styles.frameMetaCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={[styles.frameName, { color: '#0F172A' }]}>{selectedFrame.name}</Text>
                  <View style={[styles.rarityPill, { backgroundColor: selectedFrame.accentColor + '20' }]}>
                    <Text style={[styles.rarityText, { color: selectedFrame.accentColor }]}>
                      {selectedFrame.rarityLabel}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sloganText}>“{selectedFrame.slogan}”</Text>
                <Text style={styles.descText}>{selectedFrame.description}</Text>
              </View>
            </View>

            {/* CONTROLS BAR: Animation & Avatar Switch */}
            <View style={styles.controlsBar}>
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Hoạt ảnh (Animation):</Text>
                <View style={styles.toggleGroup}>
                  <Pressable
                    onPress={() => setIsAnimated(true)}
                    style={[styles.toggleBtn, isAnimated && styles.toggleBtnActive]}
                  >
                    <SparklesIcon size={14} color={isAnimated ? '#FFFFFF' : '#64748B'} />
                    <Text style={[styles.toggleBtnText, isAnimated && styles.toggleBtnTextActive]}>
                      Động (WebP)
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setIsAnimated(false)}
                    style={[styles.toggleBtn, !isAnimated && styles.toggleBtnActive]}
                  >
                    <LayersIcon size={14} color={!isAnimated ? '#FFFFFF' : '#64748B'} />
                    <Text style={[styles.toggleBtnText, !isAnimated && styles.toggleBtnTextActive]}>
                      Tĩnh (PNG)
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Avatar Selector */}
              <View style={{ marginTop: 12 }}>
                <Text style={styles.controlLabel}>Mẫu Avatar thử nghiệm:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {AVATAR_OPTIONS.map((opt, idx) => (
                      <Pressable
                        key={opt.id}
                        onPress={() => setAvatarIndex(idx)}
                        style={[
                          styles.chip,
                          avatarIndex === idx && styles.chipActive,
                        ]}
                      >
                        <Text style={[styles.chipText, avatarIndex === idx && styles.chipTextActive]}>
                          {opt.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Size Selector */}
              <View style={{ marginTop: 12 }}>
                <Text style={styles.controlLabel}>Kích thước hiển thị:</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  {PREVIEW_SIZES.map((s, idx) => (
                    <Pressable
                      key={s.id}
                      onPress={() => setSizeIndex(idx)}
                      style={[
                        styles.sizeChip,
                        sizeIndex === idx && styles.chipActive,
                      ]}
                    >
                      <Text style={[styles.chipText, sizeIndex === idx && styles.chipTextActive]}>
                        {s.id.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* 10 FRAMES GALLERY */}
            <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
              <Text style={styles.sectionHeader}>Danh sách 10 Khung Thiết Kế ({AVATAR_FRAME_LIST.length})</Text>
              <View style={styles.framesGrid}>
                {AVATAR_FRAME_LIST.map((f) => {
                  const isSelected = f.id === selectedFrameId;
                  const isEquipped = f.id === equippedFrameId;
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => setSelectedFrameId(f.id)}
                      style={[
                        styles.frameCard,
                        isSelected && { borderColor: f.accentColor, backgroundColor: f.accentColor + '08' },
                      ]}
                    >
                      <View style={{ position: 'relative' }}>
                        <AvatarFrame
                          frameId={f.id}
                          size="sm"
                          animated={false}
                          showGlow={false}
                          avatarSource={require('../../assets/images/snapy-happy.png')}
                        />
                        {isEquipped && (
                          <View style={styles.equippedBadge}>
                            <CheckIcon size={10} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.gridFrameName,
                          isSelected && { color: f.accentColor, fontWeight: '800' },
                        ]}
                        numberOfLines={1}
                      >
                        {f.name}
                      </Text>
                      <Text style={styles.gridFramePrice}>
                        🪙 {f.price}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.footerPriceLabel}>Giá sở hữu:</Text>
              <Text style={styles.footerPriceVal}>🪙 {selectedFrame.price} Xu</Text>
            </View>
            {onEquip && (
              <Pressable
                onPress={() => onEquip(selectedFrame.id)}
                style={[styles.equipBtn, { backgroundColor: selectedFrame.accentColor }]}
              >
                <CheckIcon size={18} color="#FFFFFF" />
                <Text style={styles.equipBtnText}>
                  {equippedFrameId === selectedFrame.id ? 'Đang Dùng' : 'Trang Bị Khung Này'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  ambientBackdrop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  frameMetaCard: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  frameName: {
    fontSize: 18,
    fontWeight: '800',
  },
  rarityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  rarityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sloganText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  descText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  controlsBar: {
    marginTop: 14,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 2,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#0F172A',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sizeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  framesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  frameCard: {
    width: '31%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  gridFrameName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 6,
    textAlign: 'center',
  },
  gridFramePrice: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
    marginTop: 2,
  },
  equippedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  footerPriceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  footerPriceVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#D97706',
  },
  equipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  equipBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
