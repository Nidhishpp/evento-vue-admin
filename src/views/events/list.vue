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

      <el-table-column align="left" label="Description" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="Gallery" min-width="50">
        <template slot-scope="scope">
          <span
            v-if="scope.row.gallery"
            class="link-type"
            @click="handleFetchGallery(scope.row.gallery)"
          >Images</span>
          <span v-else>No Images</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="Packages" min-width="50">
        <template slot-scope="scope">
          <span
            v-if="scope.row.gallery"
            class="link-type"
            @click="handleFetchPackages(scope.row.packages)"
          >Packages</span>
          <span v-else>No Packages</span>
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
    <el-dialog :visible.sync="dialogGalleryVisible" title="Gallery">
      <el-row :gutter="8">
        <el-col
          v-for="image in gallery"
          :key="image"
          :xs="{ span: 24 }"
          :sm="{ span: 12 }"
          :md="{ span: 12 }"
          :lg="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <el-image :src="image">
            <div slot="placeholder" class="image-slot">
              Loading<span class="dot">...</span>
            </div>
          </el-image>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogGalleryVisible = false"
        >Close</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogPackagesVisible" title="Gallery">
      <el-row :gutter="8">
        <el-col
          v-for="package_data in packages"
          :key="package_data._id"
          :xs="{ span: 24 }"
          :sm="{ span: 12 }"
          :md="{ span: 12 }"
          :lg="{ span: 8 }"
          :xl="{ span: 8 }"
        >
          <el-card class="box-card" :header="package_data.title">
            <div
              v-for="feature in package_data.features"
              :key="feature"
              class="text item"
            >
              {{ feature }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPackagesVisible = false"
        >Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, featureUpdateEvent, deleteEvent } from '@/api/events'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'EventList',
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
        limit: 10
      },
      gallery: [],
      dialogGalleryVisible: false,
      packages: {},
      dialogPackagesVisible: false
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
          deleteEvent(id).then((response) => this.getList())
          this.listLoading = false
        })
        .catch()
    },
    async updateFeatured(row) {
      var featured = { featured: !row.featured }
      await this.$confirm('Do you want to switch featured?')
        .then(async(_) => {
          this.listLoading = true
          featureUpdateEvent(row._id, featured).then((response) =>
            this.getList()
          )
          this.listLoading = false
        })
        .catch()
    },
    handleFetchGallery(data) {
      this.gallery = data
      this.dialogGalleryVisible = true
    },
    handleFetchPackages(data) {
      this.packages = data
      this.dialogPackagesVisible = true
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

.text {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}
.clearfix:after {
	clear: both;
}

.box-card {
	width: 100%;
}
</style>
