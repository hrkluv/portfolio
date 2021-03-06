'use strict';
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
import {cardApp} from './CardApp.js'
import matchApp from './MatchApp.js'

new Vue({
  el: "#cardUiApp",
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
    matchApp
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
      const maxArea = 588
      const winH = window.innerHeight
      const header = document.querySelector("header")
      const headerH = header.getBoundingClientRect().height
      const indicatedArea = winH - headerH
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
    emptyState() {
      this.hasCard = false
    }
  }
})