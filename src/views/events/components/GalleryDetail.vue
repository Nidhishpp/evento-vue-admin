<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-position="left"
      label-width="100px"
    >
      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 30px" label="Title" prop="title">
          <el-input
            v-model="postForm.title"
            placeholder="Please input"
            :maxlength="100"
            required
          />
        </el-form-item>

        <el-form-item style="margin-bottom: 30px" label="Image" prop="image">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-remove="handleRemove"
            :auto-upload="false"
            :on-change="handleChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item style="margin-bottom: 30px" label="Featured">
          <el-switch
            v-model="postForm.featured"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitForm"
          >{{ loading ? "Submitting ..." : "Submit" }}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/SingleImage3'
import { createGallery } from '@/api/gallery'

export default {
  name: 'GalleryDetail',
  components: {
    Upload
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + ' required',
          type: 'error'
        })
        callback(new Error(rule.field))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {
        title: '',
        image: '',
        featured: true
      },
      rules: {
        image: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }]
      },
      tempRoute: {},
      fileList: []
    }
  },
  created() {
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    this.setPageTitle()
  },
  methods: {
    setPageTitle() {
      const title = 'Add Gallery'
      document.title = title
    },
    submitForm() {
      const formData = new FormData()
      formData.append('image', this.postForm.image.raw)
      formData.append('title', this.postForm.title)
      formData.append('featured', this.postForm.featured)

      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          createGallery(formData).then((response) => {
            this.$refs.postForm.resetFields()
            this.$router.push('/gallery/list')
          })

          this.loading = false
        } else {
          this.$notify({
            title: 'Error',
            message: 'Insert valid data',
            type: 'error',
            duration: 2000
          })
          return false
        }
      })
    },
    handleRemove(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
      this.postForm.image = this.fileList[0]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
	position: relative;

	.createPost-main-container {
		padding: 40px 45px 20px 50px;

		.postInfo-container {
			position: relative;
			@include clearfix;
			margin-bottom: 10px;

			.postInfo-container-item {
				float: left;
			}
		}
	}

	.word-counter {
		width: 40px;
		position: absolute;
		right: 10px;
		top: 0px;
	}
}

.article-textarea ::v-deep {
	textarea {
		padding-right: 40px;
		resize: none;
		border: none;
		border-radius: 0px;
		border-bottom: 1px solid #bfcbd9;
	}
}
</style>
