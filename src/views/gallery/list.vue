<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="180px" align="center" label="Image">
        <template slot-scope="scope">
          <span>
            <img
              :src="scope.row.image"
              :alt="scope.row.title"
              width="100%"
            ></span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="Title" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Featured" width="110">
        <template slot-scope="{ row }">
          <el-tag :type="row.featured | statusFilter">
            {{ row.featured ? "Yes" : "No" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="400">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click.prevent="updateFeatured(scope.row)"
          >
            Switch Featured
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click.prevent="deleteOne(scope.row._id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList, updateGallery, deleteGallery } from '@/api/gallery'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GalleryList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      return status ? 'success' : 'danger'
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      })
    },
    async deleteOne(id) {
      await this.$confirm('Do you want to delete?')
        .then(async(_) => {
          this.listLoading = true
          deleteGallery(id).then((response) => this.getList())
          this.listLoading = false
        })
        .catch()
    },
    async updateFeatured(row) {
      var featured = { featured: !row.featured }
      await this.$confirm('Do you want to switch featured?')
        .then(async(_) => {
          this.listLoading = true
          updateGallery(row._id, featured).then((response) => this.getList())
          this.listLoading = false
        })
        .catch()
    }
  }
}
</script>

<style scoped>
.edit-input {
	padding-right: 100px;
}
.cancel-btn {
	position: absolute;
	right: 15px;
	top: 10px;
}
</style>
