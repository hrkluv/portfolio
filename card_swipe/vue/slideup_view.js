'use strict'
//スライドアップ
export default {
  data() {
    return {
      height: '',
      exheight: 95 ,
      isSlideup: false,
      translateY: 9999
    }
  },
  computed: {
    getWinHeight() {
      return window.innerHeight
      },
    setSlideup() {
      return {
        slideup: this.isSlideup
      }
    },
    setHeight() {
      return {
        height: this.height + 'px'
      }
    },
    setTranslate() {
      return {
        transform: `translate3d(0,${this.translateY}px,0)`
      }
    }
  },
  created() {
    this.translateY = this.getWinHeight
    this.height = this.getWinHeight + this.exheight
  },
  methods:{
    slideup() {
      this.isSlideup = true
      this.translateY = 0
    },
    close() {
      this.isSlideup = false
      this.translateY = this.height
    }
  }
}