<template>
  <div class="company-system-container">
    <ul class="img-ul">
      <li class="img-li"><img :src="recommend1" alt=""></li>
      <li class="img-li"><img :src="recommend2" alt=""></li>
      <li class="img-li"><img :src="recommend3" alt=""></li>
      <li class="img-li"><img :src="recommend4" alt=""></li>
      <li class="img-li"><img :src="recommend5" alt=""></li>
      <li class="img-li"><img :src="recommend6" alt=""></li>
    </ul>
  </div>
</template>

<script>
import '@/styles/CompanySystem/index.scss'

import recommend1 from '@/assets/recommend/recommend1.jpg'
import recommend2 from '@/assets/recommend/recommend2.jpg'
import recommend3 from '@/assets/recommend/recommend3.jpg'
import recommend4 from '@/assets/recommend/recommend4.jpg'
import recommend5 from '@/assets/recommend/recommend5.jpg'
import recommend6 from '@/assets/recommend/recommend6.jpg'

export default {
  name: 'recommend',
  data() {
    return {
      recommend1,
      recommend2,
      recommend3,
      recommend4,
      recommend5,
      recommend6
    }
  }
}
</script>