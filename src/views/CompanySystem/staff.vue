<template>
  <div class="company-system-container">
    <ul class="img-ul">
      <li class="img-li"><img :src="staff1" alt=""></li>
      <li class="img-li"><img :src="staff2" alt=""></li>
      <li class="img-li"><img :src="staff3" alt=""></li>
      <li class="img-li"><img :src="staff4" alt=""></li>
      <li class="img-li"><img :src="staff5" alt=""></li>
      <li class="img-li"><img :src="staff6" alt=""></li>
      <li class="img-li"><img :src="staff7" alt=""></li>
      <li class="img-li"><img :src="staff8" alt=""></li>
    </ul>
  </div>
</template>

<script>
import '@/styles/CompanySystem/index.scss'

import staff1 from '@/assets/staff/staff1.jpg'
import staff2 from '@/assets/staff/staff2.jpg'
import staff3 from '@/assets/staff/staff3.jpg'
import staff4 from '@/assets/staff/staff4.jpg'
import staff5 from '@/assets/staff/staff5.jpg'
import staff6 from '@/assets/staff/staff6.jpg'
import staff7 from '@/assets/staff/staff7.jpg'
import staff8 from '@/assets/staff/staff8.jpg'

export default {
  name: 'staff',
  data() {
    return {
      staff1,
      staff2,
      staff3,
      staff4,
      staff5,
      staff6,
      staff7,
      staff8
    }
  }
}
</script>