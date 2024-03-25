<template>
  <div style="margin-top: 20px;">
    <BRow>
      <BCol cols="12">
        <h3 style="margin: 5%; float: left;">Merhaba, QuizApp sınavına hoşgeldin.</h3>
      </BCol>
    </BRow>
    <BRow>
      <BCol cols="12">
        <p style="margin-left: 5%; float: left;">Sınav Kuralları</p>
      </BCol>
    </BRow>
    <BRow>
      <BCol cols="12" md="12" sm="12">
          <ul class="list-group border-0" style="border-width: 0px;">
            <li class="list-group-item border-0"><img src="../assets/Icon/exclamation-circle.svg" width="20"
                style="margin-left: 5%; float: left;">
              <span style="margin-left: 1%; float: left;">Her bir soru için verilen süre 30 saniyedir. </span>
            </li>
            <li class="list-group-item border-0"><img src="../assets/Icon/exclamation-circle.svg" width="20"
                style="margin-left: 5%; float: left;">
              <span style="margin-left: 1%; float: left;">İlk 10 saniye sorular cevaplanamaz.</span>
            </li>
            <li class="list-group-item border-0"><img src="../assets/Icon/exclamation-circle.svg" width="20"
                style="margin-left: 5%; float: left;">
              <span style="margin-left: 1%; float: left;">Geçmiş sorulara dönülemez.</span>
            </li>
            <li class="list-group-item border-0"><img src="../assets/Icon/exclamation-circle.svg" width="20"
                style="margin-left: 5%; float: left;">
              <span style="margin-left: 1%; float: left;">Her soru toplam 4’er şıktan oluşmaktadır. </span>
            </li>
          </ul>
      </BCol>
    </BRow>
    <BRow>
      <BCol>
        <router-link to="/questions">
          <BButton variant="success">SINAVA BAŞLA</BButton>
        </router-link>
      </BCol>
    </BRow>
  </div>
</template>

<script>

import { BRow, BCol, BButton } from 'bootstrap-vue'
export default {
  components: {
    BRow, BCol, BButton
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
  }
}
</script>
<style scoped></style>