<template>
  <div class="company-system-container">
    <ul class="img-ul">
      <li class="img-li"><img :src="salary1" alt=""></li>
      <li class="img-li"><img :src="salary2" alt=""></li>
      <li class="img-li"><img :src="salary3" alt=""></li>
      <li class="img-li"><img :src="salary4" alt=""></li>
      <li class="img-li"><img :src="salary5" alt=""></li>
      <li class="img-li"><img :src="salary6" alt=""></li>
      <li class="img-li"><img :src="salary7" alt=""></li>
    </ul>
  </div>
</template>

<script>
import '@/styles/CompanySystem/index.scss'

import salary1 from '@/assets/salary/salary1.jpg'
import salary2 from '@/assets/salary/salary2.jpg'
import salary3 from '@/assets/salary/salary3.jpg'
import salary4 from '@/assets/salary/salary4.jpg'
import salary5 from '@/assets/salary/salary5.jpg'
import salary6 from '@/assets/salary/salary6.jpg'
import salary7 from '@/assets/salary/salary7.jpg'

export default {
  name: 'salary',
  data() {
    return {
      salary1,
      salary2,
      salary3,
      salary4,
      salary5,
      salary6,
      salary7
    }
  }
}
</script>