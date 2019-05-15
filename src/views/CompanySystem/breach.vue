<template>
  <div class="company-system-container">
    <ul class="img-ul">
      <li class="img-li"><img :src="breach1" alt=""></li>
      <li class="img-li"><img :src="breach2" alt=""></li>
      <li class="img-li"><img :src="breach3" alt=""></li>
      <li class="img-li"><img :src="breach4" alt=""></li>
      <li class="img-li"><img :src="breach5" alt=""></li>
      <li class="img-li"><img :src="breach6" alt=""></li>
    </ul>
  </div>
</template>

<script>
import '@/styles/CompanySystem/index.scss'

import breach1 from '@/assets/breach/breach1.jpg'
import breach2 from '@/assets/breach/breach2.jpg'
import breach3 from '@/assets/breach/breach3.jpg'
import breach4 from '@/assets/breach/breach4.jpg'
import breach5 from '@/assets/breach/breach5.jpg'
import breach6 from '@/assets/breach/breach6.jpg'

export default {
  name: 'breach',
  data() {
    return {
      breach1,
      breach2,
      breach3,
      breach4,
      breach5,
      breach6
    }
  }
}
</script>