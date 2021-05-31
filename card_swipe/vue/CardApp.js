'use strict';
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
//import confirmCardOpen from '/jvs/vue/pages/type/ConfirmCardOpen.js'

const cardModule = Vue.extend({
  props: {
    card: Object,
    member: Object,
    processing: Boolean
  },
  data(){
    return {
      state: '',
      deltaX: '',
      deltaY: '',
      rotate: '',
      moving: false
    }
  },
  computed: {
    getTranslatePositionStyle() {
      return {
        transform: `translate3d(${this.deltaX}px, ${this.deltaY}px, 0px) rotate(${this.rotate}deg)`
      }
    },
    /*
    hasAffinity() {
      return this.card.affinity.count > 0
    },
    affinityCount() {
      const count = this.card.affinity.count
      const text = count > 99 ? '99+' : `${this.card.affinity.count}個`
      return text
    },
    */
    cardClass() {
      return {
        moving: this.moving,
        pointer_events_none: this.processing
      }
    }
  },
  methods: {
    /*
    setFirstCover() {
      if (!this.isOpened) this.firstCover = true
    },
    */
    initSwipe() {
      this.deltaX = 0
      this.deltaY = 0
      this.rotate = 0
    },
    setSwipe() {
      this.initSwipe()
      const swipe = new Hammer(this.$el)
      swipe.on('pan', (e) => {
        if (e.deltaX === 0 || (e.center.x === 0 && e.center.y === 0)) return
        this.moving = true
        this.$emit('set-processing')
        
        this.state = e.deltaX > 0 ? 1 : 2

        const xMulti = e.deltaX * 0.03
        const yMulti = e.deltaY / 80
        const rotate = xMulti * yMulti
  
        this.deltaX = e.deltaX
        this.deltaY = e.deltaY
        this.rotate = rotate
      })
      swipe.on('panend', (e) => {
        this.moving = false
        const moveOutWidth = document.body.clientWidth;
        const keep = Math.abs(e.deltaX) < 80 || Math.abs(e.velocityX) < 0.5;
        if (keep) {
          this.initSwipe()
          this.$emit('clear-processing')
        } else {
          var endX = Math.max(Math.abs(e.velocityX) * moveOutWidth, moveOutWidth);
          var toX = e.deltaX > 0 ? endX : -endX;
          var endY = Math.abs(e.velocityY) * moveOutWidth;
          var toY = e.deltaY > 0 ? endY : -endY;
          var xMulti = e.deltaX * 0.03;
          var yMulti = e.deltaY / 80;
          var rotate = xMulti * yMulti;

          this.deltaX = toX
          this.deltaY = toY + e.deltaY
          this.rotate = rotate

          //const type = (this.state === 1)

          /*
          if (type) {
            if (this.isOpened) {
              this.$emit('on-action',this.state)
            } else {
              this.initSwipe()
              setTimeout(() => {
                this.$emit('confirm-card-open')
                this.$emit('clear-processing')
              },300)
            }
          } else {
            this.$emit('on-action',this.state)
          }
          */
          this.$emit('on-action',this.state)
        }
      })
    },
    onSwipe(state) {
      const type = (state === 1)
      const moveOutWidth = document.body.clientWidth * 1.5;
      this.deltaY = 0
      this.rotate = 0
      if (type) {
        /*
        if (this.isOpened) {
          this.deltaX = moveOutWidth
          this.$emit('on-action',state)
        } else {
          this.$emit('confirm-card-open')
          this.$emit('clear-processing')
        }
        */
        this.deltaX = moveOutWidth
        this.$emit('on-action',state)
      } else {
        this.deltaX = `-${moveOutWidth}`
        this.$emit('on-action',state)
      }
    },
    /*
    async cardOpen() {
      const res = await this.interestedOpenApi(this.card.interested_id)
      const isSuccess = Boolean( parseInt(res.success,10) )
      if (isSuccess) {
        const imageUrl = res.extra_data.image_url
        this.firstCover = false
        setTimeout(() => {
          this.isOpened = true
          this.$set(this.card, "image_url", imageUrl)
        },310)
      } else {
        const isShortage = (res.code === -10)
        if (isShortage) {
          const shortagePopup = document.querySelector('.popup-shortage')
          shortagePopup.classList.add('fadein')
        } else {
          return
        }
      }
    },
    async interestedOpenApi(id) {
      const res = await axios.get(`/api/interested/open?interested_id=${id}`)
      return res.data
    },
    async openProfile() {
      if (this.isOpened) {
        const res = await this.interestedOpenApi(this.card.interested_id)
        const isSuccess = Boolean( parseInt(res.success,10) )
        if (isSuccess) {
          location.href = `/profile/${this.card.id}/`
        } else {
          const isShortage = (res.code === -10)
          if (isShortage) {
            const shortagePopup = document.querySelector('.popup-shortage')
            shortagePopup.classList.add('fadein')
          } else {
            return
          }
        }
      } else {
        this.$emit('confirm-card-open')
      }
    }
    */
  },
  template: `
    <div class="card_item" :class="cardClass" :style="getTranslatePositionStyle">
      <div class="card_item_photo">
          <div class="photo" :style="{backgroundImage: 'url(' + card.image_url + ')'}"></div>
      </div>
      <dl class="card_item_status">
        <dt>{{card.age}}歳 {{card.tdfk}}</dt>
        <dd class="job">{{card.job}}</dd>
      </dl>
    </div>
  `
})

