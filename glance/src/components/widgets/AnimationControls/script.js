import { mapState, mapActions } from 'vuex';

export default {
  name: 'AnimationControls',
  computed: {
    ...mapState('animations', {
      playing: (state) => state.playing,
      currentFrame: (state) => state.currentFrame,
      frames: (state) => state.frames,
    }),
    isOnFirstFrame() {
      return this.frames.length > 0 && this.currentFrame === this.frames[0];
    },
    isOnLastFrame() {
      return (
        this.frames.length > 0 &&
        this.currentFrame === this.frames[this.frames.length - 1]
      );
    },
    transformedCurrentFrame() {
      return `${this.currentFrame * 17}°`;
    },
    transformedFrames() {
      return this.frames.map((frame) => `${frame * 17}°`);
    },
  },
  methods: {
    setCurrentFrame(value) {
      // Remove the degree symbol and divide by 17 to get original value
      const originalValue = Number(value.replace('°', '')) / 17;
      this.setFrameIndex(this.frames.indexOf(originalValue));
    },
    ...mapActions('animations', [
      'play',
      'pause',
      'nextFrame',
      'previousFrame',
      'firstFrame',
      'lastFrame',
      'setFrameIndex',
    ]),
  },
};
