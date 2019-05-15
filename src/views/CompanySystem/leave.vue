<template>
  <div class="company-system-container">
    <ul class="img-ul">
      <li class="img-li"><img :src="leave1" alt=""></li>
      <li class="img-li"><img :src="leave2" alt=""></li>
      <li class="img-li"><img :src="leave3" alt=""></li>
      <li class="img-li"><img :src="leave4" alt=""></li>
      <li class="img-li"><img :src="leave5" alt=""></li>
      <li class="img-li"><img :src="leave6" alt=""></li>
      <li class="img-li"><img :src="leave7" alt=""></li>
      <li class="img-li"><img :src="leave8" alt=""></li>
    </ul>
  </div>
</template>

<script>
import '@/styles/CompanySystem/index.scss'

import leave1 from '@/assets/leave/leave1.jpg'
import leave2 from '@/assets/leave/leave2.jpg'
import leave3 from '@/assets/leave/leave3.jpg'
import leave4 from '@/assets/leave/leave4.jpg'
import leave5 from '@/assets/leave/leave5.jpg'
import leave6 from '@/assets/leave/leave6.jpg'
import leave7 from '@/assets/leave/leave7.jpg'
import leave8 from '@/assets/leave/leave8.jpg'

export default {
  name: 'leave',
  data() {
    return {
      leave1,
      leave2,
      leave3,
      leave4,
      leave5,
      leave6,
      leave7,
      leave8
    }
  }
}
</script>