const btnTypeModule = Vue.extend({
  props: {
    processing: Boolean
  },
  methods: {
    onType() {
      this.$emit('set-processing')
      this.$emit('on-swipe',1)
    }
  },
  template: `
    <a href="#" class="btn type" :class="{'pointer_events_none': processing}" @click.prevent="onType"></a>
  `
})

const btnSkipModule = Vue.extend({
  props: {
    processing: Boolean
  },
  methods: {
    onSkip() {
      this.$emit('set-processing')
      this.$emit('on-swipe',2)
    }
  },
  template: `
    <a href="#" class="btn skip" :class="{'pointer_events_none': processing}" @click.prevent="onSkip"></a>
  `
})

export const cardApp = Vue.extend({
  props: {
    indicate: Object,
    member: Object,
  },
  data () {
    return {
      showBtn: false,
      //firstCover: false,
      lastIdx: '',
      getPage: 1,
      cardData: [],
      currentRef: '',
      currentCardId: '',
      //judgeData: {},
      processing: false
    }
  },
  created() {
    this.getCardApi('created')
  },
  watch: {
    cardData(newVal,oldVal) {
      const length = this.cardData.length
        const lastIdx = length - 1
        this.lastIdx = lastIdx
        const currentCard = this.cardData[lastIdx]
        this.currentCardId = currentCard.id
        this.$nextTick(function(){
          this.currentRef = this.$refs[this.currentCardId][0]
          this.currentRef.setSwipe()
          /*
          if (!this.firstCover) {
            setTimeout(() => {
              this.currentRef.setFirstCover()
            },1000)
            this.firstCover = true
          }
          */
          
        })
    },
  },
  methods: {
    async getCardApi(lifecycle) {
      const isLoad = (lifecycle == "created")
      const list = this.cardData ? this.cardData : []
      //const res = await axios.get(`/api/interested/from?page=${this.getPage}`)
      const resultBody = [
        {
          id:1,
          image_url: "./img/photo_01.jpg",
          age: 26,
          tdfk: "東京都",
          job: "事務職/OL"
        },
        {
          id:2,
          image_url: "./img/photo_02.jpg",
          age: 21,
          tdfk: "埼玉県",
          job: "事務職/OL"
        },
        {
          id:3,
          image_url: "./img/photo_03.jpg",
          age: 28,
          tdfk: "千葉県",
          job: "事務職/OL"
        }
      ]
      const length = resultBody.length

      if (isLoad) {
        if (length > 0) {
          this.showBtn = true
        } else {
          this.$emit('empty-state')
        }
      }
      if (length > 0) this.cardData = [...resultBody.reverse(), ...list.reverse()]
      
    },
    /*
    async getEpochToken(id) {
      try {
        const res = await axios.get(`/interested/get_epoch_ttoken_json?target_member_id=${id}`)
        this.$set(this.judgeData,'.ttoken', res.data.ttoken)
        this.$set(this.judgeData,'.epc', res.data.epoch)
        return
      } catch(e) {
        return
      }   
    },
    async judge(state) {
      await this.getEpochToken(this.currentCardId)
      const params = new URLSearchParams(Vue.util.extend({
        from_type: state,
        target_member_id: this.currentCardId,
        route: "interested_from",
        get_affinity: 1,
      },this.judgeData))
      const judge = await axios.get(`/api/interested/judge?${params.toString()}`)
      const isSuccess = Boolean( parseInt(judge.data.success, 10) )
      if (isSuccess) {
        return judge.data
      } else {
        throw judge.data
      }
    },
    */
    onSwipe(state) {
      this.currentRef.onSwipe(state)
    },
    async transitionEnd() {
      return new Promise((resolve) => {
        this.currentRef.$el.addEventListener('transitionend',() => {
          resolve()
        })
      })
    },
    async processAll(state) {
      await this.transitionEnd()
      this.$delete(this.cardData, this.lastIdx)
      if (this.cardData.length < 1) {
        this.$emit('empty-state')
      }
      if (isMatched) this.$emit('on-match',judge)
      setTimeout(() => {
        this.processing = false
      },300)
      /*
      try {
        const [judge] = await Promise.all([
          this.judge(state),
          this.transitionEnd()
        ])
        const isMatched = Boolean( parseInt(judge.result_body.is_matched,10) )
        this.$delete(this.cardData, this.lastIdx)
        if ( this.cardData.length === 5 ) {
          this.getPage = this.getPage + 1
          this.getCardApi()
        }
        if (this.cardData.length < 1) {
          this.$emit('empty-state')
        }
        if (isMatched) this.$emit('on-match',judge)
        setTimeout(() => {
          this.processing = false
        },300)
      } catch ( err) {
        const isShortage = (err.code === -10)
        if (isShortage) {
          const shortagePopup = document.querySelector('.popup-shortage')
          shortagePopup.classList.add('fadein')
          this.currentRef.initSwipe()
        } else {
          return
        }
        this.processing = false
      }
      */
    },
    async onAction(state) {
      this.processAll(state)
    },
    setProcessing() {
      this.processing = true
    },
    clearProcessing() {
      this.processing = false
    },
    confirmCardOpen() {
      const confirmCardOpenPopup = this.$refs.confirmCardOpen
      confirmCardOpenPopup.open(this.currentRef)
    }
  },
  components: {
    cardModule,
    btnTypeModule,
    btnSkipModule,
    //confirmCardOpen
  },
  template: `
    <div class="card_app_template">
      <div class="card_wrap" :style="indicate.card">
      <card-module
        v-for="card in cardData"
        :card="card"
        :key="card.id"
        :ref="card.id"
        :member="member"
        :processing="processing"
        @set-processing="setProcessing"
        @clear-processing="clearProcessing"
        @on-action="onAction"
      ></card-module>
      </div>
      <div class="btn_wrap" :style="indicate.btn" v-if="showBtn">
        <btn-skip-module
          :processing="processing"
          @set-processing="setProcessing"
          @on-swipe="onSwipe"
        ></btn-skip-module>
        <btn-type-module
          :processing="processing"
          @set-processing="setProcessing"
          @on-swipe="onSwipe"
        ></btn-type-module>
      </div>
    </div>
  `
})