'use strict';
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
import text1 from './Text1.js'
import text2 from './Text2.js'

new Vue({
  el: "#vueMakerWrap",
  data: {
    showStart: false,
    showResult: false,
    showTweet: false,
    showFinished: false,
    stopDoubleTap: false,
    resultText: "",
    textareaCount: 0,
  },
  created() {
    if (this.resultText) {
      this.showResult = true
    } else {
      this.showStart = true
    }
  },
  computed: {
    stopClick() {
      return {
        stop: this.stopDoubleTap
      }
    },
  },
  methods: {
    onDiagnosis() {
      this.stopDoubleTap = true
      this.createText()
    },
    onEntry() {
      this.showResult = false
      this.showTweet = true
    },
    onReDiagnosis() {
      this.showResult = false
      this.showTweet = false
      this.showFinished = false
      this.showStart = true
    },
    enter() {
      if (this.showTweet) {
        this.$refs.textarea.value = `${this.resultText}\n#キャンペーン`
        this.textareaCount = this.$refs.textarea.value.length
      }
    },
    createText() {
      const max = 20
      const firstText = this.returnText(text1)
      const length = firstText.length
      const filterArray = text2.filter((el) => el.length <= (max - length))
      const secondText = this.returnText(filterArray)
      this.resultText = `わたしは${firstText}で${secondText}`
      this.saveResultText(this.resultText)
    },
    saveResultText(t) {
      this.showStart = false
      this.showResult = true
      this.stopDoubleTap = false
    },
    returnText(ary){
      return ary[Math.floor(Math.random() * ary.length)]
    },
    onKeyup(e) {
      this.textareaCount = e.target.value.length
    },
    submitTweet(e) {
      this.showTweet = false
      this.showFinished = true
      this.showLoading = false
    }
  }
})