'use strict';
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
import {cardApp} from './CardApp.js'
//import matchApp from '/jvs/vue/pages/type/MatchApp.js'
//import needPayment from '/jvs/vue/pages/type/NeedPayment.js'

new Vue({
  el: "#typeCardUiApp",
  data: {
    hasCard: true,
    isSmallIndicate: false,
    indicate: {
      body: {
        height: '',
      },
      container: {
        height: '',
      },
      card: {
        height: '',
      },
      btn: {
        height: '',
      }
    },
  },
  components: {
    cardApp,
    //matchApp,
    //needPayment
  },
  computed: {
    setIndicateClass() {
      return {
        small_indicate: this.isSmallIndicate
      }
    }
  },
  created() {
    this.setIndicatedArea()
  },
  methods: {
    setIndicatedArea() {
      const maxArea = 588 //上部余白16px分込み
      const winH = window.innerHeight
      const header = document.querySelector(".type-cardui_header")
      const headerH = header ? header.getBoundingClientRect().height : 0
      const bottomnav = document.querySelector("#bottom_navigation")
      const bottomnavH = bottomnav ? bottomnav.getBoundingClientRect().height : 0
      const indicatedArea = winH - headerH - bottomnavH //ヘッダーラベル,ボトムナビ分
      if (indicatedArea >= maxArea) {
        this.$set(this.indicate.container, 'height', `${maxArea}px`)
        this.$set(this.indicate.card, 'height', '452px')
        this.$set(this.indicate.btn, 'height', '120px')
      } else {
        this.$set(this.indicate.container, 'height', `${indicatedArea}px`)
        this.$set(this.indicate.card, 'height', `${(indicatedArea * 0.8) - 16}px`)
        this.$set(this.indicate.btn, 'height', `${indicatedArea * 0.2}px`)
        this.smallIndicate = true
      }
      this.$set(this.indicate.body, 'height', `${winH}px`)
    },
    onMatch(data) {
      const matchApp = this.$refs.matchApp
      matchApp.setMatchData(data)
    },
    needPayment (state) {
      const needPaymentPopup = this.$refs.needPayment
      needPaymentPopup.onChangeState(state)
    },
    emptyState() {
      this.hasCard = false
    }
  }
})