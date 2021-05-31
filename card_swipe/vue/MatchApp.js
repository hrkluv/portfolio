'use strict';
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
import slideUp from './slideup_view.js';

export default Vue.extend({
  props: {
    indicate: Object
  },
  mixins: [slideUp],
  data() {
    return {
      matchData: {},
      focus: false,
      shortage: false,
      messageMaxLength: 1000,
      message: ''
    }
  },
  created() {
    this.initMatchData()
  },
  computed: {
    isFocus() {
      return {
        is_focus: this.focus
      }
    },
    isShortage() {
      return this.matchData.can_send_mail === -10
    },
    hasAffinity() {
      return this.matchData.affinity.words.length > 0
    },
    nameId() {
      return this.matchData.target_member.id
    },
    inputMessage() {
      return this.message.length > 0
    },
    reachMessageMaxLength() {
      return this.message.length <= this.messageMaxLength
    },
    canSend() {
      return {
        can_send: this.inputMessage && this.reachMessageMaxLength
      }
    }
  },
  methods: {
    initMatchData() {
      this.matchData = {...{
        affinity: {
          words:[]
        },
        can_send_mail: 0,
        image_url: '',
        target_member: {
          age: '',
          id: '',
          image_url: '',
          name: '',
          online_flg: 0,
          tdfk: ''
        }
      }}
    },
    setMatchData(data) {
      this.matchData = {...data.extra_data}
      this.$nextTick(() => {
        this.slideup()
      })
    },
    onFocus() {
      const canSendMail = (this.matchData.can_send_mail == 1)
      if (canSendMail) {
        this.focus = true
      } else {
        this.$emit('need-payment',this.matchData.can_send_mail)
      }
    },
    onBlur() {
      if (!this.inputMessage) this.focus = false
    },
    onSendSubmit() {
      if (this.inputMessage && this.reachMessageMaxLength) {
        const form = document.getElementById("sendMailForm")
        form.submit()
      } else {
        return
      }
    },
    closePopup() {
      this.initMatchData()
      this.close()
    }
  },
  template: `
    <div class="match_app_template" :style="[indicate.body,setTranslate]" :class="[setSlideup,isFocus]">
      <span class="close" @click="closePopup"></span>
      <div class="match_container">
        <header>
          <div class="label">マッチしました！</div>
          <p>{{matchData.target_member.name}}にメッセージを送ってみよう</p>
        </header>
        <div class="thumb_wrap">
          <img :src="matchData.image_url" class="member">
          <img :src="matchData.target_member.image_url" class="target">
        </div>
        <dl class="affinity" v-if="hasAffinity">
          <dt>共通の話題でメッセージしてみよう</dt>
          <dd><ul>
            <li v-for="word in matchData.affinity.words">{{word}}</li>
          </ul></dd>
        </dl>
        <dl class="target_status">
          <dt class="name">{{matchData.target_member.name}}</dt>
          <dd class="age_tdfk">{{matchData.target_member.age}}歳 {{matchData.target_member.tdfk}}</dd>
          <dd class="profile_link"><a :href="'/profile/' + nameId + '/'">プロフィールを見る</a></dd>
        </dl>
        <input type="hidden" name="id" :value="nameId">
        <div class="message_area" v-if="!isShortage">
          <div class="message_textarea">
            <textarea rows="1" name="message" placeholder="メッセージを送ってみよう" v-model="message" @focus="onFocus" @blur="onBlur"></textarea>
          </div>
          <div class="message_send" @click="onSendSubmit">
            <span class="send_prev" v-if="!focus"></span>
            <span class="send_ok" :class="canSend" v-else>OK</span>
          </div>
        </div>
        <div class="shortage_area" v-else>
          <a href="/buy/" class="btn_shortage">ポイントを購入してメッセージを送信</a>
        </div>
        <p class="send_notice">1通目のメッセージでLINE IDなどあなたを特定できる個人情報は送信できません。健全なサービス運営のためにメッセージの確認・削除を行う場合がありますので、これに同意した上で送信してください。</p>
      </div>
    </div>
  `
})