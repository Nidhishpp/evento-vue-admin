<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px">
    <el-table-column label="Event Name" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.event_name }}
      </template>
    </el-table-column>
    <el-table-column label="Package" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.package_name }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.start_date | dateFormater }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.end_date | dateFormater }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { pendingBookingList } from '@/api/remote-search'
export default {
  filters: {
    dateFormater: function(value) {
      var timeStr = value
      var intermediate = timeStr.split('T')
      var newStr = intermediate[0].split('-').join('/') + ' ' + intermediate[1].split('.')[0] + ' GMT'
      var newDate = new Date(newStr)
      var newFormat = 1 + newDate.getUTCMonth() + '/' + newDate.getUTCDate() + '/' + newDate.getFullYear()
      return newFormat
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      pendingBookingList().then((response) => {
        this.list = response.data.slice(0, 8)
      })
    }
  }
}
</script>
