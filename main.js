Vue.component('card-selector', {
  template: `
  <div>
    <ul>
      <li v-for="n in 13" @click="add(Number($event.target.innerText))">{{ n }}</li>
    </ul>
    <ul class="my">
      <li v-for="n in cards" @click="remove(Number($event.target.innerText))">{{ n }}</li>
    </ul>
  </div>
  `,
  methods: {
    add: function(n) {
      this.cards.push(n)
      this.cards.sort(function(a, b) {return a - b})
      this.$root.update()
    },
    remove: function(n) {
      var i = this.cards.indexOf(n);
      if (i >= 0)
      {
        this.cards.splice(i, 1);
        this.$root.update()
      }
    }
  },
  data() {
    return {
      cards: []
    }
  }
})

new Vue({
  el: '#app',
  data: {
    results: []
  },
  methods: {
    update: function() {
      this.results = [];
      var fang = this.$refs.fang.cards
      var card = new Set(this.$refs.card.cards)

      if (fang.length == 0 || card.length == 0)
      {
        return
      }

      var hashCodes = []
      for (var c of card) {
        var bits = []
        var maxBit = 0
        for (var i = 0; i < fang.length; i++) {
          bits[i] = false;
        }

        var countTrue = 0;
        do {

          for (var i = 0; i < bits.length; i++) {
            if (bits[i])
            {
              bits[i] = false
            }
            else
            {
              bits[i] = true
              if (i > maxBit)
              {
                maxBit++
              }
              break
            }
          }

          countTrue = 0
          for (var i = 0; i <= maxBit; i++) {
            if (bits[i])
            {
              countTrue++
            }
          }

          if (countTrue > 1) // 13 + 13 < 36
          {
            var result = [ c ]
            var sum = c
            for (var i = 0; i <= maxBit; i++) {
              if (bits[i])
              {
                result.push(fang[i])
                sum += fang[i]
              }
            }
            if (sum == 36)
            {
              var hash = 0
              for (n of result) {
                hash = hash * 31 + n
              }
              if (hashCodes.indexOf(hash) < 0)
              {
                this.results.push(result)
                hashCodes.push(hash)
              }
            }
          }

        } while (countTrue < fang.length);
      }
    }
  }
})
