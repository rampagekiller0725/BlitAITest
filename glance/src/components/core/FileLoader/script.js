import { mapGetters, mapState, mapActions } from 'vuex';

import RawFileReader from 'paraview-glance/src/components/core/RawFileReader';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';
import GirderBox from 'paraview-glance/src/components/core/GirderBox';

export default {
  name: 'FileLoader',
  components: {
    RawFileReader,
    DragAndDrop,
    GirderBox,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      active_tab: 0,
    };
  },
  mounted() {
    const tempInterval = setInterval(() => {
      if (this.fileList.length > 0 && this.allFilesReady) {
        this.loadFiles();
        clearInterval(tempInterval);
      }
    }, 100);
  },
  computed: {
    ...mapState('files', {
      fileList: (state) => Array.from(state.fileList).reverse(),
      pendingFiles: (state) =>
        state.fileList.reduce(
          (flag, file) =>
            flag || (file.state !== 'ready' && file.state !== 'error'),
          false
        ),
      hasReadyFiles: (state) =>
        state.fileList.reduce(
          (flag, file) => flag || file.state === 'ready',
          false
        ),
      allFilesReady: (state) =>
        state.fileList.every((file) => file.state === 'ready'),
    }),
    ...mapGetters('files', ['anyErrors']),
  },
  methods: {
    ...mapActions('files', [
      'openFiles',
      'promptLocal',
      'deleteFile',
      'setRawFileInfo',
      'load',
      'resetQueue',
    ]),
    loadFiles() {
      this.loading = true;
      this.load().finally(() => {
        this.close();
        this.$emit('load');
        setTimeout(() => {
          this.loading = false;
        }, 10);
      });
    },
    deleteFileAtRevIndex(revIdx) {
      return this.deleteFile(this.fileList.length - 1 - revIdx);
    },
    setRawFileInfoAtRevIndex(revIdx, info) {
      return this.setRawFileInfo({
        index: this.fileList.length - 1 - revIdx,
        info,
      });
    },
    onDialogChange(state) {
      if (!state) {
        this.close();
      } else {
        this.$emit('input', true);
      }
    },
    close() {
      this.$emit('input', false);
      setTimeout(() => this.resetQueue(), 10);
    },
  },
};
